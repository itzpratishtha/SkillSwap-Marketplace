import axiosInstance from "./axios";

const messageAPI = {

    async getMessages(requestId) {

        const response =
            await axiosInstance.get(
                `/messages/${requestId}`
            );

        return response.data;
    },

    async sendMessage(requestId, data) {

        const response =
            await axiosInstance.post(
                `/messages/${requestId}`,
                data
            );

        return response.data;
    },

};

export default messageAPI;