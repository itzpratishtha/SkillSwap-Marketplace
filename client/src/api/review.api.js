import axiosInstance from "./axios";

const reviewAPI = {

    async addReview(data) {

        const response = await axiosInstance.post(
            "/reviews",
            data
        );

        return response.data;
    },

    async getMentorReviews(mentorId) {

        const response = await axiosInstance.get(
            `/reviews/${mentorId}`
        );

        return response.data;
    },

};

export default reviewAPI;