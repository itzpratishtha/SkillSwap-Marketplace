import express from "express";
import {protect} from "../middlewares/auth.middleware.js";
import {createRequest, acceptRequest, rejectRequest, getReceivedRequests, getSentRequests} from "../controllers/request.controller.js";

const router = express.Router();

router.post("/", protect, createRequest);

router.get("/sent", protect, getSentRequests);

router.get("/received", protect, getReceivedRequests);

router.patch("/:id/accept", protect, acceptRequest);

router.patch("/:id/reject", protect, rejectRequest);

export default router;