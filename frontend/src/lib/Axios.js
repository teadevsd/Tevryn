import axios from "axios";
import { baseURL } from "../common/summaryAPI";

const Axios = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Automatically attach the token to all requests
Axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`; // Attach token
  }
  return config;
});

export default Axios;
