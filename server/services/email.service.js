import { BrevoClient } from "@getbrevo/brevo";
import dotenv from "dotenv";

dotenv.config({
    path: "./.env"
});


const brevo = new BrevoClient({
    apiKey: process.env.BREVO_API_KEY,
});


const sender = {
    email: process.env.BREVO_SENDER_EMAIL,
    name: process.env.BREVO_SENDER_NAME || "SkillSwap",
};


export const sendVerificationEmail = async ({
    email,
    name,
    token,
}) => {

    const verificationUrl =
        `${process.env.CLIENT_URL}/verify-email?token=${token}`;


    await brevo.transactionalEmails.sendTransacEmail({

        sender,

        to: [
            {
                email,
                name,
            },
        ],

        subject: "Verify your SkillSwap email",

        htmlContent: `
            <div style="
                font-family: Arial, sans-serif;
                max-width: 600px;
                margin: auto;
                padding: 30px;
            ">

                <h2>Welcome to SkillSwap, ${name}! 👋</h2>

                <p>
                    Thank you for creating an account.
                </p>

                <p>
                    Please verify your email address by clicking
                    the button below.
                </p>

                <a
                    href="${verificationUrl}"
                    style="
                        display: inline-block;
                        margin: 20px 0;
                        padding: 12px 24px;
                        background-color: #059669;
                        color: white;
                        text-decoration: none;
                        border-radius: 8px;
                    "
                >
                    Verify Email
                </a>

                <p>
                    This verification link will expire in 24 hours.
                </p>

                <p>
                    If you did not create this account,
                    you can safely ignore this email.
                </p>

            </div>
        `,
    });
};


export const sendPasswordResetEmail = async ({
    email,
    name,
    token,
}) => {

    const resetUrl =
        `${process.env.CLIENT_URL}/reset-password?token=${token}`;


    await brevo.transactionalEmails.sendTransacEmail({

        sender,

        to: [
            {
                email,
                name,
            },
        ],

        subject: "Reset your SkillSwap password",

        htmlContent: `
            <div style="
                font-family: Arial, sans-serif;
                max-width: 600px;
                margin: auto;
                padding: 30px;
            ">

                <h2>Hello ${name},</h2>

                <p>
                    We received a request to reset your password.
                </p>

                <a
                    href="${resetUrl}"
                    style="
                        display: inline-block;
                        margin: 20px 0;
                        padding: 12px 24px;
                        background-color: #059669;
                        color: white;
                        text-decoration: none;
                        border-radius: 8px;
                    "
                >
                    Reset Password
                </a>

                <p>
                    This link will expire in 1 hour.
                </p>

                <p>
                    If you did not request a password reset,
                    you can safely ignore this email.
                </p>

            </div>
        `,
    });
};