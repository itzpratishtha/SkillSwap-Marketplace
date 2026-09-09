import axiosInstance from "./axios";

const dashboardAPI = {

    async getDashboard() {

        const response = await axiosInstance.get("/dashboard");

        return response.data;

    }

};

export default dashboardAPI;