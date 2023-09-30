import React, { useEffect, useState, useRef, useContext } from 'react';
import axios from 'axios';
// import Swal from 'sweetalert2';
import './home.css';
import { Post, NoPost } from '../post/post';
import { useNavigate } from 'react-router-dom';
import { GlobalContext } from '../../context/context';

const Home = () => {

  let { state, dispatch } = useContext(GlobalContext);

  const [posts, setPosts] = useState([]);
  const searchInputRef = useRef(null)
  const navigate = useNavigate()
  const me = ""

  useEffect(() => {
    renderPost();
  }, [me]);
  
  const renderPost = () => {
    axios
      .get(`/api/v1/posts`)
      .then(function (response) {
        let fetchedPosts = response.data;
        // console.log("fetched posts", fetchedPosts);
        setPosts(fetchedPosts);
      })
      .catch(function (error) {
        // console.log(error);
        let resStatus = error.response.request.status
        // console.log(resStatus)
        if (resStatus === 401) {
          // console.log("not authorized")
          navigate('/login');
        }
      });
  };

  return (
      <div className="result">
        {posts.length === 0 ? (
          <NoPost />
        ) : (
          posts.map((post, index) => (
            <Post key={index} title={post.title} text={post.text} time={post.time} postId={post._id} />
          ))
          )}
          {/* <Post key={123} title="HEllo this is my new post iam a web developer" 
          text="At the heart of Apple's success is its line of consumer electronics, most notably the iPhone. Introduced in 2007, the iPhone revolutionized the smartphone industry, setting new standards for user-friendly interfaces, build quality, and app ecosystems. The iPhone remains a flagship product, continually pushing the boundaries of technology with each iteration."
          time="2023-09-27T13:07:49.180+00:00" /> */}
      </div>
  );
};

export default Home