import axiosInstance from "./axios";

const profileAPI = {

    async getProfile() {

        const response = await axiosInstance.get("/users/profile");

        return response.data;

    },

    async updateProfile(profileData) {

        const response = await axiosInstance.put(
            "/users/profile",
            profileData
        );

        return response.data;

    }

};

export default profileAPI;