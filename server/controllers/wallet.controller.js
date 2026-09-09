import User from "../models/User.js";
import CreditTransaction from "../models/CreditTransaction.js";


// ============================================
// GET WALLET
// ============================================

export const getWallet = async (req, res) => {

    try {

        const user = await User.findById(
            req.user._id
        ).select(
            "credits reservedCredits"
        );

        if (!user) {

            return res.status(404).json({
                success: false,
                message: "User not found.",
            });

        }

        const totalCredits =
            user.credits || 0;

        const reservedCredits =
            user.reservedCredits || 0;

        const availableCredits =
            totalCredits - reservedCredits;


        const transactions =
            await CreditTransaction.find({
                user: user._id,
            })
            .sort({
                createdAt: -1,
            });


        return res.status(200).json({

            success: true,

            wallet: {

                totalCredits,

                reservedCredits,

                availableCredits,

            },

            transactions,

        });

    } catch (error) {

        console.error(
            "Error fetching wallet:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Failed to load wallet.",

        });

    }
};