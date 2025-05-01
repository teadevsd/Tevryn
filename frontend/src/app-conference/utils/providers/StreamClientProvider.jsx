import React from "react";
import { StreamCall, StreamVideo } from "@stream-io/video-react-sdk";

export const VideoCall = ({ client, call }) => {
  if (!client || !call) return <p>Loading video call...</p>;

  return (
    <StreamVideo client={client}>
      <StreamCall call={call}>
        <h2>Live Meeting</h2>
        {/* You can add additional UI controls here */}
      </StreamCall>
    </StreamVideo>
  );
};
