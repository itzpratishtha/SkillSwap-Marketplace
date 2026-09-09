import axiosInstance from "./axios";

const mentorAPI = {

    async getProfile(id) {

        const response = await axiosInstance.get(
            `/mentors/${id}`
        );

        return response.data;

    }

};

export default mentorAPI;