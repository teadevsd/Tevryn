import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AppList.css";
import HomeCard from "../HomeCard/HomeCard";
import Modal from "../../utils/Modal/Modal";
import { VideoCall } from "../../utils/providers/StreamClientProvider"; // Renamed to VideoCall
import { AppContext } from "../../../context/AppContext";
import { StreamVideoClient } from "@stream-io/video-react-sdk";
import { toast } from "react-toastify";
import axios from "axios";

const AppList = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [meetingStarted, setMeetingStarted] = useState(false);
  const [callDetails, setCallDetails] = useState(null);
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { userData } = useContext(AppContext);

  const [values, setValues] = useState({
    dateTime: new Date(),
    description: "",
    link: "",
  });

  // Initialize the Stream video client on mount
// In your stream.jsx
useEffect(() => {
  if (!userData?._id) return;

  const initializeClient = async () => {
    try {
      const { data } = await axios.get("http://localhost:2323/api/v1/video/generate-token", {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
      });

      const client = new StreamVideoClient({
        apiKey: import.meta.env.VITE_STREAM_API_KEY,
        user: {
          id: userData._id,
          name: userData.username,
        },
        token: data.token,
        options: {
          // Add these for better WS connection
          browser: true,
          logLevel: 'debug',
          timeout: 10000,
        },
      });

      await client.connectUser(
        {
          id: userData._id,
          name: userData.username,
        },
        data.token
      );

      setClient(client);
    } catch (err) {
      console.error("Initialization error:", {
        error: err.response?.data || err.message,
        config: {
          apiKey: import.meta.env.VITE_STREAM_API_KEY,
          userId: userData._id
        }
      });
      toast.error("Video connection failed");
    }
  };

  initializeClient();

  return () => {
    if (client) client.disconnectUser();
  };
}, [userData?._id]);

  const startMeeting = async () => {
    if (loading || !client || !userData) {
      console.error("Client not ready or user data missing.");
      return;
    }

    try {
      const id = crypto.randomUUID(); // Generate unique meeting ID
      const call = client.call("default", id);
      if (!call) throw new Error("Failed to create call");

      await call.getOrCreate({
        data: {
          starts_at: new Date().toISOString(),
          custom: { description: values.description || "Instant Meeting" },
        },
      });

      setCallDetails(call);
      setMeetingStarted(true); // Show the call component
      toast.success("Meeting started successfully");
    } catch (error) {
      console.error("Error starting meeting:", error);
      toast.error("Failed to start meeting");
    }
  };

  return (
    <div className={`appListWrap ${modalOpen ? "blurBackground" : ""}`}>
      <HomeCard
        img="/icons/add-meeting.svg"
        title="New Meeting"
        description="Start an instant meeting"
        onClick={() => setModalOpen(true)}
        color="#ff6200"
      />
      <HomeCard
        img="/icons/join-meeting.svg"
        title="Join Meeting"
        description="Join meeting via invitation link"
        onClick={() => {}}
        color="#0E78F9"
      />
      <HomeCard
        img="/icons/schedule.svg"
        title="Schedule Meeting"
        description="Plan your meeting"
        onClick={() => {}}
        color="#830EF9"
      />
      <HomeCard
        img="/icons/recordings.svg"
        title="View Recordings"
        description="Handle your recordings"
        onClick={() => navigate("/conference/recordings")}
        color="#F9A90E"
      />

      <Modal
        isOpen={modalOpen}
        title="Start an Instant Meeting"
        onConfirm={startMeeting}
        onClose={() => setModalOpen(false)}
      />

      {meetingStarted && client && callDetails && (
        <VideoCall client={client} call={callDetails} />
      )}
    </div>
  );
};

export default AppList;
