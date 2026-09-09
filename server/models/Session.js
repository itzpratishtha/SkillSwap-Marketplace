import mongoose from "mongoose";
import { SESSION_STATUS } from "../constants/sessionStatus.js";

const sessionSchema = new mongoose.Schema(
  {
    learningRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LearningRequest",
      required: true,
    },

    mentor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    learner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    skill: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Skill",
      required: true,
    },

    sessionNumber: {
      type: Number,
      required: true,
    },

    scheduledAt: {
      type: Date,
      default: null,
    },

    duration: {
      type: Number,
      default: 60,
    },

    mode: {
      type: String,
      enum: ["ONLINE", "OFFLINE"],
      default: "ONLINE",
    },

    meetingLink: {
      type: String,
      default: "",
    },

    location: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: Object.values(SESSION_STATUS),
      default: SESSION_STATUS.SCHEDULED,
    },

    mentorCompleted: {
    type: Boolean,
    default: false
},

learnerCompleted: {
    type: Boolean,
    default: false
},

creditsSettled: {
    type: Boolean,
    default: false,
},

creditCost: {
    type: Number,
    default: 0,
},
    
    lastUpdatedAt: {
    type: Date,
    default: Date.now,
}
  },

  {
    timestamps: true,
  }

);

export default mongoose.model("Session", sessionSchema);