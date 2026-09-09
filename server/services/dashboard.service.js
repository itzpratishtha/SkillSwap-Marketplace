import User from "../models/User.js";
import LearningRequest from "../models/LearningRequest.js";
import Session from "../models/Session.js";

import { REQUEST_STATUS } from "../constants/requestStatus.js";
import { SESSION_STATUS } from "../constants/sessionStatus.js";

export const getDashboardData = async (userId) => {
    const user = await User.findById(userId);

    if (!user) {
        throw new Error("User not found.");
    }

    const [
        pendingRequests,
        acceptedRequests,
        completedRequests,
        upcomingSessions,
        completedSessions,
    ] = await Promise.all([

        // Requests where user is either learner or mentor
        LearningRequest.countDocuments({
            $or: [
                { learner: userId },
                { mentor: userId }
            ],
            status: REQUEST_STATUS.PENDING,
        }),

        LearningRequest.countDocuments({
            $or: [
                { learner: userId },
                { mentor: userId }
            ],
            status: REQUEST_STATUS.ACCEPTED,
        }),

        LearningRequest.countDocuments({
            $or: [
                { learner: userId },
                { mentor: userId }
            ],
            status: REQUEST_STATUS.COMPLETED,
        }),

        // Sessions where user is either learner or mentor
        Session.countDocuments({
            $or: [
                { learner: userId },
                { mentor: userId }
            ],
            status: SESSION_STATUS.SCHEDULED,
        }),

        Session.countDocuments({
            $or: [
                { learner: userId },
                { mentor: userId }
            ],
            status: SESSION_STATUS.COMPLETED,
        }),
    ]);

    return {
        profile: {
            name: user.name,
            email: user.email,
            role: user.role,
            profilePhoto: user.profilePhoto,
            profileCompleted: user.profileCompleted,
        },

        wallet: {
            credits: user.credits,
            reservedCredits: user.reservedCredits,
        },

        skills: {
            teaching: user.skillsTeach.length,
            learning: user.skillsLearn.length,
        },

        requests: {
            pending: pendingRequests,
            accepted: acceptedRequests,
            completed: completedRequests,
        },

        sessions: {
            upcoming: upcomingSessions,
            completed: completedSessions,
        },

        rating: {
            average: user.averageRating,
            totalReviews: user.totalReviews,
        },
    };
};