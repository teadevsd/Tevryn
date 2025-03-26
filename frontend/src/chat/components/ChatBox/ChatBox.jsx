import React, { useContext, useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import "./ChatBox.css";
import assets from "../../../assets/assets";

import Axios from "../../../lib/Axios";
import SelectChat from "../SelectChat/SelectChat";
import RightSideBar from "../RightSideBar/RightSideBar";
import { summaryAPI } from "../../../common/summaryAPI";
import { AppContext } from "../../../context/AppContext";

const socket = io("http://localhost:2323");

const ChatBox = ({ chatUser }) => {
  const { userData } = useContext(AppContext);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const messagesEndRef = useRef(null);

  // Fetch messages when chatUser changes
  useEffect(() => {
    const fetchMessages = async () => {
      if (!chatUser) return;
      try {
        const response = await Axios({
          ...summaryAPI.getMessages,
          params: {
            sender: userData?.username || "user",
            receiver: chatUser.username,
          },
        });

        // Sort messages (oldest first)
        setMessages(response.data.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)));
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [chatUser]);

  // Listen for new messages
  useEffect(() => {
    socket.on("receiveMessage", (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
        socket.off("receiveMessage");
    };
}, []);


  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send message
  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const messageData = {
        sender: userData?.username || "user",
        receiver: chatUser?.username,
        text: newMessage,
        timestamp: new Date().toISOString(),
    };

    socket.emit("sendMessage", messageData);
    setNewMessage(""); // Clear input after sending
};


  return (
    <div className="chat-container">
      <div className={`chat-box ${isSidebarOpen ? "" : "full-width"}`}>
        {chatUser ? (
          <>
            <div className="chat-user" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
              <img src={chatUser?.avatar || assets.profile_img} alt="Profile" />
              <div className="chat-user-info">
                <p className="chat-username">{chatUser?.username}</p>
                <p className="chat-last-seen">{chatUser?.online ? "Online" : "Last seen"}</p>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="chat-message">
              {messages.map((msg, index) => (
                <div key={index} className={msg.sender === userData?.username ? "sender-message" : "reader-message"}>
                  <p className="msg">{msg.text}</p>
                  <div>
                  <img
                    src={msg.sender === userData?.username 
                      ? userData?.avatar || assets.profile_img  // ✅ Use userData.avatar for messages sent by the logged-in user
                      : chatUser?.avatar || assets.profile_img  // ✅ Use chatUser.avatar for messages received
                    }
                    alt="User"
                  />

                    <p className="msg-time">{new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true })}</p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <div className="chat-input">
             <textarea
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault(); // Prevent new line on Enter (unless Shift is held)
                        sendMessage();
                    }
                }}
              />

              
              <label htmlFor="gallery">
                <img src={assets.gallery_icon} alt="Gallery" />	  	
              </label>
              <img src={assets.send_button} alt="Send" onClick={sendMessage} />
            </div>
          </>
        ) : (
          <div className="select-chat">
            <SelectChat />
          </div>
        )}
      </div>

      {/* Sidebar */}
      <RightSideBar visible={isSidebarOpen} chatUser={chatUser} />
    </div>
  );
};

export default ChatBox;
