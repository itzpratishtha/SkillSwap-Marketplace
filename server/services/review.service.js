import Review from "../models/Review.js";
import User from "../models/User.js";

export const createReview = async ({
    learningRequest,
    mentor,
    learner,
    rating,
    review,
}) => {

    const newReview = await Review.create({
        learningRequest,
        mentor,
        learner,
        rating,
        review,
    });

    console.log("REVIEW CREATED:", newReview);

    await updateMentorRating(
        mentor,
        rating
    );

    return newReview;
};

export const updateMentorRating = async (
    mentorId,
    newRating
) => {

    const mentor = await User.findById(mentorId);

    if (!mentor) {
        throw new Error("Mentor not found.");
    }

    const totalReviews = mentor.totalReviews || 0;
    const averageRating = mentor.averageRating || 0;

    const updatedAverage =
        ((averageRating * totalReviews) + newRating) /
        (totalReviews + 1);

    mentor.averageRating = Number(updatedAverage.toFixed(2));
    mentor.totalReviews = totalReviews + 1;

    await mentor.save();

    return mentor;
};

export const getMentorReviews = async (mentorId) => {

    const reviews = await Review.find({
        mentor: mentorId,
    })
        .populate("learner", "name")
        .sort({ createdAt: -1 });

    return reviews;
};