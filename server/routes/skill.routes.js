import express from "express";
import {
    getSkills,
    createSkill,
    addTeachSkill,
    addLearnSkill,
} from "../controllers/skill.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", getSkills);
router.post("/", createSkill);
router.post("/me/teach-skills",protect,addTeachSkill);
router.post("/me/learn-skills",protect,addLearnSkill);

export default router;