import React, { useEffect, useState, useRef, useContext } from "react";
import "./chatScreen.css";
import { ArrowLeft, PlusLg, ThreeDotsVertical, TrashFill } from "react-bootstrap-icons";
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
  const [showMenu, setShowMenu] = useState(false)

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

      const response = await axios.post(`/api/v1/message`, {
        to_id: userId,
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
      getMessages()

      chatText.current.value = ''; // Clear chat input field
    } catch (error) {
      console.log(error.response.data); // Use error.response.data to access the response data
    }
  };

  const getMessages = async () => {
    try {
      const response = await axios.get(`/api/v1/messages/${userId}`);
      // console.log(response.data);
      setMessages([...response.data]);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteMessage = (messageId) => {
    Swal.fire({
      title: 'Delete Message',
      text: 'Delete for everyone ?',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Cancel',
      confirmButtonText: 'Delete',
      showConfirmButton: true,
      confirmButtonColor: "#284352",
      showCancelButton: true,
      cancelButtonColor: "#284352",
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        try {
          const response = await axios.delete(`/api/v1/message/${messageId}`);
          // console.log(response.data);
          Swal.fire({
            icon: 'success',
            title: 'Message Deleted',
            timer: 1000,
            showCancelButton: false,
            showConfirmButton: false
          });
          getMessages()
        } catch (error) {
          console.log(error.data);
          Swal.fire({
            icon: 'error',
            title: 'Failed to delete message',
            text: error.data,
            showConfirmButton: false
          });
        }
      }
    });
  }

  function editMessage(messageId, event) {
    let textToEdit = event.target.parentNode.parentNode.firstElementChild.textContent;

    Swal.fire({
      title: 'Edit message',
      html: `
        <textarea id="editMessage" class="swal2-input text" placeholder="Edit message" required>${textToEdit}</textarea>
      `,
      showCancelButton: true,
      cancelButtonText: 'Cancel',
      confirmButtonText: 'Update',
      showConfirmButton: true,
      confirmButtonColor: "#284352",
      showCancelButton: true,
      cancelButtonColor: "#284352",
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        const editedMessage = document.getElementById('editMessage').value;

        if (!editedMessage.trim()) {
          Swal.showValidationMessage('Message is required');
          return false;
        }

        try {
          const response = await axios.put(`/api/v1/message/${messageId}`, {
            message: editedMessage
          });

          if (response.status === 200) {
            Swal.fire({
              icon: 'success',
              title: 'Message Updated',
              timer: 1000,
              showConfirmButton: false
            });
            getMessages();
          } else {
            throw new Error('Failed to update message');
          }
        } catch (error) {
          console.error(error);
          Swal.fire({
            icon: 'error',
            title: 'Failed to update message',
            showConfirmButton: false
          });
        }
      }
    });
  }

  function clearChat(from_id, to_id) {
    Swal.fire({
      title: 'Clear chat ?',
      text: 'Do you want to clear chat ?',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Cancel',
      confirmButtonText: 'Delete',
      showConfirmButton: true,
      confirmButtonColor: "#284352",
      showCancelButton: true,
      cancelButtonColor: "#284352",
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        try {
          const response = await axios.delete(`/api/v1/messages/${from_id}/${to_id}`);
          // console.log(response.data);
          Swal.fire({
            icon: 'success',
            title: 'Chat cleared',
            timer: 1000,
            showCancelButton: false,
            showConfirmButton: false
          });
          setShowMenu(false)
        } catch (error) {
          console.log(error.data);
          Swal.fire({
            icon: 'error',
            title: 'Failed to delete message',
            text: error.data,
            showConfirmButton: false
          });
        }
      }
    });
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
          {/* <b className="lastSeen">9:30 AM</b> */}
          <ThreeDotsVertical onClick={() => { setShowMenu(!showMenu) }} />
          {
            !showMenu ? null :
              <div className="chatMenu">
                <p onClick={() => { clearChat(state.user.userId, userId) }} >Clear Chat</p>
              </div>
          }
        </div>
      </header>

      <div className="messagesCont">
        {
          !messages ? <span id="loader"></span> :
            messages.map((message, index) => (
              message.from_id === state.user.userId ?
                <PrimaryChat del={deleteMessage} edit={editMessage} message={message.message} time={message.time} from_id={message.from_id} _id={message._id} /> :
                <SecondaryChat message={message.message} time={message.time} from_id={message.from_id} _id={message._id} />
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
