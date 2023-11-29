import "./commentLikes.css";
import moment from "moment";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { GlobalContext } from "../../context/context";
import { useNavigate, useParams } from "react-router-dom";
import LikeUsers from "../likeUsers/likeUsers";

import { baseUrl } from '../../core.mjs';
 
const CommentLikes = (props) => {
  let { state, dispatch } = useContext(GlobalContext);
  const [likeUsers, setLikeUsers] = useState()

  const navigate = useNavigate();
  let params = useParams();
  let commentId = params.commentId

  useEffect(()=>{ 
    
    getlikedUsers(params.commentId) 
  
    return () => {
      // cleanup function
    };

  },[commentId])

  const getlikedUsers = async(commentId) => {
    try {
      const response = await axios.get(`${baseUrl}/api/v1/likes/comment/${commentId}`);
      const singlePostLikes = response.data;
      setLikeUsers(singlePostLikes);
    } catch (error) {
      console.error("Error fetching single post:", error);
    }
  }

  const getProfile = async (userId) => {
    navigate(`/profile/${userId}`);
  };

  return(
    <div className="likeUserContainer">
      <div className="backArrow">
      <h2 className="bi bi-arrow-left pointer" onClick={()=>{ window.history.back() }}></h2>
      </div>
      <h2>{!likeUsers ? "No Likes" : (likeUsers.length != 1 ? ( likeUsers.length + " Likes") : (likeUsers.length + " Like") )} </h2>
      <div className="likesList">
      {!likeUsers ? <span className="loader"></span> : 
      likeUsers.map((user, index) => (
          <LikeUsers getUser={getProfile} profileImage={user.profileImage} firstName={user.firstName} lastName={user.lastName} userId={user.userId} />
        ))}
      </div>
    </div>
  );
};

export default CommentLikes;