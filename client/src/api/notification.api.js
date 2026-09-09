import axiosInstance from "./axios";

const notificationAPI = {

    async getNotifications() {
        const response = await axiosInstance.get(
            "/notifications"
        );

        return response.data;
    },

    async getUnreadCount() {
        const response = await axiosInstance.get(
            "/notifications/unread-count"
        );

        return response.data;
    },

    async markAsRead(notificationId) {
        const response = await axiosInstance.patch(
            `/notifications/${notificationId}/read`
        );

        return response.data;
    },

    async markAllAsRead() {
        const response = await axiosInstance.patch(
            "/notifications/read-all"
        );

        return response.data;
    },

};

export default notificationAPI;