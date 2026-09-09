import axiosInstance from "./axios";

const requestAPI = {

    async createRequest(data) {
        const res = await axiosInstance.post("/requests", data);
        return res.data;
    },

    async getSentRequests() {
        const res = await axiosInstance.get("/requests/sent");
        return res.data;
    },

    async getReceivedRequests() {
        const res = await axiosInstance.get("/requests/received");
        return res.data;
    },

    async acceptRequest(id) {
        const res = await axiosInstance.patch(`/requests/${id}/accept`);
        return res.data;
    },

    async rejectRequest(id) {
        const res = await axiosInstance.patch(`/requests/${id}/reject`);
        return res.data;
    }

};

export default requestAPI;