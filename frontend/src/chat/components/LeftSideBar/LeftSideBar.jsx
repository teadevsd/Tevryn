import React, { useContext, useEffect, useState } from "react";
import "./LeftSideBar.css";
import assets from "../../../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import Axios from "../../../lib/Axios";
import { summaryAPI } from "../../../common/summaryAPI";
import { toast } from "react-toastify";

const LeftSideBar = ({ onSelectUser }) => {
  const { logout, userData } = useContext(AppContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        console.log("Token Being Sent in Request:", accessToken); // Debugging
  
        if (!accessToken) {
          console.error("No access token found in localStorage.");
          return;
        }
  
        const response = await Axios.get(summaryAPI.getUserProfile.url, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
  
        console.log("Response from Server:", response.data); // Debugging
  
        if (response.data.success && response.data.data) {
          const contact = response.data.data;
          setContacts([
            {
              id: contact._id,
              username: contact.username,
              email: contact.email,
              bio: contact.bio?.trim() !== "" ? contact.bio : "No bio available",
              avatar: contact.avatar || assets.profile_img,
              online: checkOnlineStatus(contact.lastSeen),
              lastSeen: contact.lastSeen ? formatLastSeen(contact.lastSeen) : "Last seen unavailable",
            }
          ]);
        }
      } catch (error) {
        console.error("Error fetching contacts:", error.response?.data || error.message);
      }
    };
    fetchContacts();
  }, []);
  

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      if (searchQuery) {
        handleSearch();
      } else {
        setSearchResult(null);
      }
    }, 500);
    return () => clearTimeout(delaySearch);
  }, [searchQuery]);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await Axios({
        ...summaryAPI.searchUser,
        params: { query: searchQuery },
      });
      
      if (response.data?.found) {
        const foundUser = response.data.user;
        setSearchResult({
          found: true,
          id: foundUser.id,
          username: foundUser.username,
          email: foundUser.email,
          avatar: foundUser.avatar || assets.profile_img,
          bio: foundUser.bio?.trim() !== "" ? foundUser.bio : "No bio available",
          online: foundUser.lastSeen ? checkOnlineStatus(foundUser.lastSeen) : false,
          lastSeen: foundUser.lastSeen ? formatLastSeen(foundUser.lastSeen) : "Last seen unavailable",
        });
      } else {
        setSearchResult({ found: false, message: "User not found, you can send an invite instead" });
      }
    } catch (error) {
      console.error("Search API error:", error);
      setSearchResult({ found: false, message: "User not found, you can send an invite instead" });
    } finally {
      setLoading(false);
    }
  };

  const checkOnlineStatus = (lastSeen) => {
    if (!lastSeen) return false;
    const lastSeenTime = new Date(lastSeen).getTime();
    return Date.now() - lastSeenTime <= 5 * 60 * 1000;
  };


  const formatLastSeen = (lastSeen) => {
    if (!lastSeen) return "Last seen unavailable";
    const date = new Date(lastSeen);
    return date.toLocaleDateString();
  };

  const handleLogout = () => {
    logout(); // Call logout from AppContext
  };
  

  return (
    <div className="ls">
      <div className="ls-top">
        <div className="ls-nav">
          <img src={assets.teachat_text} className="logo" alt="Teachat Logo" />
          <div className="menu">
            <img src={assets.menu_icon} alt="Menu" />
            <div className="sub-menu">
              <Link to="/profile"><p>Edit Profile</p></Link>
              <hr />
              <Link to="/add-friend"><p>Add Friend</p></Link>
              <hr />
              <p>Create Group</p>
              <hr />
              <p>Broadcast List</p>
              <hr />
              <p>Archieve</p>
              <hr />
              <p>Conference Call</p>
              <hr />
              <p>Note Taking</p>
              <hr />
              <p onClick={handleLogout}>Logout</p>
            </div>
          </div>
        </div>
        <div className="ls-search">
          <img src={assets.search_icon} alt="Search" />
          <input
            type="text"
            placeholder="Search here..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <div className="ls-list">
        {loading && <p>Loading...</p>}
        {contacts.map((contact) => (
          <div key={contact.id} className="friend" onClick={() => onSelectUser(contact)}>
            <img src={contact.avatar} alt="User" />
            <div className="friend-info">
              <p>{contact.username || contact.email || "User"}</p>
              <span>{contact.bio}</span>
            </div>
            <div className="status">
              {contact.online ? (
                <img className="dot" src={assets.green_dot} alt="Online" />
              ) : (
                <span className="last-seen">{contact.lastSeen}</span>
              )}
            </div>
          </div>
        ))}

        {searchResult && searchResult.found && (
          <div className="friend" onClick={() => onSelectUser(searchResult)}>
            <img src={searchResult.avatar} alt="User" />
            <div className="friend-info">
              <p>{searchResult.username || searchResult.email || "User"}</p>
              <span>{searchResult.bio}</span>
            </div>
            <div className="status">
              {searchResult.online ? (
                <img className="dot" src={assets.green_dot} alt="Online" />
              ) : (
                <span className="last-seen">{searchResult.lastSeen}</span>
              )}
            </div>
          </div>
        )}

        {searchResult && !searchResult.found && <p className="not-found">{searchResult.message}</p>}
      </div>
    </div>
  );
};

export default LeftSideBar;
