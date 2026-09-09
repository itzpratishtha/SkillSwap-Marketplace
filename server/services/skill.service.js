import Skill from "../models/Skill.js";

export const addSkillToUser = async (
    user,
    skillId,
    level,
    field,
    creditCost = 1
) => {

    const skill = await Skill.findById(skillId);

    if (!skill) {
        throw new Error("Skill not found.");
    }

    if (
        !Number.isInteger(Number(creditCost)) ||
        Number(creditCost) <= 0
    ) {
        throw new Error(
            "Credit cost must be a positive whole number."
        );
    }

    const exists = user[field].some(
        item =>
            item.skill.toString() === skillId
    );

    if (exists) {
        throw new Error("Skill already exists.");
    }

    user[field].push({
        skill: skillId,
        level,
        ...(field === "skillsTeach"
            ? {
                  creditCost:
                      Number(creditCost),
              }
            : {}),
    });

    await user.save();

    await user.populate(`${field}.skill`);

    return user;
};