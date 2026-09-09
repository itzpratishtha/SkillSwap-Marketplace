import mongoose from "mongoose";

const userSkillSchema = new mongoose.Schema(
    {
        skill: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Skill",
            required: true,
        },

        level: {
            type: String,
            enum: [
                "Beginner",
                "Intermediate",
                "Advanced",
                "Expert",
            ],
            required: true,
        },

        creditCost: {
            type: Number,
            required: true,
            min: 1,
            default: 1,
        },
    },
    {
        _id: false,
    }
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    isEmailVerified: {
    type: Boolean,
    default: false,
},

emailVerificationToken: {
    type: String,
    default: null,
},

emailVerificationExpires: {
    type: Date,
    default: null,
},

passwordResetToken: {
    type: String,
    default: null,
},

passwordResetExpires: {
    type: Date,
    default: null,
},

    role: {
      type: String,
      enum: ["Student", "Freelancer", "Mentor", "Professional"],
      required: true,
    },

    credits: {
      type: Number,
      default: 0,
    },

    reservedCredits: {
    type: Number,
    default: 0
},

    profileCompleted: {
      type: Boolean,
      default: false,
    },

    welcomeCreditsClaimed: {
    type: Boolean,
    default: false,
    },

    profilePhoto: {
      type: String,
      default: "",
    },

    bio: {
      type: String,
      default: "",
    },

    experience: {
      type: String,
      default: "",
    },

    skillsTeach: {
    type: [userSkillSchema],
    default: [],
},

    skillsLearn: {
      type: [userSkillSchema],
      default: [],
    },

    certificates: [
      {
        type: String,
      },
    ],

    portfolio: {
      type: String,
      default: "",
    },

    github: {
      type: String,
      default: "",
    },

    linkedin: {
      type: String,
      default: "",
    },

    availability: {
      type: String,
      default: "",
    },

    averageRating:{
    type:Number,
    default:0
},

totalReviews:{
    type:Number,
    default:0
},

    badges: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;