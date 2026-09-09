import axiosInstance from "./axios";

const skillAPI = {

    async getSkills() {

        const response = await axiosInstance.get("/skills");

        return response.data;

    }

};

export default skillAPI;