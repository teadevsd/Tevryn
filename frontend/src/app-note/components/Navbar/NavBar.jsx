import React, { useState, useEffect } from "react";
import "./NavBar.css";
import ProfileInfo from "../Cards/ProfileInfo/ProfileInfo";
import SearchBar from "../SearchBar/SearchBar";
import assets from "../../../assets/assets";
import Axios from "../../../lib/Axios";
import { summaryAPI } from "../../../common/summaryAPI";
import moment from "moment";
import AxiosToastError from "../../../lib/AxiosToastError";

const NavBar = ({ setFilteredNotes }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [allNotes, setAllNotes] = useState([]);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
          console.error("Access token not found!");
          return;
        }

        const response = await Axios.get(summaryAPI.getAllNotes.url, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (response.data.success && response.data.data) {
          setAllNotes(response.data.data);
          setFilteredNotes(response.data.data); // Initialize with all notes
        } else {
          console.error("Notes not found in API response:", response.data);
        }
      } catch (error) {
        console.error("Error fetching notes:", error);
        AxiosToastError(error);
      }
    };

    fetchNotes();
  }, [setFilteredNotes]); // Fetch notes when component mounts

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setFilteredNotes(allNotes); // Reset to all notes if search is cleared
      return;
    }

    const filteredNotes = allNotes.filter(
      (note) =>
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.tags?.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        ) ||
        moment(note.createdOn).format("YYYY-MM-DD").includes(searchQuery)
    );

    setFilteredNotes(filteredNotes);
  };

  const onClearSearch = () => {
    setSearchQuery("");
    setFilteredNotes(allNotes); // Reset notes when search is cleared
  };

  return (
    <div className="container">
      <div className="navContent">
        <img src={assets.noteIcon} alt="" />
        <h2>Note</h2>
      </div>

      <SearchBar
        value={searchQuery}
        onChange={({ target }) => setSearchQuery(target.value)}
        handleSearch={handleSearch}
        onClearSearch={onClearSearch}
      />

      <ProfileInfo />
    </div>
  );
};

export default NavBar;
