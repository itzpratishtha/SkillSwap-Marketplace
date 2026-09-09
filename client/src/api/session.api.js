import axiosInstance from "./axios";

const sessionAPI = {

    async getTeachingSessions() {

        const response = await axiosInstance.get("/sessions/teaching");

        return response.data;

    },

    async getLearningSessions() {

        const response = await axiosInstance.get("/sessions/learning");

        return response.data;

    },

    async scheduleSession(id, data) {

        const response = await axiosInstance.patch(

            `/sessions/${id}/schedule`,

            data

        );

        return response.data;

    },

    async completeSession(id) {

        const response = await axiosInstance.patch(

            `/sessions/${id}/complete`

        );

        return response.data;

    }

};

export default sessionAPI;