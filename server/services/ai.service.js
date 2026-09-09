import { GoogleGenAI } from "@google/genai";


const ai = new GoogleGenAI({

    apiKey: process.env.GEMINI_API_KEY,

});


// ==========================================
// SKILLSWAP AI SYSTEM INSTRUCTIONS
// ==========================================

const SYSTEM_INSTRUCTIONS = `
You are SkillSwap AI, an intelligent, friendly, and helpful
learning assistant for the SkillSwap platform.

ABOUT SKILLSWAP:

SkillSwap is a peer-to-peer skill learning marketplace where users can:

- Learn new skills from mentors
- Teach skills to other learners
- Send and receive learning requests
- Schedule learning sessions
- Communicate through messages
- Manage credits and wallet transactions
- Build their learning journey

YOUR RESPONSIBILITIES:

1. Help users understand technical and non-technical skills.
2. Provide learning guidance and suggest what to learn next.
3. Explain concepts in simple, beginner-friendly language.
4. Provide career and skill-development guidance.
5. Answer questions about how SkillSwap works.
6. Encourage users to learn consistently and practically.

GUIDELINES:

- Be friendly and encouraging.
- Be conversational and easy to understand.
- Explain difficult concepts simply.
- Give practical examples when helpful.
- Keep answers reasonably concise unless the user asks
  for a detailed explanation.
- Do not claim to have information that was not provided.
- Do not invent SkillSwap features that do not exist.
`;


// ==========================================
// GENERATE AI RESPONSE
// ==========================================

export const generateAIResponse = async ({

    message,

    history = [],

    userContext = null,

}) => {


    // ==========================================
    // BUILD PERSONALIZED USER CONTEXT
    // ==========================================

    let personalizedContext = "";


    if (userContext) {

        personalizedContext = `

CURRENT SKILLSWAP USER CONTEXT:

Name:
${userContext.name || "Not available"}

Role:
${userContext.role || "Not available"}

Credits:
${userContext.credits ?? "Not available"}

Bio:
${userContext.bio || "Not specified"}

Experience:
${userContext.experience || "Not specified"}

Skills the user can teach:
${userContext.teachSkills?.length
    ? userContext.teachSkills
        .map(
            (skill) =>
                `${skill.name} (${skill.level})`
        )
        .join(", ")
    : "Not specified"}

Skills the user wants to learn:
${userContext.learnSkills?.length
    ? userContext.learnSkills
        .map(
            (skill) =>
                `${skill.name} (${skill.level})`
        )
        .join(", ")
    : "Not specified"}

Use this context only when it is relevant to the user's question.
Do not unnecessarily repeat the user's personal information.
`;

    }


    // ==========================================
    // FORMAT CONVERSATION HISTORY
    // ==========================================

    const formattedHistory =
        history
            .slice(-10)
            .map((item) => {

                const role =
                    item.role === "assistant"
                        ? "model"
                        : "user";


                return {

                    role,

                    parts: [

                        {
                            text: item.content,
                        },

                    ],

                };

            });


    // ==========================================
    // CURRENT USER MESSAGE
    // ==========================================

    const currentMessage = {

        role: "user",

        parts: [

            {
                text: message,
            },

        ],

    };


    // ==========================================
    // GENERATE RESPONSE
    // ==========================================

const response =
    await ai.models.generateContent({

        model: "gemini-3.6-flash",

        contents: [

            ...formattedHistory,

            currentMessage,

        ],

        config: {

            systemInstruction:

                SYSTEM_INSTRUCTIONS +
                personalizedContext,

            maxOutputTokens: 1500,

        },

    });


if (response.text) {

    return response.text;

}


const generatedText =
    response.candidates?.[0]
        ?.content
        ?.parts
        ?.map(
            (part) =>
                part.text || ""
        )
        .join("")
        .trim();


return generatedText;

};