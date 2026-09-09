import axiosInstance from "./axios";

export const registerUser = async (data) => {
  const response = await axiosInstance.post("/auth/register", data);
  return response.data;
};

export const loginUser = async (data) => {
  const response = await axiosInstance.post("/auth/login", data);
  return response.data;
};

export const logoutUser = async () => {
  const response = await axiosInstance.post("/auth/logout");
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await axiosInstance.get("/auth/me");
  return response.data;
};

export const forgotPassword = async (email) => {
  const response = await axiosInstance.post("/auth/forgot-password", { email });
  return response.data;
};

export const resetPassword = async (token, password) => {
  const response = await axiosInstance.post(
    `/auth/reset-password?token=${token}`,
    { password }
  );
  return response.data;
};

export const verifyEmail = async (token) => {
  const response = await axiosInstance.get(
    `/auth/verify-email?token=${token}`
  );
  return response.data;
};

export const resendVerificationEmail = async (email) => {
  const response = await axiosInstance.post(
    "/auth/resend-verification",
    { email }
  );
  return response.data;
};