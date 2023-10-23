import "./postLikes.css";
import moment from "moment";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { GlobalContext } from "../../context/context";
import { useNavigate, useParams } from "react-router-dom";

const PostLikes = (props) => {
  let { state, dispatch } = useContext(GlobalContext);

  const navigate = useNavigate();
  const postId = useParams();
  postId = postId.postId;
  console.log(postId);

  const getProfile = async (userId) => {
    navigate(`/profile/${userId}`);
  };

  return <></>;
};

export default PostLikes;
