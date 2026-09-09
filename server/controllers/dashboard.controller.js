import { getDashboardData } from "../services/dashboard.service.js";

export const getDashboard = async (req, res) => {
    try {
        const dashboard = await getDashboardData(req.user._id);

        return res.status(200).json({
            success: true,
            dashboard,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};