import User from "../models/User.js";

export const findMentorsBySkill = async (skillId) => {

    const users = await User.find({
        "skillsTeach.skill": skillId,
        profileCompleted: true,
    })
        .select(
            "name role bio profilePhoto skillsTeach averageRating totalReviews availability"
        )
        .populate("skillsTeach.skill");

    return users;
};