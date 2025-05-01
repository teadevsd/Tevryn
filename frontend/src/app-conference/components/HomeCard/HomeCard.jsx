import React from 'react';
import './HomeCard.css';

const HomeCard = ({ img, title, description, color, onClick }) => {
  return (
    <div className="newMeeting" onClick={onClick} style={{ backgroundColor: color }}>
      <div className="newMeetingCont">
        <img src={img} alt={title} width={16} height={16} />
      </div>
      <div className="meetCont">
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
    </div>
  );
};

export default HomeCard;
