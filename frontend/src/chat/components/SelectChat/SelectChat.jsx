import React from "react";
import "./SelectChat.css"; // External CSS
import assets from "../../../assets/assets"; // Adjust the path as needed

const SelectChat = () => {
  return (
    <div className="select-chat">
      <div className="selectCont">
        <img src={assets.teachat_fff} alt="Select a chat" className="select-image" />
        <h2>Welcome to Teachat!</h2>
        <p>Click on a contact to start messaging.</p>
      </div>
    </div>
  );
};

export default SelectChat;
