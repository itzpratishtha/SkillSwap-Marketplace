import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";

import Skill from "../models/Skill.js";

dotenv.config();

// Helper to escape special regex characters like + in C++
const escapeRegExp = (string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

const seedSkills = async () => {
    try {

        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB Connected ✅");

        const data = fs.readFileSync("./seed/skills.json", "utf-8");

        const skills = JSON.parse(data);

        let inserted = 0;
        let skipped = 0;

        for (const skill of skills) {

const exists = await Skill.findOne({ name: skill.name }).collation({
    locale: "en",
    strength: 2,
});

            if (exists) {
                skipped++;
                continue;
            }

            await Skill.create(skill);
            inserted++;
        }

        console.log(`Inserted: ${inserted}`);
        console.log(`Skipped: ${skipped}`);

        process.exit();

    } catch (error) {

        console.error(error);

        process.exit(1);

    }
};

seedSkills();