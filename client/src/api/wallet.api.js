import api from "./axios";

const walletAPI = {

    getWallet: async () => {

        const response =
            await api.get("/wallet");

        return response.data;

    },

};

export default walletAPI;