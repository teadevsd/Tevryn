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
  const [loadingUserData, setLoadingUserData] = useState(true); // Start with loading as true

  const loadUserData = async () => {
    setLoadingUserData(true); // Set loading to true immediately
    const accessToken = localStorage.getItem("accessToken");
  
    if (!accessToken) {
      setLoadingUserData(false);
      return;
    }
  
    try {
      const response = await Axios.get(summaryAPI.getUserProfile.url, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
  
      if (response.data.success && response.data.data) {
        setUserData(response.data.data);
        localStorage.setItem("user", JSON.stringify(response.data.data));
  
        const redirectPath = localStorage.getItem("redirectPath");
        if (redirectPath) {
          navigate(redirectPath, { replace: true });
          localStorage.removeItem("redirectPath");
        }
      }
    } catch (error) {
      console.error("Failed to load user data", error);
    } finally {
      setLoadingUserData(false); // 🔁 Important to always stop loading
    }
  };
  
  
  

  // ✅ Only run loadUserData() if userData is null (prevents unnecessary reloading)
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!userData && token) {
      loadUserData(); // Fetch and set user data
    } else {
      setLoadingUserData(false); // Already has user data
    }
  }, []);
  
  

  const logout = async () => {
    try {
      await Axios(summaryAPI.logout);
      setUserData(null);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");

      toast.success("Logged out successfully");

      setTimeout(() => navigate("/", { replace: true }), 100);
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to log out. Try again.");
    }
  };

  return (
    <AppContext.Provider value={{ userData, setUserData, loadingUserData, logout }}>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
