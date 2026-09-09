import CreditTransaction from "../models/CreditTransaction.js";
import { CREDIT_TYPES } from "../constants/creditTypes.js";
import User from "../models/User.js";

export const addCredits = async (
    user,
    amount,
    type,
    reason
) => {

    if (!user) {
        throw new Error("User not found.");
    }

    if (!Number.isFinite(amount) || amount <= 0) {
        throw new Error("Credit amount must be greater than zero.");
    }

    user.credits += amount;

    await user.save();

    await CreditTransaction.create({
        user: user._id,
        amount,
        type,
        reason,
        balanceAfter: user.credits,
    });

    return user;
};

export const reserveCredits = async (userId, amount) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found.");
  }

  const availableCredits = user.credits - (user.reservedCredits || 0);

  if (availableCredits < amount) {
    throw new Error("Insufficient credits available.");
  }
  // Lock the credits
  user.reservedCredits = (user.reservedCredits || 0) + amount;
  await user.save();
  return user;
};

export const releaseCredits = async (userId, amount) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found.");
  }

  // Safety check to avoid negative reserved credits
  if ((user.reservedCredits || 0) < amount) {
    throw new Error("Cannot release more credits than what is reserved.");
  }

  user.reservedCredits -= amount;
  await user.save();
  return user;
};

export const transferCredits = async (learnerId, mentorId, amount) => {
  const learner = await User.findById(learnerId);
  const mentor = await User.findById(mentorId);

  if (!learner || !mentor) {
    throw new Error("Learner or Mentor user not found.");
  }

  if ((learner.reservedCredits || 0) < amount) {
    throw new Error("Insufficient reserved credits to fulfill transfer.");
  }

  // Deduct from Learner's total and reserved bank
  learner.credits -= amount;
  learner.reservedCredits -= amount;

  // Add to Mentor's bank
  mentor.credits += amount;

  await learner.save();
  await mentor.save();
  
  try {
    await CreditTransaction.create([
      {
        user: learner._id,
        amount: -amount,
        type: CREDIT_TYPES?.SESSION_PAYMENT || "SPENT",
        reason: "Completed learning session settlement",
        balanceAfter: learner.credits,
      },
      {
        user: mentor._id,
        amount: amount,
        type: CREDIT_TYPES?.SESSION_EARNING || "EARNED",
        reason: "Completed mentoring session earnings",
        balanceAfter: mentor.credits,
      }
    ]);
  } catch (logError) {
    console.error("Warning: Could not log credit transactions, balance updated.", logError);
  }
  
  return { learner, mentor };
};