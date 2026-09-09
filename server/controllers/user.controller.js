import User from "../models/User.js";
import { addCredits } from "../services/credit.service.js";
import { CREDITS } from "../constants/credits.js";
import { CREDIT_TYPES } from "../constants/creditTypes.js";


export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .populate("skillsTeach.skill")
            .populate("skillsLearn.skill");

        return res.status(200).json({
            success: true,
            user,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const updateProfile = async (req, res) => {
    const user = req.user;
    const {
  bio,
  experience,
  skillsTeach,
  skillsLearn,
  availability,
  github,
  linkedin,
  portfolio,
} = req.body;
if (!availability) {
    return res.status(400).json({
        success: false,
        message: "Please mention availability."
    });
}
if (!skillsTeach?.length) {
    return res.status(400).json({
        success: false,
        message: "Please add at least one skill you can teach."
    });
}

for (const item of skillsTeach) {

    if (
        !item.creditCost ||
        !Number.isInteger(Number(item.creditCost)) ||
        Number(item.creditCost) <= 0
    ) {
        return res.status(400).json({
            success: false,
            message:
                "Every teaching skill must have a valid credit cost.",
        });
    }
}


if (!skillsLearn?.length) {
    return res.status(400).json({
        success: false,
        message: "Please add at least one skill you want to learn."
    });
}
if (!github && !linkedin) {
    return res.status(400).json({
        success: false,
        message: "Please provide either a GitHub or LinkedIn profile."
    });
}
user.bio = bio;
user.experience = experience;
user.skillsTeach = skillsTeach;
user.skillsLearn = skillsLearn;
user.availability = availability;
user.github = github;
user.linkedin = linkedin;
user.portfolio = portfolio;
let awardedWelcomeCredits = false;

if (!user.welcomeCreditsClaimed) {
    user.profileCompleted = true;
    user.welcomeCreditsClaimed = true;
    await addCredits(
    user,
    CREDITS.WELCOME_BONUS,
    CREDIT_TYPES.WELCOME_BONUS,
    "Profile completed successfully"
);
    awardedWelcomeCredits = true;
}
await user.save();
return res.status(200).json({
    success: true,
    message: awardedWelcomeCredits
    ? "Profile completed successfully. You earned 10 Skill Credits!"
    : "Profile updated successfully.",
    user,
});
};