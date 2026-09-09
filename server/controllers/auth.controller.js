import User from "../models/User.js";
import bcrypt from "bcryptjs";
import validator from "validator";
import crypto from "crypto";

import { ROLES } from "../constants/roles.js";
import generateToken from "../utils/generateToken.js";

import {
    sendVerificationEmail,
    sendPasswordResetEmail,
} from "../services/email.service.js";


// ==========================================
// HELPER FUNCTIONS
// ==========================================

const generateSecureToken = () => {
    return crypto.randomBytes(32).toString("hex");
};


const hashToken = (token) => {
    return crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");
};


// ==========================================
// REGISTER USER
// ==========================================

export const registerUser = async (req, res) => {

    try {

        const {
            name,
            email,
            password,
            role,
        } = req.body;


        // Required fields

        if (!name || !email || !password || !role) {

            return res.status(400).json({
                success: false,
                message:
                    "Please fill all required fields.",
            });

        }


        // Email validation

        if (!validator.isEmail(email)) {

            return res.status(400).json({
                success: false,
                message:
                    "Invalid email format.",
            });

        }


        // Password validation

        if (password.length < 8) {

            return res.status(400).json({
                success: false,
                message:
                    "Password must be at least 8 characters long.",
            });

        }


        // Role validation

        if (!ROLES.includes(role)) {

            return res.status(400).json({
                success: false,
                message:
                    "Invalid role selected.",
            });

        }


        // Normalize email

        const normalizedEmail =
            email.toLowerCase().trim();


        // Check existing user

        const existingUser =
            await User.findOne({
                email: normalizedEmail,
            });


        if (existingUser) {

            return res.status(409).json({
                success: false,
                message:
                    "An account with this email already exists.",
            });

        }


        // Hash password

        const hashedPassword =
            await bcrypt.hash(password, 10);


        // Generate verification token

        const verificationToken =
            generateSecureToken();


        const hashedVerificationToken =
            hashToken(verificationToken);


        // Create user

        const user = await User.create({

            name: name.trim(),

            email: normalizedEmail,

            password: hashedPassword,

            role,

            isEmailVerified: false,

            emailVerificationToken:
                hashedVerificationToken,

            emailVerificationExpires:
                new Date(
                    Date.now() +
                    24 * 60 * 60 * 1000
                ),

        });


        // Send verification email

        await sendVerificationEmail({

            email: user.email,

            name: user.name,

            token: verificationToken,

        });


        return res.status(201).json({

            success: true,

            message:
                "Registration successful. Please check your email to verify your account.",

            email: user.email,

        });


    } catch (error) {

        console.error(
            "Registration error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Unable to register user. Please try again.",

        });

    }

};



// ==========================================
// VERIFY EMAIL
// ==========================================

export const verifyEmail = async (req, res) => {

    try {

        const { token } = req.query;


        if (!token) {

            return res.status(400).json({

                success: false,

                message:
                    "Verification token is required.",

            });

        }


        const hashedToken =
            hashToken(token);


        const user =
            await User.findOne({

                emailVerificationToken:
                    hashedToken,

                emailVerificationExpires: {
                    $gt: new Date(),
                },

            });


        if (!user) {

            return res.status(400).json({

                success: false,

                message:
                    "This verification link is invalid or has expired.",

            });

        }


        // Verify user

        user.isEmailVerified = true;

        user.emailVerificationToken = null;

        user.emailVerificationExpires = null;


        await user.save();


        return res.status(200).json({

            success: true,

            message:
                "Email verified successfully. You can now login.",

        });


    } catch (error) {

        console.error(
            "Email verification error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Unable to verify email. Please try again.",

        });

    }

};



// ==========================================
// RESEND VERIFICATION EMAIL
// ==========================================

export const resendVerificationEmail =
    async (req, res) => {

        try {

            const { email } = req.body;


            if (!email) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Email is required.",

                });

            }


            if (!validator.isEmail(email)) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Invalid email format.",

                });

            }


            const normalizedEmail =
                email.toLowerCase().trim();


            const user =
                await User.findOne({

                    email: normalizedEmail,

                });


            if (!user) {

                return res.status(404).json({

                    success: false,

                    message:
                        "No account found with this email.",

                });

            }


            if (user.isEmailVerified) {

                return res.status(400).json({

                    success: false,

                    message:
                        "This email is already verified.",

                });

            }


            // Generate new token

            const verificationToken =
                generateSecureToken();


            user.emailVerificationToken =
                hashToken(
                    verificationToken
                );


            user.emailVerificationExpires =
                new Date(
                    Date.now() +
                    24 * 60 * 60 * 1000
                );


            await user.save();


            // Send email

            await sendVerificationEmail({

                email: user.email,

                name: user.name,

                token: verificationToken,

            });


            return res.status(200).json({

                success: true,

                message:
                    "Verification email sent successfully.",

            });


        } catch (error) {

            console.error(
                "Resend verification error:",
                error
            );


            return res.status(500).json({

                success: false,

                message:
                    "Unable to send verification email.",

            });

        }

    };



// ==========================================
// LOGIN USER
// ==========================================

export const loginUser = async (req, res) => {

    try {

        const {
            email,
            password,
        } = req.body;


        if (!email || !password) {

            return res.status(400).json({

                success: false,

                message:
                    "Email and password are required.",

            });

        }


        if (!validator.isEmail(email)) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid email format.",

            });

        }


        const normalizedEmail =
            email.toLowerCase().trim();


        const user =
            await User.findOne({

                email: normalizedEmail,

            });


        if (!user) {

            return res.status(401).json({

                success: false,

                message:
                    "Invalid email or password.",

            });

        }


        const isPasswordMatch =
            await bcrypt.compare(

                password,

                user.password

            );


        if (!isPasswordMatch) {

            return res.status(401).json({

                success: false,

                message:
                    "Invalid email or password.",

            });

        }


        // IMPORTANT:
        // Block login if email is not verified

        if (!user.isEmailVerified) {

            return res.status(403).json({

                success: false,

                message:
                    "Please verify your email before logging in.",

                needsVerification: true,

                email: user.email,

            });

        }


        // Generate JWT

        const token =
            generateToken(user);


res.cookie(
    "token",
    token,
    {
        httpOnly: true,

        secure:
            process.env.NODE_ENV ===
            "production",

        sameSite:
            process.env.NODE_ENV ===
            "production"
                ? "none"
                : "lax",

        maxAge:
            7 *
            24 *
            60 *
            60 *
            1000,
    }
);


        return res.status(200).json({

            success: true,

            user,

        });


    } catch (error) {

        console.error(
            "Login error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Internal Server Error",

        });

    }

};



// ==========================================
// FORGOT PASSWORD
// ==========================================

export const forgotPassword =
    async (req, res) => {

        try {

            const { email } = req.body;


            if (!email) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Email is required.",

                });

            }


            if (!validator.isEmail(email)) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Invalid email format.",

                });

            }


            const normalizedEmail =
                email.toLowerCase().trim();


            const user =
                await User.findOne({

                    email: normalizedEmail,

                });


            /*
             Security:
             Return the same response even if
             the user does not exist.
            */

            if (!user) {

                return res.status(200).json({

                    success: true,

                    message:
                        "If an account exists with this email, a password reset link has been sent.",

                });

            }


            // Generate reset token

            const resetToken =
                generateSecureToken();


            user.passwordResetToken =
                hashToken(resetToken);


            user.passwordResetExpires =
                new Date(

                    Date.now() +

                    60 *
                    60 *
                    1000

                );


            await user.save();


            // Send reset email

            await sendPasswordResetEmail({

                email: user.email,

                name: user.name,

                token: resetToken,

            });


            return res.status(200).json({

                success: true,

                message:
                    "If an account exists with this email, a password reset link has been sent.",

            });


        } catch (error) {

            console.error(
                "Forgot password error:",
                error
            );


            return res.status(500).json({

                success: false,

                message:
                    "Unable to process password reset request.",

            });

        }

    };



// ==========================================
// RESET PASSWORD
// ==========================================

export const resetPassword =
    async (req, res) => {

        try {

            const { token } =
                req.query;


            const { password } =
                req.body;


            if (!token) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Reset token is required.",

                });

            }


            if (!password) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Password is required.",

                });

            }


            if (password.length < 8) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Password must be at least 8 characters long.",

                });

            }


            const hashedToken =
                hashToken(token);


            const userByToken =
    await User.findOne({

        passwordResetToken:
            hashedToken,

    });



const user =
    await User.findOne({

        passwordResetToken:
            hashedToken,

        passwordResetExpires: {
            $gt: new Date(),
        },

    });


            if (!user) {

                return res.status(400).json({

                    success: false,

                    message:
                        "This password reset link is invalid or has expired.",

                });

            }


            // Hash new password

            user.password =
                await bcrypt.hash(
                    password,
                    10
                );


            // Remove reset token

            user.passwordResetToken =
                null;

            user.passwordResetExpires =
                null;


            await user.save();


            return res.status(200).json({

                success: true,

                message:
                    "Password reset successfully. You can now login.",

            });


        } catch (error) {

            console.error(
                "Reset password error:",
                error
            );


            return res.status(500).json({

                success: false,

                message:
                    "Unable to reset password.",

            });

        }

    };



// ==========================================
// GET CURRENT USER
// ==========================================

export const getCurrentUser =
    async (req, res) => {

        return res.status(200).json({

            success: true,

            user: req.user,

        });

    };



// ==========================================
// LOGOUT
// ==========================================

export const logout = (req, res) => {

    res.clearCookie(
        "token",
        {
            httpOnly: true,

            secure:
                process.env.NODE_ENV ===
                "production",

            sameSite:
                process.env.NODE_ENV ===
                "production"
                    ? "none"
                    : "lax",
        }
    );


    res.json({

        success: true,

        message:
            "Logged out successfully",

    });

};