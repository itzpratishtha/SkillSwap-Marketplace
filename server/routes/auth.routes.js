import express from "express";

import {
    registerUser,
    loginUser,
    verifyEmail,
    resendVerificationEmail,
    forgotPassword,
    resetPassword,
    getCurrentUser,
    logout,
} from "../controllers/auth.controller.js";

import {
    protect,
} from "../middlewares/auth.middleware.js";


const router = express.Router();


// Protected

router.get(
    "/me",
    protect,
    getCurrentUser
);


// Registration

router.post(
    "/register",
    registerUser
);


// Login

router.post(
    "/login",
    loginUser
);


// Email verification

router.get(
    "/verify-email",
    verifyEmail
);


router.post(
    "/resend-verification",
    resendVerificationEmail
);


// Password reset

router.post(
    "/forgot-password",
    forgotPassword
);


router.post(
    "/reset-password",
    resetPassword
);


// Logout

router.post(
    "/logout",
    logout
);


export default router;