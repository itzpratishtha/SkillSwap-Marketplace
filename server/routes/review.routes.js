import express from "express";

import {
    addReview,
    fetchMentorReviews,
} from "../controllers/review.controller.js";

import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post(
    "/",
    protect,
    addReview
);

router.get(
    "/:mentorId",
    fetchMentorReviews
);

export default router;