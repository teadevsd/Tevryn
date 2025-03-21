import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "../../lib/Axios";
import { summaryAPI } from "../../common/summaryAPI";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const loadUserData = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
  
      if (!accessToken) {
        console.error("No access token found in localStorage.");
        navigate("/auth", { replace: true }); // 🔥 Ensure proper redirect if token is missing
        return;
      }
  
      const response = await Axios.get(summaryAPI.getUserProfile.url, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
  
      if (!response.data.success) throw new Error("Failed to fetch user data");
  
      setUserData(response.data.data);
      localStorage.setItem("user", JSON.stringify(response.data.data)); // ✅ Save user data to localStorage
    } catch (error) {
      console.error("Error fetching user:", error.response?.data || error.message);
      navigate("/auth", { replace: true }); // 🔥 Redirect if error occurs
    }
  };

  // ✅ Only run loadUserData() if userData is null (prevents unnecessary reloading)
  useEffect(() => {
    if (!userData) {
      loadUserData();
    }
  }, [userData]);

  // ✅ Logout function with proper navigation to "/"
  const logout = async () => {
    try {
      await Axios(summaryAPI.logout);
      setUserData(null);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user"); // ✅ Clear stored user data

      toast.success("Logged out successfully");

      setTimeout(() => navigate("/", { replace: true }), 100); // ✅ Ensure proper navigation
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to log out. Try again.");
    }
  };

  return (
    <AppContext.Provider value={{ userData, setUserData, logout }}>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
