import LearningRequest from "../models/LearningRequest.js";
import Review from "../models/Review.js";
import { createNotification } from "../services/notification.service.js";
import { REQUEST_STATUS } from "../constants/requestStatus.js";
import { NOTIFICATION_TYPES } from "../constants/notificationTypes.js";
import {
    createReview,
    getMentorReviews,
} from "../services/review.service.js";

export const addReview = async (req, res) => {
    try {

        const {
            learningRequestId,
            rating,
            review
        } = req.body;

        // Basic validation
        if (!learningRequestId || !rating) {
            return res.status(400).json({
                success: false,
                message: "Learning request and rating are required."
            });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: "Rating must be between 1 and 5."
            });
        }

        // Find request
        const request = await LearningRequest.findById(
            learningRequestId
        );

        if (!request) {
            return res.status(404).json({
                success: false,
                message: "Learning request not found."
            });
        }

        // Only learner can review
        if (
            request.learner.toString() !==
            req.user._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message: "Only the learner can review this mentor."
            });
        }

        // Request must be completed
        if (
            request.status !==
            REQUEST_STATUS.COMPLETED
        ) {
            return res.status(400).json({
                success: false,
                message: "Review can only be submitted after completing the learning request."
            });
        }

        // Prevent duplicate reviews
        const existingReview =
            await Review.findOne({
                learningRequest:
                    learningRequestId,
            });

        if (existingReview) {
            return res.status(400).json({
                success: false,
                message: "You have already reviewed this learning request."
            });
        }

        const newReview =
            await createReview({
                learningRequest:
                    learningRequestId,

                mentor: request.mentor,

                learner: req.user._id,

                rating,

                review,
            });

        await newReview.populate([
            {
                path: "mentor",
                select: "name email averageRating totalReviews",
            },
            {
                path: "learner",
                select: "name email",
            },
        ]);

    await createNotification({
    user: request.mentor,
    title: "New Review",
    message: "A learner has left a review for your session.",
    type: NOTIFICATION_TYPES.REVIEW
});

        return res.status(201).json({
            success: true,
            message:
                "Review submitted successfully.",
            review: newReview,
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

export const fetchMentorReviews = async (
    req,
    res
) => {

    try {

        const { mentorId } = req.params;

        const reviews =
            await getMentorReviews(
                mentorId
            );

        return res.status(200).json({

            success: true,

            count: reviews.length,

            reviews,

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message,

        });

    }

};