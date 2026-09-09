import express from "express";

import { protect } from "../middlewares/auth.middleware.js";

import {
fetchNotifications,
readNotification,
readAllNotifications,
unreadNotificationCount
} from "../controllers/notification.controller.js";

const router=express.Router();

router.get(
"/",
protect,
fetchNotifications
);

router.patch(
"/:id/read",
protect,
readNotification
);

router.patch(
"/read-all",
protect,
readAllNotifications
);

router.get(
    "/unread-count",
    protect,
    unreadNotificationCount
);

export default router;