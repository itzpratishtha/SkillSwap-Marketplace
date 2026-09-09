import express from "express";

import {
    getMessages,
    sendMessage,
} from "../controllers/message.controller.js";

import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get(
    "/:requestId",
    protect,
    getMessages
);

router.post(
    "/:requestId",
    protect,
    sendMessage
);

export default router;