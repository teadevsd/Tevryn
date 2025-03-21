import React, { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import { AppContext } from "../../../context/AppContext";
import Axios from "../../../../lib/Axios";
import "./AddFriend.css"; // Import external CSS
import { summaryAPI } from "../../../../common/summaryAPI";
import { useNavigate } from "react-router-dom";

const AddFriend = () => {
  const { userData } = useContext(AppContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await Axios({ ...summaryAPI.getContacts });
        setContacts(response.data); 
      } catch (error) {
        console.error("Error fetching contacts:", error);
      }
    };
  
    fetchContacts();
  }, []);
  

  const handleSearch = async () => {
    if (!searchQuery) return;
    setLoading(true);
  
    try {
      const response = await Axios({
        ...summaryAPI.searchUser,
        params: { query: searchQuery },
      })
  
      if (response.data.found) {
        setSearchResult({
          found: true,
          ...response.data.user,
        });
      } else {
        setSearchResult({
          found: false,
          message: response.data.message,
        });
      }
    } catch (error) {
      setSearchResult({
        found: false,
        message: "User not found, you can send an invite instead",
      });
    } finally {
      setLoading(false);
    }
  };



const handleMessage = (userId) => {
  navigate(`/chat/${userId}`); // Navigates to chat with the selected user
};

  

  const sendFriendRequest = async (userId) => {
    try {
      await Axios({
        ...summaryAPI.sendFriendRequest,
        params: { userId },
      })
      toast.success("Friend request sent!");
    } catch (error) {
      toast.error("Error sending friend request.");
    }
  };

  const sendInvite = async (phoneNumber) => {
    try {
      await Axios({
        ...summaryAPI.friendInvite,
        params: { phoneNumber },
      })
      toast.success("Invite sent!");
    } catch (error) {
      toast.error("Error sending invite.");
    }
  };

  return (
    <div className="addFriend">
      <div className="add-friend-container">
        <h2 className="add-friend-title">Add Friend</h2>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by email or username"
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button onClick={handleSearch} className="search-button">
            Search
          </button>
        </div>

        {loading && <p className="text-gray">Searching...</p>}

        {searchResult && (
          <div className="search-result">
            {searchResult.found ? (
              // If user exists, show Message button
              <div className="contact-info">
                <img
                  src={searchResult.avatar || "/default-avatar.png"}
                  alt="Avatar"
                  className="contact-avatar"
                />
                <p>{searchResult.username || searchResult.email}</p>
                <button className="message-button" onClick={() => handleMessage(searchResult.id)} >Message</button>
              </div>
            ) : (
              // If user is not found, show Invite button
              <div className="invite-container">
                <p className="text-gray">{searchResult.message}</p>
                <button
                  onClick={() => sendInvite(searchQuery)}
                  className="invite-button"
                >
                  Send Invite
                </button>
              </div>
            )}
          </div>
        )}


        <h3 className="add-friend-title">Contacts on Teachat</h3>
        <div className="contact-list">
          {contacts.length > 0 ? (
            contacts.map((contact) => (
              <div key={contact.phoneNumber} className="contact-item">
                <div className="contact-info">
                  <img
                    src={contact.avatar || "/default-avatar.png"}
                    alt="Avatar"
                    className="contact-avatar"
                  />
                  <p>{contact.username || contact.phoneNumber}</p>
                </div>
                {contact.isRegistered ? (
                  <button
                    onClick={() => sendFriendRequest(contact.id)}
                    className="add-friend-button"
                  >
                    Add Friend
                  </button>
                ) : (
                  <button
                    onClick={() => sendInvite(contact.phoneNumber)}
                    className="invite-button"
                  >
                    Invite
                  </button>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray">No contacts found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddFriend;
