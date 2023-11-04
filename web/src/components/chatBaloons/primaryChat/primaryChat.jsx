import React from "react";
import "./primaryChat.css";
import { ChevronDown } from "react-bootstrap-icons";
import moment from "moment"

const PrimaryChat = (props) => {

    const time = moment(props.time).fromNow();

  return (

    <div className="message">
      <div className="userMessage">
        <p>
          {props.message}
        </p>
        <span className="messageDetails">
          <p id="time">{time}</p>
          <ChevronDown style={{marginTop:"0.3em"}}/>
        </span>
      </div>
      <div className="messageTail"></div>
    </div>
  );
};

export default PrimaryChat