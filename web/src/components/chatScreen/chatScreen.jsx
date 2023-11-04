import React, { useEffect, useState, useRef, useContext } from "react";
import "./chatScreen.css";
import { ArrowLeft, PlusLg, ThreeDotsVertical } from "react-bootstrap-icons";
import { IoMdSend } from "react-icons/io";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import PrimaryChat from "../chatBaloons/primaryChat/primaryChat";
import SecondaryChat from "../chatBaloons/secondaryChat/secondaryChat";

import { GlobalContext } from "../../context/context";

const ChatScreen = () => {
  let { state, dispatch } = useContext(GlobalContext);
  const { userId } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState();
  const [messages, setMessages] = useState();

  useEffect(() => {
    getProfile(userId);
    getMessages(userId)
  }, [userId]);

  const getProfile = async (userId) => {
    try {
      const response = await axios.get(`/api/v1/profile/${userId}`);
      setProfile(response.data.data);
    } catch (error) {
      console.log(error.response.data);
      setProfile("noUser");
    }
  };

  const chatText = useRef();

  const chatSubmit = async (event) => {
    event.preventDefault();

    try {

      const response = await axios.post(`/api/v1/message`,{
        to_id : userId,
        toName: `${profile.firstName} ${profile.lastName}`,
        chatMessage: chatText.current.value
      });

      // console.log(response.data);

      Swal.fire({
        icon: "success",
        title: "Message Sent",
        timer: 1000,
        showConfirmButton: false,
      });

      chatText.current.value = ''; // Clear chat input field
    } catch (error) {
      console.log(error.response.data); // Use error.response.data to access the response data
    }
  };

  const getMessages = async() => {
    try {
      const response = await axios.get(`/api/v1/messages/${userId}`);
      // console.log(response.data);
      setMessages([...response.data]);
  } catch (error) {
      console.log(error);
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
              src={profile.profileImage}
              alt="image"
            />
          ) : null}
          {profile ? (
            <b onClick={() => navigate(`/profile/${userId}`)}>
              {`${profile.firstName} ${profile.lastName}`}
            </b>
          ) : null}
        </div>
        <div className="headSect">
          <b className="lastSeen">9:30 AM</b>
          <ThreeDotsVertical />
        </div>
      </header>

      <div className="messagesCont">
            {
              !messages ? <span id="loader"></span> : 
              messages.map((message, index)=>(
                message.from_id === state.user.userId ? 
                <PrimaryChat message={message.message} time={message.time} />:
                <SecondaryChat message={message.message} time={message.time}/>
              ))
            }
      </div>

      <div style={{ padding: "1.5em" }}></div>

      <form onSubmit={chatSubmit} id="send">
        <input hidden type="file" id="chatFile" />
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
