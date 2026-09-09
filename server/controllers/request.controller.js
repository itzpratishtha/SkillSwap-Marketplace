import User from "../models/User.js";
import LearningRequest from "../models/LearningRequest.js";
import Session from "../models/Session.js";

import {
    createNotification,
} from "../services/notification.service.js";

import {
    reserveCredits,
    releaseCredits,
} from "../services/credit.service.js";

import {
    NOTIFICATION_TYPES,
} from "../constants/notificationTypes.js";

import {
    REQUEST_STATUS,
    REQUEST_TYPES,
} from "../constants/requestStatus.js";

import {
    PAYMENT_STATUS,
} from "../constants/paymentStatus.js";

import {
    SESSION_STATUS,
} from "../constants/sessionStatus.js";


// =====================================================
// CREATE LEARNING REQUEST
// =====================================================

export const createRequest = async (req, res) => {

    try {

        const {
            mentorId,
            skillId,
            requestType,
            exchangeSkillId,
            message,
            preferredSchedule,
        } = req.body;


        // =================================================
        // 1. Get actual learner document
        // =================================================

        const learner = await User.findById(
            req.user._id
        );

        if (!learner) {

            return res.status(404).json({
                success: false,
                message: "Learner not found.",
            });

        }


        // =================================================
        // 2. Basic validation
        // =================================================

        if (
            !mentorId ||
            !skillId ||
            !requestType
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Required fields are missing.",
            });

        }


        // =================================================
        // 3. Validate request type
        // =================================================

        if (
            !Object.values(REQUEST_TYPES).includes(
                requestType
            )
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Invalid request type.",
            });

        }


        // =================================================
        // 4. Prevent self request
        // =================================================

        if (
            mentorId.toString() ===
            learner._id.toString()
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "You cannot send a learning request to yourself.",
            });

        }


        // =================================================
        // 5. Find mentor
        // =================================================

        const mentor =
            await User.findById(mentorId);

        if (!mentor) {

            return res.status(404).json({
                success: false,
                message: "Mentor not found.",
            });

        }


        // =================================================
        // 6. Find exact skill + mentor price
        // =================================================

        const teachingSkill =
            mentor.skillsTeach.find(
                (item) =>
                    item.skill.toString() ===
                    skillId.toString()
            );


        if (!teachingSkill) {

            return res.status(400).json({
                success: false,
                message:
                    "This mentor doesn't teach the selected skill.",
            });

        }


        // =================================================
        // 7. Validate mentor credit price
        // =================================================

        const creditCost =
            Number(teachingSkill.creditCost);


        if (
            requestType ===
                REQUEST_TYPES.CREDITS &&
            (
                !Number.isInteger(
                    creditCost
                ) ||
                creditCost <= 0
            )
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "This mentor has not set a valid credit cost for this skill.",
            });

        }


        // =================================================
        // 8. Check duplicate pending request
        // =================================================

        const existingRequest =
            await LearningRequest.findOne({
                learner: learner._id,
                mentor: mentorId,
                skill: skillId,
                status:
                    REQUEST_STATUS.PENDING,
            });


        if (existingRequest) {

            return res.status(400).json({
                success: false,
                message:
                    "A pending request already exists.",
            });

        }


        // =================================================
        // 9. CREDIT REQUEST
        //
        // Check available credits first.
        // Then reserve them immediately.
        // =================================================

        let paymentStatus =
            PAYMENT_STATUS.PENDING;


        if (
            requestType ===
            REQUEST_TYPES.CREDITS
        ) {

            const availableCredits =
                (learner.credits || 0) -
                (learner.reservedCredits || 0);


            if (
                availableCredits <
                creditCost
            ) {

                return res.status(400).json({
                    success: false,
                    message:
                        `Insufficient credits. You need ${creditCost} credits, but you only have ${availableCredits} available.`,
                });

            }


            // ---------------------------------------------
            // Reserve credits immediately
            // ---------------------------------------------

            try {

                await reserveCredits(
                    learner,
                    creditCost
                );

                paymentStatus =
                    PAYMENT_STATUS.RESERVED;

            } catch (walletError) {

                return res.status(400).json({
                    success: false,
                    message:
                        `Unable to reserve credits: ${walletError.message}`,
                });

            }

        }


        // =================================================
        // 10. Create request
        // =================================================
        
        let request;

        try {

            request =
                await LearningRequest.create({

                    learner:
                        learner._id,

                    mentor:
                        mentorId,

                    skill:
                        skillId,

                    requestType,

                    exchangeSkill:
                        exchangeSkillId ||
                        null,

                    message,

                    preferredSchedule,

                    creditCost:
                        requestType ===
                        REQUEST_TYPES.CREDITS
                            ? creditCost
                            : 0,

                    paymentStatus,

                });

        } catch (requestError) {

            // ---------------------------------------------
            // VERY IMPORTANT
            //
            // If DB creation fails after reservation,
            // release the reserved credits.
            // ---------------------------------------------

            if (
                requestType ===
                REQUEST_TYPES.CREDITS
            ) {

                try {

                    await releaseCredits(
                        learner,
                        creditCost
                    );

                } catch (releaseError) {

                    console.error(
                        "Failed to release credits after request creation error:",
                        releaseError
                    );

                }

            }

            throw requestError;
        }


        // =================================================
        // 11. Populate response
        // =================================================

        await request.populate(
            "mentor",
            "name email"
        );

        await request.populate(
            "learner",
            "name email"
        );

        await request.populate(
            "skill",
            "name"
        );


        if (exchangeSkillId) {

            await request.populate(
                "exchangeSkill",
                "name"
            );

        }


        // =================================================
        // 12. Notify mentor
        // =================================================

        await createNotification({

            user: mentor._id,

            title:
                "New Learning Request",

            message:
                `${learner.name} sent you a learning request.`,

            type:
                NOTIFICATION_TYPES.REQUEST,

        });


        // =================================================
        // 13. Response
        // =================================================

        return res.status(201).json({

            success: true,

            message:
                "Learning request sent successfully.",

            request,

        });


    } catch (error) {

        console.error(
            "Error creating learning request:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                error.message ||
                "Internal server error.",

        });

    }

};


// =====================================================
// ACCEPT REQUEST
// =====================================================

export const acceptRequest = async (
    req,
    res
) => {

    try {

        const { id } = req.params;

        const mentorId =
            req.user._id;


        // =================================================
        // 1. Find request
        // =================================================

        const request =
            await LearningRequest.findById(id);

        if (!request) {

            return res.status(404).json({
                success: false,
                message:
                    "Learning request not found.",
            });

        }


        // =================================================
        // 2. Security check
        // =================================================

        if (
            request.mentor.toString() !==
            mentorId.toString()
        ) {

            return res.status(403).json({
                success: false,
                message:
                    "Unauthorized. Only the assigned mentor can accept this request.",
            });

        }


        // =================================================
        // 3. Must still be pending
        // =================================================

        if (
            request.status !==
            REQUEST_STATUS.PENDING
        ) {

            return res.status(400).json({
                success: false,
                message:
                    `Cannot accept a request that is already ${request.status.toLowerCase()}.`,
            });

        }


        // =================================================
        // 4. Exchange validation
        // =================================================

        if (
            request.requestType ===
            REQUEST_TYPES.EXCHANGE
        ) {

            if (!request.exchangeSkill) {

                return res.status(400).json({
                    success: false,
                    message:
                        "Exchange skill is required.",
                });

            }


            const learner =
                await User.findById(
                    request.learner
                );


            if (!learner) {

                return res.status(404).json({
                    success: false,
                    message:
                        "Learner not found.",
                });

            }


            const learnerTeachesSkill =
                learner.skillsTeach.some(
                    (item) =>
                        item.skill.toString() ===
                        request.exchangeSkill.toString()
                );


            if (!learnerTeachesSkill) {

                return res.status(400).json({
                    success: false,
                    message:
                        "The learner no longer teaches the selected exchange skill.",
                });

            }

        }


        // =================================================
        // 5. CREDIT REQUEST VALIDATION
        //
        // Credits were already reserved when
        // the learner sent the request.
        //
        // DO NOT reserve again here.
        // =================================================

        if (
            request.requestType ===
            REQUEST_TYPES.CREDITS
        ) {

            if (
                request.paymentStatus !==
                PAYMENT_STATUS.RESERVED
            ) {

                return res.status(400).json({
                    success: false,
                    message:
                        "Credits were not reserved for this request.",
                });

            }

        }


        // =================================================
        // 6. Create session
        // =================================================

        const newSession =
            await Session.create({

                learningRequest:
                    request._id,

                learner:
                    request.learner,

                mentor:
                    request.mentor,

                skill:
                    request.skill,

                sessionNumber: 1,

                creditCost:
                    request.creditCost || 0,

                status:
                    SESSION_STATUS.PENDING,

            });


        // =================================================
        // 7. Update request
        // =================================================

        request.status =
            REQUEST_STATUS.ACCEPTED;

        await request.save();


        // =================================================
        // 8. Notify learner
        // =================================================

        await createNotification({

            user:
                request.learner,

            title:
                "Learning Request Accepted",

            message:
                "Your learning request has been accepted by the mentor.",

            type:
                NOTIFICATION_TYPES.REQUEST,

        });


        // =================================================
        // 9. Response
        // =================================================

        return res.status(200).json({

            success: true,

            message:
                "Request accepted and session initialized successfully.",

            request,

            session:
                newSession,

        });


    } catch (error) {

        console.error(
            "Error in acceptRequest:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Internal server error while accepting the request.",

        });

    }

};


// =====================================================
// REJECT / CANCEL REQUEST
// =====================================================

export const rejectRequest = async (
    req,
    res
) => {

    try {

        const { id } =
            req.params;


        const request =
            await LearningRequest.findById(id);


        if (!request) {

            return res.status(404).json({
                success: false,
                message:
                    "Request not found.",
            });

        }


        const currentUser =
            req.user._id.toString();


        // =================================================
        // Authorization
        // =================================================

        if (
            request.learner.toString() !==
                currentUser &&
            request.mentor.toString() !==
                currentUser
        ) {

            return res.status(403).json({
                success: false,
                message:
                    "You are not authorized to perform this action.",
            });

        }


        // =================================================
        // Prevent invalid cancellation
        // =================================================

        if (
            request.status ===
                REQUEST_STATUS.REJECTED ||
            request.status ===
                REQUEST_STATUS.COMPLETED ||
            request.status ===
                REQUEST_STATUS.CANCELLED
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "This request cannot be cancelled.",
            });

        }


        // =================================================
        // Release reserved credits
        // =================================================

        if (
            request.requestType ===
                REQUEST_TYPES.CREDITS &&
            request.paymentStatus ===
                PAYMENT_STATUS.RESERVED
        ) {

            const learner =
                await User.findById(
                    request.learner
                );


            if (!learner) {

                return res.status(404).json({
                    success: false,
                    message:
                        "Learner not found.",
                });

            }


            await releaseCredits(
                learner,
                request.creditCost
            );


            request.paymentStatus =
                PAYMENT_STATUS.REFUNDED;

        }


        // =================================================
        // Cancel associated session
        // =================================================

        const session =
            await Session.findOne({
                learningRequest:
                    request._id,
            });


        if (
            session &&
            session.status !==
                SESSION_STATUS.COMPLETED
        ) {

            session.status =
                SESSION_STATUS.CANCELLED;

            await session.save();

        }


        // =================================================
        // Update request
        // =================================================

        request.status =
            REQUEST_STATUS.CANCELLED;

        await request.save();


        // =================================================
        // Notify other participant
        // =================================================

        const notificationUser =
            request.learner.toString() ===
            currentUser
                ? request.mentor
                : request.learner;


        await createNotification({

            user:
                notificationUser,

            title:
                "Learning Request Cancelled",

            message:
                "A learning request has been cancelled.",

            type:
                NOTIFICATION_TYPES.REQUEST,

        });


        return res.status(200).json({

            success: true,

            message:
                "Learning request cancelled successfully.",

            request,

        });


    } catch (error) {

        console.error(
            "Error cancelling request:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                error.message ||
                "Internal server error.",

        });

    }

};


// =====================================================
// GET SENT REQUESTS
// =====================================================

export const getSentRequests = async (
    req,
    res
) => {

    try {

        const requests =
            await LearningRequest.find({

                learner:
                    req.user._id,

            })
            .populate(
                "mentor",
                "name profilePhoto"
            )
            .populate(
                "skill",
                "name"
            )
            .populate(
                "exchangeSkill",
                "name"
            )
            .sort({
                createdAt: -1,
            });


        return res.status(200).json({

            success: true,

            requests,

        });


    } catch (error) {

        console.error(
            "Error fetching sent requests:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                error.message,

        });

    }

};


// =====================================================
// GET RECEIVED REQUESTS
// =====================================================

export const getReceivedRequests = async (
    req,
    res
) => {

    try {

        const requests =
            await LearningRequest.find({

                mentor:
                    req.user._id,

            })
            .populate(
                "learner",
                "name profilePhoto"
            )
            .populate(
                "skill",
                "name"
            )
            .populate(
                "exchangeSkill",
                "name"
            )
            .sort({
                createdAt: -1,
            });


        return res.status(200).json({

            success: true,

            requests,

        });


    } catch (error) {

        console.error(
            "Error fetching received requests:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                error.message,

        });

    }

};