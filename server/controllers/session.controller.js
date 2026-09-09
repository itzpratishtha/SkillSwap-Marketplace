import Session from "../models/Session.js";
import { SESSION_STATUS } from "../constants/sessionStatus.js";
import LearningRequest from "../models/LearningRequest.js";
import User from "../models/User.js";
import { REQUEST_STATUS } from "../constants/requestStatus.js";
import { REQUEST_TYPES } from "../constants/requestStatus.js";
import { PAYMENT_STATUS } from "../constants/paymentStatus.js";
import { transferCredits } from "../services/credit.service.js";
import { createNotification } from "../services/notification.service.js";
import { NOTIFICATION_TYPES } from "../constants/notificationTypes.js";

// ===============================
// Get Teaching Sessions
// ===============================
export const getTeachingSessions = async (req, res) => {
  try {
    const sessions = await Session.find({
      mentor: req.user._id,
    })
      .populate("learner", "name email profilePhoto")
      .populate("skill", "name")
      .sort({ scheduledAt: 1 });

    return res.status(200).json({
      success: true,
      sessions,
    });
  } catch (error) {
    console.error("Error fetching teaching sessions:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch teaching sessions.",
    });
  }
};

// ===============================
// Get Learning Sessions
// ===============================
export const getLearningSessions = async (req, res) => {
  try {
    const sessions = await Session.find({
      learner: req.user._id,
    })
      .populate("mentor", "name email profilePhoto")
      .populate("skill", "name")
      .sort({ scheduledAt: 1 });

    return res.status(200).json({
      success: true,
      sessions,
    });
  } catch (error) {
    console.error("Error fetching learning sessions:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch learning sessions.",
    });
  }
};

// ===============================
// Schedule Session
// ===============================
export const scheduleSession = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      scheduledAt,
      duration = 60,
      mode,
      meetingLink,
      location,
    } = req.body || {};

    if (!scheduledAt) {
      return res.status(400).json({
        success: false,
        message: "Session date and time are required.",
      });
    }

    if (!Number.isFinite(Number(duration)) || Number(duration) <= 0) {
    return res.status(400).json({
        success: false,
        message: "Duration must be greater than 0 minutes.",
    });
}

if (Number(duration) > 480) {
    return res.status(400).json({
        success: false,
        message: "Session duration cannot exceed 8 hours.",
    });
}

    if (!mode) {
      return res.status(400).json({
        success: false,
        message: "Session mode is required.",
      });
    }

    if (!["ONLINE", "OFFLINE"].includes(mode)) {
      return res.status(400).json({
        success: false,
        message: "Invalid session mode.",
      });
    }

    const session = await Session.findById(id);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found.",
      });
    }

    if (session.mentor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Only the mentor can schedule this session.",
      });
    }

    if (session.status === SESSION_STATUS.COMPLETED) {
      return res.status(400).json({
        success: false,
        message: "Completed sessions cannot be rescheduled.",
      });
    }

    const sessionDate = new Date(scheduledAt);
    if (sessionDate <= new Date()) {
    return res.status(400).json({
        success: false,
        message: "Session date and time must be in the future.",
    });
}

    if (isNaN(sessionDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid session date.",
      });
    }

    if (mode === "ONLINE" && (!meetingLink || meetingLink.trim() === "")) {
      return res.status(400).json({
        success: false,
        message: "Meeting link is required for online sessions.",
      });
    }

    if (mode === "OFFLINE" && (!location || location.trim() === "")) {
      return res.status(400).json({
        success: false,
        message: "Location is required for offline sessions.",
      });
    }

    session.meetingLink =
    mode === "ONLINE" ? meetingLink : "";

session.location =
    mode === "OFFLINE" ? location : "";

    session.scheduledAt = sessionDate;
    session.duration = duration;
    session.mode = mode;
    session.meetingLink = mode === "ONLINE" ? meetingLink : "";
    session.location = mode === "OFFLINE" ? location : "";
    session.lastUpdatedAt = new Date();
    session.status = SESSION_STATUS.SCHEDULED;
    await session.save();

    await session.populate("mentor", "name email profilePhoto");
    await session.populate("learner", "name email profilePhoto");
    await session.populate("skill", "name");
    const request = await LearningRequest.findById(
    session.learningRequest
);

if (!request) {
    return res.status(404).json({
        success: false,
        message: "Learning request not found."
    });
}

    await createNotification({
    user: request.learner,
    title: "Session Scheduled",
    message: "A learning session has been scheduled for your request.",
    type: NOTIFICATION_TYPES.SESSION
});

    return res.status(200).json({
      success: true,
      message: "Session scheduled successfully.",
      session,
    });
  } catch (error) {
    console.error("Error scheduling session:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error while scheduling the session.",
    });
  }
};

// ===============================
// Complete Session
// ===============================
export const completeSession = async (req, res) => {
    try {
        const { id } = req.params;

        const session = await Session.findById(id);

        if (!session) {
            return res.status(404).json({
                success: false,
                message: "Session not found.",
            });
        }

        // ------------------------------------------------
        // 1. Session must be scheduled
        // ------------------------------------------------

        if (!session.scheduledAt) {
            return res.status(400).json({
                success: false,
                message: "Session has not been scheduled yet.",
            });
        }

        // ------------------------------------------------
        // 2. Session must not already be completed
        // ------------------------------------------------

        if (session.status === SESSION_STATUS.COMPLETED) {
            return res.status(400).json({
                success: false,
                message: "Session is already completed.",
            });
        }

        // ------------------------------------------------
        // 3. Session must have actually ended
        // ------------------------------------------------

        const scheduledStart = new Date(session.scheduledAt);

        const scheduledEnd = new Date(
            scheduledStart.getTime() +
            Number(session.duration || 60) * 60 * 1000
        );

        if (new Date() < scheduledEnd) {
            return res.status(400).json({
                success: false,
                message:
                    "The session cannot be completed before its scheduled end time.",
            });
        }

        // ------------------------------------------------
        // 4. Identify who is marking it complete
        // ------------------------------------------------

        const userId = req.user._id.toString();

        const mentorId = session.mentor.toString();
        const learnerId = session.learner.toString();

        if (
            userId !== mentorId &&
            userId !== learnerId
        ) {
            return res.status(403).json({
                success: false,
                message:
                    "You are not authorized to complete this session.",
            });
        }

        // ------------------------------------------------
        // 5. Mark completion for the current user
        // ------------------------------------------------

        if (userId === mentorId) {

            if (session.mentorCompleted) {
                return res.status(400).json({
                    success: false,
                    message:
                        "You have already marked this session as completed.",
                });
            }

            session.mentorCompleted = true;
        }

        if (userId === learnerId) {

            if (session.learnerCompleted) {
                return res.status(400).json({
                    success: false,
                    message:
                        "You have already marked this session as completed.",
                });
            }

            session.learnerCompleted = true;
        }

        // ------------------------------------------------
        // 6. Check whether BOTH users have confirmed
        // ------------------------------------------------

        const bothCompleted =
            session.mentorCompleted &&
            session.learnerCompleted;

        if (!bothCompleted) {

            await session.save();

            return res.status(200).json({
                success: true,
                completed: false,
                message:
                    userId === mentorId
                        ? "You marked the session as completed. Waiting for the learner to confirm."
                        : "You marked the session as completed. Waiting for the mentor to confirm.",
                session,
            });
        }

        // ------------------------------------------------
        // 7. Both confirmed → complete session
        // ------------------------------------------------

        const request = await LearningRequest.findById(
            session.learningRequest
        );

        if (!request) {
            return res.status(404).json({
                success: false,
                message: "Learning request not found.",
            });
        }

        // ------------------------------------------------
// 8. Transfer credits exactly once
// ------------------------------------------------

if (
    request.requestType === REQUEST_TYPES.CREDITS &&
    request.paymentStatus === PAYMENT_STATUS.RESERVED &&
    !session.creditsSettled
) {

    const learner = await User.findById(
        request.learner
    );

    const mentor = await User.findById(
        request.mentor
    );

    if (!learner || !mentor) {
        return res.status(404).json({
            success: false,
            message:
                "Learner or mentor could not be found.",
        });
    }

    const amount = session.creditCost || request.creditCost || 0;

    if (amount <= 0) {
        return res.status(400).json({
            success: false,
            message:
                "Invalid credit cost for this session.",
        });
    }

    await transferCredits(
        learner,
        mentor,
        amount
    );

    request.paymentStatus =
        PAYMENT_STATUS.TRANSFERRED;

    session.creditsSettled = true;
}

        // ------------------------------------------------
        // 9. Mark both session and request completed
        // ------------------------------------------------

        session.status =
            SESSION_STATUS.COMPLETED;

        request.status =
            REQUEST_STATUS.COMPLETED;

        await session.save();
        await request.save();

        // ------------------------------------------------
        // 10. Populate response
        // ------------------------------------------------

        await session.populate(
            "mentor",
            "name email profilePhoto"
        );

        await session.populate(
            "learner",
            "name email profilePhoto"
        );

        await session.populate(
            "skill",
            "name"
        );

        // ------------------------------------------------
        // 11. Notifications
        // ------------------------------------------------

        await createNotification({
            user: request.learner,
            title: "Session Completed",
            message:
                "Your learning session has been completed successfully.",
            type: NOTIFICATION_TYPES.SESSION,
        });

        await createNotification({
            user: request.mentor,
            title: "Session Completed",
            message:
                "Your teaching session has been completed successfully.",
            type: NOTIFICATION_TYPES.SESSION,
        });

        if (
            request.requestType === REQUEST_TYPES.CREDITS &&
            request.creditCost > 0
        ) {
            await createNotification({
                user: request.mentor,
                title: "Credits Received",
                message:
                    `You received ${request.creditCost} credits.`,
                type: NOTIFICATION_TYPES.WALLET,
            });
        }

        // ------------------------------------------------
        // 12. Final response
        // ------------------------------------------------

        return res.status(200).json({
            success: true,
            completed: true,
            message:
                "Both participants confirmed the session. Session completed successfully.",
            session,
        });

    } catch (error) {

        console.error(
            "Error completing session:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Internal server error while completing the session.",
        });
    }
};