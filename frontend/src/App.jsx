import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import { useContext } from "react";

import Login from "./chat/pages/login/Login";
import Chat from "./chat/pages/chat/Chat";
import ProfileUpdate from "./chat/pages/ProfileUpdate/ProfileUpdate";
import { ToastContainer } from "react-toastify";
import { AppContext } from "./chat/context/AppContext";
import AddFriend from "./chat/components/ChatBox/AddFriend/AddFriend";
import Home from "./chat/pages/Home/home";

function ProtectedRoute({ element }) {
  const { userData } = useContext(AppContext);
  const location = useLocation();
  
  const storedUser = localStorage.getItem("user");

  if (!userData && !storedUser) {
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
      </Routes>
      <ToastContainer />
    </>
  );
}

export default App;
