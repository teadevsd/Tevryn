import React, { useContext } from "react";
import "./RightSideBar.css";
import assets from "../../../assets/assets";
import { summaryAPI } from "../../../common/summaryAPI";
import { toast } from "react-toastify";
import Axios from "../../../lib/Axios";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext";

const RightSideBar = ({ visible, chatUser, mediaFiles = [] }) => {
  const navigate = useNavigate();
  const { userData, setUserData } = useContext(AppContext);

  const handleLogout = async () => {
    try {
      const response = await Axios({
        ...summaryAPI.logout,
        withCredentials: true,
      });

      if (response.data.success) {
        localStorage.removeItem("user");
        setUserData(null);
        toast.success("Logged out successfully");
        navigate("/");
      }
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  return (
    <div className={`right-side ${visible ? "show" : ""}`}>
      <div className="rs-profile">
        <img src={chatUser?.avatar || "/avatar_icon.png"} alt="Profile" />
        <h3>
          {chatUser?.username || "Teachat Admin"} <img src={assets.green_dot} className="dot" alt="Active" />
        </h3>
        <p>{chatUser?.bio || "Hey! I am Teachat Admin using Teachat App"}</p>
        <hr />

        <div className="rs-media">
          <p>Media</p>
          <div>
            {mediaFiles.length > 0 ? (
              mediaFiles.map((file, index) => <img key={index} src={file} alt={`Media ${index}`} />)
            ) : (
              <p>No media available</p>
            )}
          </div>
        </div>
      </div>

      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default RightSideBar;
