import mongoose from "mongoose";
import { NOTIFICATION_TYPES } from "../constants/notificationTypes.js";

const notificationSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
},

    learningRequest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "LearningRequest",
},

    title: {
        type: String,
        required: true,
        trim: true
    },

    message: {
        type: String,
        required: true,
        trim: true
    },

    type: {
        type: String,
        enum: Object.values(NOTIFICATION_TYPES),
        default: NOTIFICATION_TYPES.SYSTEM
    },

    isRead: {
        type: Boolean,
        default: false
    }

},{
    timestamps:true
});

export default mongoose.model(
    "Notification",
    notificationSchema
);