import React, { useEffect, useState } from "react";
import "./chatScreen.css";
import { ArrowLeft, PlusLg, ThreeDotsVertical } from "react-bootstrap-icons";
import { IoMdSend } from "react-icons/io";
import { useParams } from "react-router-dom";
import axios from "axios";
// import UserMessages from '../userMessages/UserMessages'
// import OthersMessages from '../othersMessages/OthersMessages'

const ChatScreen = () => {
  const { userId } = useParams();

  const [profile, setProfile] = useState();

  useEffect(() => {
    getProfile(userId);
  }, [userId]);

  const getProfile = async (userId) => {
    try {
      const response = await axios.get(`/api/v1/profile/${userId}`);
      setProfile(response.data.data);
    } catch (error) {
      console.log(error.data);
      setProfile("noUser");
    }
  };

  return (
    <div className="chat">
      <header>
        <div className="headSect">
          <ArrowLeft
            onClick={() => {
              window.history.back();
            }}
          />
          {profile ? (
            <img
              className="chatScreenImg"
              src={
                profile.profileImage ||
                `https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png`
              }
              alt="image"
            />
          ) : null}
          {profile ? <b>{`${profile.firstName} ${profile.lastName}`}</b> : null}
        </div>
        <div className="headSect">
          <b className="lastSeen">9:30 AM</b>
          <ThreeDotsVertical />
        </div>
      </header>

      <div className="messagesCont">
        {/* <UserMessages/>
      <OthersMessages/>
      <UserMessages/>
      <OthersMessages/> */}
      </div>

      <div style={{ padding: "5em" }}></div>

      <form action="" id="send">
        <input hidden type="file" id="chatFile" />
        <label htmlFor="chatFile">
          <PlusLg className="ChatInputIcon" />
        </label>
        <input type="text" placeholder="Type a message" className="chatInput" />
        <button className="chatButton" type="submit">
          <IoMdSend style={{ fontSize: "1.5em" }} />
        </button>
      </form>
    </div>
  );
};

export default ChatScreen;
