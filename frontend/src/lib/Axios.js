import axios from "axios";
import { baseURL, summaryAPI } from "../common/summaryAPI";

const Axios = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Ensures cookies are sent with every request
});

// ✅ Refresh Token Function
const refreshToken = async () => {
  try {
    const response = await axios.post(
      `${baseURL}/${summaryAPI.refreshToken.url}`,
      {},
      { withCredentials: true }
    );

    if (response.data.accessToken) {
      localStorage.setItem("accessToken", response.data.accessToken);
      return response.data.accessToken;
    }
  } catch (error) {
    console.error("Refresh Token Error:", error.response?.data || error.message);
    localStorage.removeItem("accessToken");
    return null;
  }
};

// ✅ Request Interceptor to attach token
Axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response Interceptor for 401 handling
Axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 🔒 Prevent infinite loops
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      console.log("Token expired, attempting refresh...");

      const newToken = await refreshToken();

      if (newToken) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return Axios(originalRequest); // 🔁 Retry with new token
      }
    }

    return Promise.reject(error);
  }
);

export default Axios;
