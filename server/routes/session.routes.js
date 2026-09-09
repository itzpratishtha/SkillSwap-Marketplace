import express from "express";

import {protect} from "../middlewares/auth.middleware.js";

import {
  getTeachingSessions,
  getLearningSessions,
  scheduleSession,
  completeSession,
} from "../controllers/session.controller.js";

const router = express.Router();

router.get("/teaching", protect, getTeachingSessions);

router.get("/learning", protect, getLearningSessions);

router.patch("/:id/schedule", protect, scheduleSession);

router.patch("/:id/complete", protect, completeSession);

export default router;