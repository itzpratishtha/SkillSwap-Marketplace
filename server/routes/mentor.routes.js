import express from "express";
import { searchMentors, getMentorProfile } from "../controllers/mentor.controller.js";
import {protect} from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/search", protect, searchMentors);
router.get("/:id", protect, getMentorProfile);

export default router;