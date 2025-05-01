import Modal from "react-modal";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useContext } from "react";
import Login from "./chat/pages/login/Login";
import Chat from "./chat/pages/chat/Chat";
import ProfileUpdate from "./chat/pages/ProfileUpdate/ProfileUpdate";
import AddFriend from "./chat/components/ChatBox/AddFriend/AddFriend";
import Home from "./chat/pages/Home/home";
import HomeNote from "./app-note/pages/Home/HomeNote";
import HomeConference from "./app-conference/pages/HomeConference/HomeConference";
import Upcoming from "./app-conference/app/upcoming/Upcoming";
import Previous from "./app-conference/app/previous/Previous";
import Recordings from "./app-conference/app/recordings/Recordings";
import PersonalRoom from "./app-conference/app/personalRoom/PersonalRoom";
import ConferenceLayout from "./app-conference/utils/ConferenceLayout/ConferenceLayouts";

import { AppContext } from "./context/AppContext";
import ProtectedRoute from "./lib/ProtectedRoute";

Modal.setAppElement("#root");

function App() {
  const { loadingUserData } = useContext(AppContext);

  if (loadingUserData) {
    return <div>Loading app...</div>;
  }

  return (
    <>
      <Routes>
        {/* Public Pages */}
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Login />} />

        {/* Protected Routes */}
        <Route path="/chat" element={<ProtectedRoute element={<Chat />} />} />
        <Route path="/profile" element={<ProtectedRoute element={<ProfileUpdate />} />} />
        <Route path="/add-friend" element={<ProtectedRoute element={<AddFriend />} />} />
        <Route path="/note" element={<ProtectedRoute element={<HomeNote />} />} />

        {/* Conference App */}
        <Route path="/conference" element={<ConferenceLayout />}>
          <Route index element={<ProtectedRoute element={<HomeConference />} />} />
          <Route path="upcoming" element={<ProtectedRoute element={<Upcoming />} />} />
          <Route path="previous" element={<ProtectedRoute element={<Previous />} />} />
          <Route path="recordings" element={<ProtectedRoute element={<Recordings />} />} />
          <Route path="personal-room" element={<ProtectedRoute element={<PersonalRoom />} />} />
        </Route>
      </Routes>

      <ToastContainer />
    </>
  );
}

export default App;
