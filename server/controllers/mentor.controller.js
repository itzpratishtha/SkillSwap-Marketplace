import { findMentorsBySkill } from "../services/mentor.services.js";
import User from "../models/User.js";

export const searchMentors = async (req, res) => {
    try {
        const { skill } = req.query;

        if (!skill) {
    return res.status(200).json({
        success: true,
        mentors: [],
    });
}

        const mentors = await findMentorsBySkill(skill);

        return res.status(200).json({
            success: true,
            mentors
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getMentorProfile = async (req, res) => {

    try {

        const mentor = await User.findById(req.params.id)
            .populate("skillsTeach.skill")
            .populate("skillsLearn.skill")
            .select("-password");

        if (!mentor) {

            return res.status(404).json({

                success: false,

                message: "User not found."

            });

        }

        return res.json({

            success: true,

            mentor

        });

    }

    catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};