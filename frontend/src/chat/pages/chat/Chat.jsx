import React, { useState } from "react";
import "./chat.css";
import ChatBox from "../../components/ChatBox/ChatBox";
import LeftSideBar from "../../components/LeftSideBar/LeftSideBar";
import RightSideBar from "../../components/RightSideBar/RightSideBar";
import SelectChat from "../../components/SelectChat/SelectChat";

const Chat = () => {
  const [selectedUser, setSelectedUser] = useState(null); // Track selected user

  return (
    <div className="chat">
      <div className="chat-container">
        {/* Pass setSelectedUser to LeftSideBar */}
        <LeftSideBar onSelectUser={(user) => setSelectedUser(user)} />

        {/* If a user is selected, show ChatBox, else show SelectChat */}
        {selectedUser ? (
          <>
            <ChatBox chatUser={selectedUser} />
            <RightSideBar />
          </>
        ) : (
          <div className="select-chat">
            <SelectChat />
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
