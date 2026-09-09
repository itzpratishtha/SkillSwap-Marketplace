import Skill from "../models/Skill.js";
import { SKILL_CATEGORIES } from "../constants/skillCategories.js";
import { addSkillToUser } from "../services/skill.service.js"; 

// ==========================================
// 1. SEARCH SKILLS (GET /api/skills)
// ==========================================
export const getSkills = async (req, res) => {
    try {
        const search = req.query.search || "";
        const skills = await Skill.find({
            name: {
                $regex: search,
                $options: "i"
            }
        }).sort({ name: 1 });

        return res.status(200).json({
            success: true,
            skills
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

// ==========================================
// 2. CREATE SKILL (POST /api/skills)
// ==========================================
export const createSkill = async (req, res) => {
    try {
        const { name, category } = req.body;

        if (!name || !category) {
            return res.status(400).json({
                success: false,
                message: "Name and category are required."
            });
        }

        if (!SKILL_CATEGORIES.includes(category)) {
            return res.status(400).json({
                success: false,
                message: "Invalid category."
            });
        }

        const normalizedName = name.trim();
        const existingSkill = await Skill.findOne({
            name: {
                $regex: new RegExp(`^${normalizedName}$`, "i")
            }
        });

        if (existingSkill) {
            return res.status(200).json({
                success: true,
                message: "Skill already exists.",
                skill: existingSkill
            });
        }

        const skill = await Skill.create({
            name: normalizedName,
            category
        });

        return res.status(201).json({
            success: true,
            message: "Skill created successfully.",
            skill
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

// ==========================================
// 3. ADD TEACHING SKILL (POST /api/users/me/teach-skills)
// ==========================================
export const addTeachSkill = async (req, res) => {

    try {

        const {
            skillId,
            level,
            creditCost,
        } = req.body;

        if (
            !skillId ||
            !level ||
            creditCost === undefined ||
            creditCost === null
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Skill, level and credit cost are required.",
            });
        }

        if (
            !Number.isInteger(Number(creditCost)) ||
            Number(creditCost) <= 0
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Credit cost must be a positive whole number.",
            });
        }

        const user = await addSkillToUser(
            req.user,
            skillId,
            level,
            "skillsTeach",
            Number(creditCost)
        );

        return res.status(200).json({
            success: true,
            message:
                "Teaching skill added successfully.",
            user,
        });

    } catch (error) {

        console.error(
            "Error adding teaching skill:",
            error
        );

        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export const addLearnSkill = async (req, res) => {
    try {
        const { skillId, level } = req.body;

        if (!skillId || !level) {
            return res.status(400).json({
                success: false,
                message: "Skill ID and level are required.",
            });
        }

        // Utilizing the service layer to handle the DB pushing & validation
        const user = await addSkillToUser(
            req.user,
            skillId,
            level,
            "skillsLearn"
        );

        return res.status(200).json({
            success: true,
            message: "Learning skill added successfully.",
            user,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};