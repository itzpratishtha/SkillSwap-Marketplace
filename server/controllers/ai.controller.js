import User
    from "../models/User.js";

import {
    generateAIResponse,
} from "../services/ai.service.js";


// ==========================================
// AI CHAT
// ==========================================

export const chatWithAI =
    async (req, res) => {

        try {

            const {

                message,

                history = [],

            } = req.body;


            // ==================================
            // VALIDATION
            // ==================================

            if (
                !message ||
                typeof message !== "string" ||
                !message.trim()
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Please provide a message.",

                });

            }


            // ==================================
            // GET AUTHENTICATED USER
            // ==================================

            const user =
                await User.findById(
                    req.user._id
                )
                    .populate(
                        "skillsTeach.skill",
                        "name category"
                    )
                    .populate(
                        "skillsLearn.skill",
                        "name category"
                    )
                    .select(
                        `
                        name
                        role
                        credits
                        bio
                        experience
                        skillsTeach
                        skillsLearn
                        `
                    );


            if (!user) {

                return res.status(404).json({

                    success: false,

                    message:
                        "User not found.",

                });

            }


            // ==================================
            // FORMAT SKILLS FOR AI
            // ==================================

            const teachSkills =
                user.skillsTeach.map(
                    (userSkill) => ({

                        name:
                            userSkill.skill?.name ||
                            "Unknown skill",

                        category:
                            userSkill.skill?.category ||
                            "Unknown",

                        level:
                            userSkill.level,

                    })
                );


            const learnSkills =
                user.skillsLearn.map(
                    (userSkill) => ({

                        name:
                            userSkill.skill?.name ||
                            "Unknown skill",

                        category:
                            userSkill.skill?.category ||
                            "Unknown",

                        level:
                            userSkill.level,

                    })
                );


            // ==================================
            // BUILD USER CONTEXT
            // ==================================

            const userContext = {

                name:
                    user.name,

                role:
                    user.role,

                credits:
                    user.credits,

                bio:
                    user.bio,

                experience:
                    user.experience,

                teachSkills,

                learnSkills,

            };


            // ==================================
            // GENERATE AI RESPONSE
            // ==================================

            const reply =
                await generateAIResponse({

                    message:
                        message.trim(),

                    history,

                    userContext,

                });


            return res.status(200).json({

                success: true,

                reply,

            });


        } catch (error) {

            console.error(
                "AI CHAT ERROR:",
                error
            );


            // ==================================
            // GEMINI TEMPORARILY UNAVAILABLE
            // ==================================

            if (error.status === 503) {

                return res.status(503).json({

                    success: false,

                    message:
                        "The AI assistant is experiencing high demand right now. Please try again in a moment.",

                });

            }


            // ==================================
            // RATE LIMIT
            // ==================================

            if (error.status === 429) {

                return res.status(429).json({

                    success: false,

                    message:
                        "Too many requests were sent to the AI assistant. Please wait a moment and try again.",

                });

            }


            return res.status(500).json({

                success: false,

                message:
                    "Unable to generate an AI response. Please try again.",

            });

        }

    };