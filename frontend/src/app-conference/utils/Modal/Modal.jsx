import React from "react";
import "./Modal.css";

const Modal = ({ isOpen, onClose, title, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="modalOverlay">
      <div className="modalContent">
        <h2>{title}</h2>
        <button className="startBtn" onClick={onConfirm}>Start Meeting</button>
        <button className="closeBtn" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default Modal;
