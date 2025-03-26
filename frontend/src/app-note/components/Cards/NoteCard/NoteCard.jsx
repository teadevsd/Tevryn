import React, { useState } from "react";
import { MdOutlinePushPin, MdCreate, MdDelete } from "react-icons/md";
import "./NoteCard.css";
import moment from "moment";

const NoteCard = ({ title, date, content, tags, isPinned, onEdit, onDelete, onPinNote }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  return (
    <>
      <div className={`noteCard ${isPinned ? "pinned" : ""}`}>
        <div className="noteHeader">
          <h3>{title}</h3>
          <MdOutlinePushPin 
            className={`pinIcon ${isPinned ? "pinned" : ""}`} 
            onClick={onPinNote} 
          />
        </div>
        <span>{moment(date).format("Do MMM YYYY")}</span>
        <p className="noteContent">{content?.slice(0, 60)}...</p>

        <div className="noteFooter">
          <span className="noteTags">{tags.map((tag) => `#${tag}`).join(", ")}</span>
          <div className="noteActions">
            <MdCreate onClick={onEdit} />
            <MdDelete onClick={() => setShowDeleteModal(true)} />
          </div>
        </div>
      </div>

      {/* ✅ Move modal outside to make it cover the full screen */}
      {showDeleteModal && (
        <div className="modalOverlay">
          <div className="modalContent">
            <p>Are you sure you want to delete this note?</p>
            <button className="confirmDelete" onClick={() => { 
              onDelete(); 
              setShowDeleteModal(false); 
            }}>
              Yes, Delete
            </button>
            <button className="cancelDelete" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default NoteCard;
