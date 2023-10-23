import "./singlePost.css";
import moment from "moment";
import { useState, useContext, useEffect } from "react";
import { Search as SearchBS } from "react-bootstrap-icons";
import axios from "axios";
import { GlobalContext } from "../../context/context";
import { useParams, useNavigate } from "react-router-dom";
import { Post } from "../post/post";

const SinglePost = () => {
  let { state, dispatch } = useContext(GlobalContext);
  const [post, setPost] = useState();
  const navigate = useNavigate()

  const postId = useParams();

  useEffect(() => {
    seePost(postId.postId);
  }, [postId]);

  const seePost = async (postId) => {
    try {
      const response = await axios.get(`/api/v1/post/${postId}`);
      const singlePostData = response.data;
      setPost(singlePostData);
    } catch (error) {
      console.error("Error fetching single post:", error);
    }
  };

  const seeLikedUsers = async (postId) => {

    navigate(`/likes/post/${postId}`)

  };

  return (
    <div className="singlePostCont">
      {post ? ( // Check if post is defined
        <>
          <Post
            key={post._id}
            title={post.title}
            text={post.text}
            time={post.time}
            postId={post._id}
            userId={post.userId}
            likedBy={post.likes}
          />
          <p
            onClick={() => {
              seeLikedUsers(post._id);
            }}
            className="seeWhoLiked"
          >
            See Who Liked...
          </p>
        </>
      ) : (
        <span class="loader"></span>
      )}
      <div className="CommentSection">
        Comments section is under construction
      </div>
    </div>
  );
};

export default SinglePost;
