import React from "react";
import "./HomeConference.css";
import AppList from "../../components/AppList/AppList";


const HomeConference = () => {
  const now = new Date();
  const time = now.toLocaleTimeString('en-US', {
    hour: "2-digit", minute: "2-digit"  
  });
  const date = (new Intl.DateTimeFormat('en-US', {
    dateStyle: "full"
  })).format(now);
  return (
    <div className="homeConferenceContent">
        <div className="homebBanner">
          <img src="/images/heroBackground.png" alt="Hero Background" />

          <div className="homeContent">
            <h2>Upcoming Meeting at: 12:30 PM</h2>
          </div>

          <div className="realTime">
            <h1>{time}</h1>
            <p>{date}</p>
          </div>

          <AppList/>
        </div>

        

    </div>
  );
};

export default HomeConference;
