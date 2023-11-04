import React from "react";
import "./secondaryChat.css";
import { ChevronDown } from "react-bootstrap-icons";
import moment from "moment"

const SecondaryChat = (props) => {
    const time = moment(props.time).fromNow();
  return (
    <div className="mainMessage">
      <div className="otherMessageTail"></div>
      <div className="otherMessage">
        <p>
         {props.message}
        </p>
        <span className="otherDetails">
          <ChevronDown style={{marginTop:"0.3em"}}/>
          <p id="time">{time}</p>
        </span>
      </div>
    </div>
  );
};

export default SecondaryChat;