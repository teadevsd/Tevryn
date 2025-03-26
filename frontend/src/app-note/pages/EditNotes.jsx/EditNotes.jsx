import React, { useState, useEffect } from "react";
import "./EditNotes.css";
import TagInput from "../../components/Cards/TagInput/TagInput";
import { MdClose } from "react-icons/md";
import AxiosToastError from "../../../lib/AxiosToastError";
import Axios from "../../../lib/Axios";
import { summaryAPI } from "../../../common/summaryAPI";
import { toast } from "react-toastify";

const EditNotes = ({ noteData, type, setAllNotes, onClose }) => {
  // ✅ Initialize state with noteData or empty values
  const [title, setTitle] = useState(noteData?.title || "");
  const [content, setContent] = useState(noteData?.content || "");
  const [tags, setTags] = useState(noteData?.tags || []);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [error, setError] = useState(null);  

  // ✅ Update state when noteData changes
  useEffect(() => {
    if (noteData) {
      setTitle(noteData.title || "");
      setContent(noteData.content || "");
      setTags(noteData.tags || []);
    }
  }, [noteData]);

  const editNote = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        toast.error("Unauthorized: Please log in again");
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await Axios.put(
        `${summaryAPI.editNote.url}${noteData._id}`, // ✅ Fixed URL structure
        { title, content, tags },
        config
      );

      if (response.data.success) {
        setAllNotes((prevNotes) =>
          prevNotes.map((note) =>
            note._id === noteData._id ? response.data.data : note
          )
        );
        onClose();
        toast.success("Note updated successfully!");
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  const handleAddNote = () => {
    if (!title) {
      setError("Title is required");
      return;
    }
    if (!content) {
      setError("Content is required");
      return;
    }

    setError("");

    if (type === "add") {
      addNewNote(); // ✅ Call the correct function
    } else {
      editNote();
    }
  };

  const deleteNote = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        toast.error("Unauthorized: Please log in again");
        return;
      }

      const response = await Axios.delete(`${summaryAPI.deleteNote.url}${noteData._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setAllNotes((prevNotes) => prevNotes.filter((note) => note._id !== noteData._id));
        toast.success("Note deleted successfully!");
        onClose();
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  return (
    <div className="editNoteContainer">
      <button className="closeButton" onClick={onClose} type="button">
        <MdClose />
      </button>

      <h2>{type === "edit" ? "Edit Note" : "Add Note"}</h2>

      <div className="inputGroup">
        <label className="inputLabel">TITLE</label>
        <input
          type="text"
          placeholder="Go to Gym at 5"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="inputGroup">
        <label className="inputLabel">CONTENT</label>
        <textarea
          placeholder="Enter note details..."
          rows={6}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>

      <div className="inputGroup">
        <label className="inputLabel">TAGS</label>
        <TagInput tags={tags} setTags={setTags} />
      </div>

      {error && <p className="error">{error}</p>}

      <div className="modalButton">
        <button className="saveButton" onClick={handleAddNote}>
          {type === "edit" ? "Save Changes" : "Add Note"}
        </button>
        {type === "edit" && (
          <button className="deleteButton" onClick={() => setShowDeleteModal(true)}>
            Delete Note
          </button>
        )}
      </div>

      {/* ✅ Fixing showDeleteModal */}
      {showDeleteModal && (
        <div className="modal">
          <div className="modalContent">
            <p>Are you sure you want to delete this note?</p>
            <button className="confirmDelete" onClick={deleteNote}>
              Yes, Delete
            </button>
            <button className="cancelDelete" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditNotes;
