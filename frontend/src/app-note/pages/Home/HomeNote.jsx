import React, { useEffect, useState } from "react";
import NoteCard from "../../components/Cards/NoteCard/NoteCard";
import NavBar from "../../components/Navbar/NavBar";
import "./HomeNote.css";
import { MdAdd } from "react-icons/md";
import EditNotes from "../EditNotes.jsx/EditNotes";
import Modal from "react-modal";
import AxiosToastError from "../../../lib/AxiosToastError";
import Axios from "../../../lib/Axios";
import { summaryAPI } from "../../../common/summaryAPI";
import moment from "moment";

const HomeNote = () => {
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  const [allNotes, setAllNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      console.warn("No access token found! Redirecting to login...");
      return;
    }

    const getAllNotes = async () => {
      try {
        console.log("Fetching all notes...");
        const response = await Axios.get(summaryAPI.getAllNotes.url, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        console.log("Response from Notes API:", response.data);

        if (response.data.success && response.data.data) {
          setAllNotes(response.data.data);
          setFilteredNotes(response.data.data); // Default: show all notes
        } else {
          console.error("Notes not found in API response:", response.data);
        }
      } catch (error) {
        console.error("Error fetching notes:", error);
        AxiosToastError(error);
      }
    };

    getAllNotes();
  }, []);

  const handlePinNote = async (noteId, currentPinnedState) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        console.error("Access token not found!");
        return;
      }

      const response = await Axios.put(
        `${summaryAPI.updateNote.url}${noteId}`,
        { isPinned: !currentPinnedState },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        setAllNotes((prevNotes) =>
          prevNotes.map((note) =>
            note._id === noteId ? { ...note, isPinned: !currentPinnedState } : note
          )
        );
      }
    } catch (error) {
      console.error("Error updating pin status:", error.response?.data || error);
      AxiosToastError(error);
    }
  };

  const handleEditNote = (note) => {
    setOpenAddEditModal({
      isShown: true,
      type: "edit",
      data: note,
    });
  };

  const handleDeleteNote = async (noteId) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        console.error("Access token not found!");
        return;
      }

      const response = await Axios.delete(`${summaryAPI.deleteNote.url}${noteId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (response.data.success) {
        setAllNotes((prevNotes) => prevNotes.filter((note) => note._id !== noteId));
        setFilteredNotes((prevNotes) => prevNotes.filter((note) => note._id !== noteId));
      }
    } catch (error) {
      console.error("Error deleting note:", error.response?.data || error);
      AxiosToastError(error);
    }
  };

  return (
    <>
      <NavBar setFilteredNotes={setFilteredNotes} />

      <div className="noteWrapper">
        <div className="noteGrid">
          {filteredNotes.length > 0 ? (
            filteredNotes.map((note) => (
              <NoteCard
                key={note._id}
                title={note.title}
                date={moment(note.createdOn).format("YYYY-MM-DD")}
                content={note.content}
                tags={note.tags || ""}
                isPinned={note.isPinned || false}
                onEdit={() => handleEditNote(note)}
                onDelete={() => handleDeleteNote(note._id)}
                onPinNote={() => handlePinNote(note._id, note.isPinned)}
              />
            ))
          ) : (
            <p className="noResults">No results found.</p>
          )}
        </div>

        {/* Floating Add Note Button */}
        <button
          className="addNote"
          onClick={() =>
            setOpenAddEditModal({
              isShown: true,
              type: "add",
              data: null,
            })
          }
        >
          <MdAdd />
        </button>

        {/* Modal */}
        <Modal
          isOpen={openAddEditModal.isShown}
          onRequestClose={() => setOpenAddEditModal({ isShown: false, type: "add", data: null })}
          style={{
            overlay: { backgroundColor: "rgba(0, 0, 0, 0.6)" },
            content: {
              inset: "unset",
              background: "transparent",
              border: "none",
              padding: "0",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
              width: "100vw",
            },
          }}
          contentLabel="Edit Note Modal"
        >
          {openAddEditModal.isShown && (
            <EditNotes
              type={openAddEditModal.type}
              noteData={openAddEditModal.data}
              onClose={() => setOpenAddEditModal({ isShown: false, type: "add", data: null })}
              setAllNotes={setAllNotes}
            />
          )}
        </Modal>
      </div>
    </>
  );
};

export default HomeNote;
