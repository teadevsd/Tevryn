import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Axios from "../lib/Axios";
import { summaryAPI } from "../common/summaryAPI";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });


  const loadUserData = async () => {
    try {
      console.log("🔄 Running loadUserData...");
      const accessToken = localStorage.getItem("accessToken");
  
      if (!accessToken) {
        console.error("⛔ No access token found.");
        return; // Prevent navigation
      }
  
      const response = await Axios.get(summaryAPI.getUserProfile.url, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
  
      if (!response.data.success) throw new Error("❌ Failed to fetch user data");
  
      setUserData(response.data.data);
      localStorage.setItem("user", JSON.stringify(response.data.data));
  
      // Check if there's a stored redirect path
      const redirectPath = localStorage.getItem("redirectPath");
      console.log("🛣️ Redirect Path:", redirectPath);
  
      if (redirectPath) {
        navigate(redirectPath, { replace: true });
        localStorage.removeItem("redirectPath");
      }
    } catch (error) {
      console.error("Error fetching user:", error.response?.data || error.message);
    }
  };
  
  
  
 
 
 
  // ✅ Only run loadUserData() if userData is null (prevents unnecessary reloading)
  useEffect(() => {
    if (!userData) {
      loadUserData();
    }
    // ✅ Run this effect only once when the component mounts
  }, []);
  

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
