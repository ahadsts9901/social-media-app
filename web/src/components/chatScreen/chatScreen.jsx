import React, { useEffect, useState, useRef } from "react";
import "./chatScreen.css";
import { ArrowLeft, PlusLg, ThreeDotsVertical } from "react-bootstrap-icons";
import { IoMdSend } from "react-icons/io";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom"
// import UserMessages from '../userMessages/UserMessages'
// import OthersMessages from '../othersMessages/OthersMessages'

const ChatScreen = () => {
  const { userId } = useParams();

  const navigate = useNavigate()

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

  const chatText = useRef()
  const chatImage = useRef()

  const chatSubmit = async (event) => {

    event.preventDefault()

    try {

      let formData = new FormData();

      formData.append("to_id", userId);
      formData.append("chatMessage", chatText.current.value);
      formData.append("chatImage", chatImage.current.files[0]);

      const response = await axios.post(
        `/api/v1/message`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' }
        })

      console.log(response.data);
      event.target.reset();
    } catch (error) {
      // handle error
      console.log(error?.data);
    }

  }

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
                profile.profileImage
              }
              alt="image"
            />
          ) : null}
          {profile ? <b onClick={() => { navigate(`/profile/${userId}`) }} >{`${profile.firstName} ${profile.lastName}`}</b> : null}
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

      <form onSubmit={(event) => { chatSubmit(event) }} id="send">
        <input hidden type="file" id="chatFile" ref={chatImage} />
        <label htmlFor="chatFile">
          <PlusLg />
        </label>
        <input type="text" placeholder="Type a message" className="chatInput" ref={chatText} />
        <button className="chatButton" type="submit">
          <IoMdSend style={{ fontSize: "1.5em" }} />
        </button>
      </form>
    </div>
  );
};

export default ChatScreen;
