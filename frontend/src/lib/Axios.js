import axios from "axios";
import { baseURL, summaryAPI } from "../common/summaryAPI";

const Axios = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // ✅ Ensures cookies are sent with every request
});

// ✅ Refresh Token Function
const refreshToken = async () => {
  try {
    const response = await axios.post(
      `${baseURL}/${summaryAPI.refreshToken.url}`,
      {}, // ✅ Empty body since the backend expects refresh token from cookies
      { withCredentials: true } // ✅ Ensure cookies are sent
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

// ✅ Attach token to all requests
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

// ✅ Handle expired tokens & auto-refresh
Axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      console.log("Token expired, attempting refresh...");
      const newToken = await refreshToken();

      if (newToken) {
        error.config.headers.Authorization = `Bearer ${newToken}`;
        localStorage.setItem("accessToken", newToken);
        return Axios(error.config); // 🔥 Retries the same request
      }
    }
    return Promise.reject(error);
  }
);

export default Axios;
