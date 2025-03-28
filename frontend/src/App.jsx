import Modal from "react-modal"; // Import Modal

Modal.setAppElement("#root");

import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import Login from "./chat/pages/login/Login";
import Chat from "./chat/pages/chat/Chat";
import ProfileUpdate from "./chat/pages/ProfileUpdate/ProfileUpdate";
import { ToastContainer } from "react-toastify";
import AddFriend from "./chat/components/ChatBox/AddFriend/AddFriend";
import Home from "./chat/pages/Home/home";

import HomeNote from "./app-note/pages/Home/HomeNote";
import { AppContext } from "./context/AppContext";

function ProtectedRoute({ element }) {
  const { userData } = useContext(AppContext);
  const location = useLocation();
  const storedUser = localStorage.getItem("user");

  if (!userData && !storedUser) {
    localStorage.setItem("redirectPath", location.pathname); // Store the intended path
    return <Navigate to="/auth" replace />;
  }

  return element;
}





function App() {
  return (
    <>
      <Routes>
        {/* Public Pages */}
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Login />} />

        {/* Protected Pages */}
        <Route path="/chat" element={<ProtectedRoute element={<Chat />} />} />
        <Route path="/profile" element={<ProtectedRoute element={<ProfileUpdate />} />} />
        <Route path="/add-friend" element={<ProtectedRoute element={<AddFriend />} />} />

        {/* {NoteApp} */}
        <Route path="/note"  element={<HomeNote />}  />

      </Routes>
      <ToastContainer />
    </>
  );
}

export default App;
