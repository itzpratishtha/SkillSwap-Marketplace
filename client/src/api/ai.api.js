import axiosInstance from "./axios";


// ==========================================
// CHAT WITH SKILLSWAP AI
// ==========================================

export const chatWithAI = async (
    message,
    history = []
) => {

    const response =
        await axiosInstance.post(
            "/ai/chat",
            {
                message,
                history,
            }
        );


    return response.data;

};