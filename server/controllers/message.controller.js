import LearningRequest from "../models/LearningRequest.js";

import {
    getMessagesForRequest,
    createMessage,
} from "../services/message.service.js";

import { createNotification } from "../services/notification.service.js";
import { NOTIFICATION_TYPES } from "../constants/notificationTypes.js";

import {
    REQUEST_STATUS,
} from "../constants/requestStatus.js";


// ========================================
// Get messages
// ========================================

export const getMessages = async (req, res) => {

    try {

        const { requestId } = req.params;

        const userId =
            req.user._id.toString();

        const request =
            await LearningRequest.findById(requestId);

        if (!request) {

            return res.status(404).json({
                success: false,
                message: "Learning request not found.",
            });

        }

        // Only learner or mentor can access chat
        const isParticipant =
            request.learner.toString() === userId ||
            request.mentor.toString() === userId;

        if (!isParticipant) {

            return res.status(403).json({
                success: false,
                message:
                    "You are not a participant in this learning request.",
            });

        }

        // Messaging only after request is accepted
        if (
            request.status !== REQUEST_STATUS.ACCEPTED &&
            request.status !== REQUEST_STATUS.COMPLETED
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Messaging is available only for accepted requests.",
            });

        }

        const messages =
            await getMessagesForRequest(requestId);

        return res.status(200).json({
            success: true,
            messages,
        });


    } catch (error) {

        console.error(
            "Error fetching messages:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to fetch messages.",
        });
    }
};


// ========================================
// Send message
// ========================================

export const sendMessage = async (req, res) => {

    try {

        const { requestId } = req.params;

        const { text } = req.body;

        const userId =
            req.user._id.toString();

        if (!text || !text.trim()) {

            return res.status(400).json({
                success: false,
                message: "Message cannot be empty.",
            });

        }

        const request =
            await LearningRequest.findById(requestId);

        if (!request) {

            return res.status(404).json({
                success: false,
                message: "Learning request not found.",
            });

        }

        const learnerId =
            request.learner.toString();

        const mentorId =
            request.mentor.toString();

        const isLearner =
            learnerId === userId;

        const isMentor =
            mentorId === userId;

        if (!isLearner && !isMentor) {

            return res.status(403).json({
                success: false,
                message:
                    "You are not a participant in this learning request.",
            });

        }

        if (
            request.status !== REQUEST_STATUS.ACCEPTED &&
            request.status !== REQUEST_STATUS.COMPLETED
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Messaging is available only for accepted requests.",
            });

        }

        const receiverId =
            isLearner
                ? request.mentor
                : request.learner;

        const message =
            await createMessage({
                learningRequestId: requestId,
                senderId: req.user._id,
                receiverId,
                text: text.trim(),
            });

    await createNotification({
    user: receiverId,
    sender: req.user._id,
    learningRequest: requestId,
    title: "New Message",
    message: "You have received a new message.",
    type: NOTIFICATION_TYPES.MESSAGE,
});
            
            const io = req.app.get("io");

            io.to(`request:${requestId}`).emit( "new-message", message);

        return res.status(201).json({
            success: true,
            message,
        });

    } catch (error) {

        console.error(
            "Error sending message:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to send message.",
        });
    }
};