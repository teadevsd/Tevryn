import React from "react";
import "./home.css";
import assets from "../../../assets/assets"; // Ensure your assets path is correct
import { Link, useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

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

          <div className="fullContent">
            <Link to="/conference"><img className="contentImg" src={assets.conference} alt="Conference" /></Link>
            <p>Conference</p>
          </div>

          <div className="fullContent">
            <Link to="/auth"><img className="contentImg" src={assets.chat} alt="Chat" /></Link>
            <p>Chat</p>
          </div>

          <div className="fullContent">
            <Link to="/note"><img className="contentImg" src={assets.note} alt="Note" /></Link>
            <p>Note</p>
          </div>

        </div>

        {/* <button onClick={() => navigate("/")}>Get Started</button> */}
      </div>
    </div>
  );
};

export default Home;
