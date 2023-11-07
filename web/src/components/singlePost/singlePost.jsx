import "./singlePost.css";
import moment from "moment";
import { useState, useContext, useEffect, useRef } from "react";
import { Search as SearchBS } from "react-bootstrap-icons";
import axios from "axios";
import { GlobalContext } from "../../context/context";
import { useParams, useNavigate } from "react-router-dom";
import { Post } from "../post/post";
import Swal from "sweetalert2"
import SingleComment from "../singleComment/SingleComment"

const SinglePost = () => {
  let { state, dispatch } = useContext(GlobalContext);
  const [post, setPost] = useState();
  const [comments, setComments] = useState()
  const navigate = useNavigate()

  const commentRef = useRef()

  const postId = useParams();

  useEffect(() => {

    seePost(postId.postId);
    getComments(postId.postId)
    return () => {
      // cleanup function
    };

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

  const deletePost = (postId) => {
    Swal.fire({
      title: 'Delete Post',
      text: 'Are you sure you want to delete this post?',
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
          const response = await axios.delete(`/api/v1/post/${postId}`);
          // console.log(response.data);
          Swal.fire({
            icon: 'success',
            title: 'Post Deleted',
            timer: 1000,
            showCancelButton: false,
            showConfirmButton: false
          });
          navigate("/")
        } catch (error) {
          console.log(error.data);
          Swal.fire({
            icon: 'error',
            title: 'Failed to delete post',
            text: error.data,
            showConfirmButton: false
          });
        }
      }
    });
  }

  function editPost(postId) {
    axios.get(`/api/v1/post/${postId}`)
      .then(response => {
        const post = response.data;

        Swal.fire({
          title: 'Edit Post',
          html: `
            <textarea id="editText" class="swal2-input text" placeholder="Post Text" required>${post.text}</textarea>
          `,
          showCancelButton: true,
          cancelButtonText: 'Cancel',
          confirmButtonText: 'Update',
          showConfirmButton: true,
          confirmButtonColor: "#284352",
          showCancelButton: true,
          cancelButtonColor: "#284352",
          showLoaderOnConfirm: true,
          preConfirm: () => {

            const editedText = document.getElementById('editText').value;

            if (!editedText.trim()) {
              Swal.showValidationMessage('Title and text are required');
              return false;
            }

            return axios.put(`/api/v1/post/${postId}`, {
              text: editedText
            })
              .then(response => {
                // console.log(response.data);
                Swal.fire({
                  icon: 'success',
                  title: 'Post Updated',
                  timer: 1000,
                  showConfirmButton: false
                });
                seePost(postId)
              })
              .catch(error => {
                // console.log(error.response.data);
                Swal.fire({
                  icon: 'error',
                  title: 'Failed to update post',
                  text: error.response.data,
                  showConfirmButton: false
                });
              });
          }
        });
      })
      .catch(error => {
        // console.log(error.response.data);
        Swal.fire({
          icon: 'error',
          title: 'Failed to fetch post',
          text: error.response.data,
          showConfirmButton: false
        });
      });
  }

  // comment

  const doComment = (event) => {

    event.preventDefault();

    let formData = new FormData();

    const userId = `${state.user.userId}`;

    formData.append("userId", userId);
    formData.append("userImage", state.user.profileImage);
    formData.append("userName", `${state.user.firstName} ${state.user.lastName}`);
    formData.append("postId", postId.postId);
    formData.append("comment", commentRef.current.value);

    axios
      .post(`/api/v1/comment`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then(function (response) {
        // console.log(response.data);
        Swal.fire({
          icon: "success",
          title: "Comment Added",
          timer: 1000,
          showConfirmButton: false,
        });
        getComments(postId.postId)
      })
      .catch(function (error) {
        console.log(error)
      });

    event.target.reset()
  };

  const getComments = async (postId) => {
    try {
      const response = await axios.get(`/api/v1/comments/${postId}`);
      const comments = response.data;
      console.log(comments);
      setComments(comments)
    } catch (error) {
      console.error('An error occurred while fetching comments:', error);
    }
  };

  return (
    <div className="singlePostCont">
      <div className="backArrow">
        <h2 className="bi bi-arrow-left" onClick={() => { window.history.back() }}></h2>
      </div>
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
            edit={editPost}
            del={deletePost}
            image={post.image}
            userImage={post.userImage}
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
      <div className="commentSection">
        <form className="commentForm" onSubmit={(event) => { doComment(event) }} >
          <textarea className="commentFormText" placeholder="Enter a comment" ref={commentRef}></textarea>
          <button className="commentButton" type="submit">Post</button>
        </form>
      </div>
    </div>
  );
};

export default SinglePost;
