import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './profile.css';
import { UserPost, NoPost } from '../userPost/userPost';
import { useNavigate } from 'react-router-dom';
import { GlobalContext } from '../../context/context';

const Profile = () => {

  let { state, dispatch } = useContext(GlobalContext);

  const [userPosts, setUserPosts] = useState([]);
  const navigate = useNavigate()

  useEffect(() => {
    renderUserPost();
  }, []);

  const createPost = (event) => {
    event.preventDefault();

    const userLogEmail = `${state.user.email}`
    console.log(userLogEmail)
    const postTitle = `${state.user.firstName} ${state.user.lastName}`;
    const postText = document.querySelector("#text");
    console.log(postTitle)

    axios
      .post(`/api/v1/post`, {
        title: postTitle,
        text: postText.value,
        email: userLogEmail,
      })
      .then(function (response) {
        // console.log(response.data);
        Swal.fire({
          icon: 'success',
          title: 'Post Added',
          timer: 1000,
          showConfirmButton: false,
        });
        // renderUserPost();
      })
      .catch(function (error) {
        console.log(error);
        document.querySelector(".result").innerHTML = "Error in post submission";
      });

    postText.value = "";
  };
  let userEmail = state.user.email

  const renderUserPost = () => {
    axios.get(`/api/v1/posts/${userEmail}`)
      .then((response) => {
        // Handle the data returned from the API
        const userAllPosts = response.data;
        setUserPosts(userAllPosts)
        // This will contain the posts for the specified email
      })
      .catch((error) => {
        // Handle any errors that occurred during the request
        console.error('Axios error:', error);
      });
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
          renderUserPost();
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
                renderUserPost();
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


  const logOut = (event) => {
    event.preventDefault();
    axios.post(`/api/v1/logout`, {})
      .then(function (response) {
        Swal.fire({
          icon: 'success',
          title: 'Logout Successfully',
          timer: 1000,
          showConfirmButton: false
        });

        dispatch({
          type: "USER_LOGOUT"
        });

        window.location.pathname = "/login"

      })
      .catch(function (error) {
        Swal.fire({
          icon: 'error',
          title: "Can't logout",
          timer: 1000,
          showConfirmButton: false
        });
      });
  }

  return (
    <div className='posts'>
      <div className="space-around row">
        <div className='head'>
          <h1 className="green">Profile</h1>
          <button className='postButton' onClick={logOut}>Log Out</button>
        </div>
      </div>

      <div className="profile">
        <img className='profileIMG' src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" />
        <h2 className='profileName'>{state.user.firstName} {state.user.lastName}</h2>
      </div>

      <form onSubmit={createPost} className='postForm'>
        <h2 className='createNewPost'>Share a thought!</h2>
        <textarea required id="text" placeholder="Enter Text" className="postInput textarea"></textarea>
        <button type="submit" className="postButton">
          Post
        </button>
      </form>

      <div className="result">
        {userPosts.length === 0 ? (
          <NoPost />
        ) : (
          userPosts.map((post, index) => (
            <UserPost key={index} title={post.title} text={post.text} time={post.time} postId={post._id} del={deletePost} edit={editPost} />
          ))
        )}
      </div>
    </div>
  );
};

export default Profile