import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
{
    learningRequest:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"LearningRequest",
        required:true,
        unique:true
    },

    mentor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

    learner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

    rating:{
        type:Number,
        required:true,
        min:1,
        max:5
    },

    review:{
        type:String,
        trim:true,
        default:""
    }

},
{
    timestamps:true
}
);

export default mongoose.model("Review",reviewSchema);