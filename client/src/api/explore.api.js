import axiosInstance from "./axios";

const exploreAPI = {

    async getSkills() {

        const response = await axiosInstance.get("/skills");

        return response.data;

    },

    async searchTeachers(skillId) {

        const response = await axiosInstance.get(

            `/mentors/search?skill=${skillId}`

        );

        return response.data;

    }

};

export default exploreAPI;