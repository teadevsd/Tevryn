import React, { useState, useEffect, useContext } from "react";
import "./ProfileUpdate.css";
import assets from "../../../assets/assets";
import AxiosToastError from "../../../lib/AxiosToastError";
import Axios from "../../../lib/Axios";
import { summaryAPI } from "../../../common/summaryAPI";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext";


const ProfileUpdate = () => {
  const { userData, updateUserProfileInContext } = useContext(AppContext);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(userData?.avatar || assets.avatar_icon);
  const [username, setUsername] = useState(userData?.username || "");
  const [bio, setBio] = useState(userData?.bio || "");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (userData) {
      setUsername(userData.username || "");
      setBio(userData.bio || "");
      setPreview(userData.avatar || assets.avatar_icon);
    }
  }, [userData]);

  const checkUsernameAvailability = async () => {
    if (username.trim().length === 0) return;

    try {
      const response = await Axios({
        ...summaryAPI.checkUsername,
        method: "post",
        data: { username },
        withCredentials: true,
      });

      if (response.data.exists) {
        setSuggestions(response.data.suggestions);
        toast.error("Username is already taken. Choose a different one.");
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.error("Error checking username:", error);
    }
  };

  const uploadImageCloudinary = async () => {
    if (!image) return null;

    const formData = new FormData();
    formData.append("avatar", image);

    try {
      const response = await Axios({
        url: summaryAPI.uploadAvatar.url,
        method: "put",
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      if (response.data.success) {
        const newAvatar = response.data.data.avatar;
        toast.success("Image uploaded successfully!");
        return newAvatar;
      } else {
        toast.error(response.data.message);
        return null;
      }
    } catch (error) {
      AxiosToastError(error);
      return null;
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      let avatarUrl = preview;
  
      if (image) {
        avatarUrl = await uploadImageCloudinary();
        if (!avatarUrl) {
          toast.error("Image upload failed");
          setLoading(false);
          return;
        }
      }
  
      const response = await Axios({
        ...summaryAPI.updateUserProfile,
        method: "put",
        data: { username, bio, avatar: avatarUrl },
        withCredentials: true,
      });
  
      console.log("Profile Update API Response:", response.data); // Debugging
  
      // ✅ Explicitly check if `response.data.success` is `true`
      if (response.data?.success === true) {
        toast.success("Profile updated successfully!");
  
        // ✅ Update context state properly
        updateUserProfileInContext(response.data.data);
  
        navigate("/chat");
      } else {
        toast.error(response.data.message || "Something went wrong.");
      }
    } catch (error) {
      console.error("Profile update failed:", error);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="profile">
      <div className="profile-container">
        <form onSubmit={handleSave}>
          <h3>Profile Details</h3>

          <label htmlFor="avatar">

          <input
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                setImage(file);
                setPreview(URL.createObjectURL(file)); // ✅ Instantly update preview
              }
            }}
            type="file"
            id="avatar"
            accept=".png, .jpg, .jpeg"
            hidden
          />

            <img src={preview} alt="Profile" />
            Upload profile image
          </label>

          <input
            type="text"
            placeholder="Your name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onBlur={checkUsernameAvailability} // ✅ Check availability on blur
            required
          />

          {suggestions.length > 0 && (
            <div className="suggestions">
              <p>Suggested usernames:</p>
              <ul>
                {suggestions.map((suggested, index) => (
                  <li key={index} onClick={() => setUsername(suggested)}>
                    {suggested}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <textarea
            placeholder="Write your bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            required
          ></textarea>

          <button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </button>
        </form>

        <img className="profile-pic" src={preview} alt="Profile" />

      </div>
    </div>
  );
};

export default ProfileUpdate;
