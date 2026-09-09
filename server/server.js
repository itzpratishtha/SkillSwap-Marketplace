import express from "express";
import dns from "dns";

dns.setDefaultResultOrder("ipv4first");
import cors from "cors";
import dotenv from "dotenv";

dotenv.config({
    path: "./.env"
});

import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import skillRoutes from "./routes/skill.routes.js";
import mentorRoutes from "./routes/mentor.routes.js";
import requestRoutes from "./routes/request.routes.js";
import sessionRoutes from "./routes/session.routes.js";
import reviewRoutes from "./routes/review.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import messageRoutes from "./routes/message.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import walletRoutes from "./routes/wallet.routes.js";

import cookieParser from "cookie-parser";
import http from "http";
import { Server } from "socket.io";
import aiRoutes from "./routes/ai.routes.js";

connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials: true,
    })
);
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/mentors", mentorRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/ai", aiRoutes);

app.get("/", (req, res) => {
    res.send("Welcome to SkillSwap API 🚀");
});

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin:  process.env.CLIENT_URL,
        credentials: true,
    },
});

io.on("connection", (socket) => {

    console.log(
        "Socket connected:",
        socket.id
    );

    socket.on("join-request", (requestId) => {

        socket.join(`request:${requestId}`);

        console.log(
            `Socket ${socket.id} joined request:${requestId}`
        );
    });

    socket.on("disconnect", () => {

        console.log(
            "Socket disconnected:",
            socket.id
        );

    });

});

app.set("io", io);


server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});