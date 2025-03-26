import React, { useContext } from "react";
import "./home.css";
import assets from "../../../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../../../context/AppContext";

const Home = () => {
  const navigate = useNavigate();
  const { userData } = useContext(AppContext);

  // Function to check authentication before navigation
  const handleNavigation = (path) => {
    if (!userData) {
      localStorage.setItem("redirectPath", path); // Store the intended path
      navigate("/auth");
    } else {
      navigate(path);
    }
  };
  

  return (
    <div className="home-container">
      {/* Left Side - Image */}
      <div className="home-image">
        <img src={assets.welcome} alt="Welcome" />
      </div>

      {/* Right Side - Content */}
      <div className="home-content">
        <h1>Welcome to Tevryn</h1>
        <p className="tagline">Connect, Chat, and Capture Ideas Seamlessly.</p>

        <div className="content">
          <div className="fullContent" onClick={() => handleNavigation("/conference")}>
            <img className="contentImg" src={assets.conference} alt="Conference" />
            <p>Conference</p>
          </div>

          <div className="fullContent" onClick={() => handleNavigation("/chat")}>
            <img className="contentImg" src={assets.chat} alt="Chat" />
            <p>Chat</p>
          </div>

          <div className="fullContent" onClick={() => handleNavigation("/note")}>
            <img className="contentImg" src={assets.noteIcon} alt="Note" />
            <p>Note</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
