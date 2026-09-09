import mongoose from "mongoose";
import { REQUEST_STATUS } from "../constants/requestStatus.js";
import { REQUEST_TYPES } from "../constants/requestStatus.js";
import { PAYMENT_STATUS } from "../constants/paymentStatus.js";

const learningRequestSchema = new mongoose.Schema(
{
    learner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

    mentor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

    skill:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Skill",
        required:true
    },

    requestType:{
        type:String,
        enum:Object.values(REQUEST_TYPES),
        required:true
    },

    exchangeSkill:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Skill",
        default:null
    },

    creditCost:{
        type:Number,
        default:0
    },

    paymentStatus: {
    type: String,
    enum: Object.values(PAYMENT_STATUS),
    default: PAYMENT_STATUS.NOT_RESERVED
},

    message:{
        type:String,
        trim:true,
        default:""
    },

    preferredSchedule:{
        type:String,
        default:""
    },

    status:{
        type:String,
        enum:Object.values(REQUEST_STATUS),
        default:REQUEST_STATUS.PENDING
    },

    numberOfSessions: {
    type: Number,
    required: true,
    default: 1
}

},
{
    timestamps:true
});

export default mongoose.model(
    "LearningRequest",
    learningRequestSchema
);