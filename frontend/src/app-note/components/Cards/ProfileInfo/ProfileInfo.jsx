import React, { useContext } from "react";
import "./ProfileInfo.css";
import { getInitials } from "../../../../lib/validate";
import { AppContext } from "../../../../context/AppContext";

const ProfileInfo = () => {
  const { logout, userData } = useContext(AppContext);


  return (
    <div className="profileCont">
      <div className="proContent">{getInitials(userData?.username)}</div>

      <div className="logAccount">
        <p>{userData?.username || "Guest"}</p>
        <button className="newB" onClick={logout}>Logout</button>
      </div>
    </div>
  );
};

export default ProfileInfo;
