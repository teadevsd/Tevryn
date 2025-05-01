import React from "react";
import { Outlet } from "react-router-dom";
import NavBar from "../../components/NavBar/NavBar";
import SideBar from "../../components/SideBar/SideBar";
import "./ConferenceLayout.css";

const ConferenceLayout = () => {
  return (
    <div className="conferenceWrapper">
      <NavBar />
      <div className="conferenceContent">
        <SideBar />
        <div className="pageContent">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
export default ConferenceLayout;
