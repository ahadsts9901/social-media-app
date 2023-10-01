import React
  , { useState, useRef }
  from 'react';
import axios from 'axios';
// import Swal from 'sweetalert2';
import './search.css';
import '../main.css'
// import { Link, useNavigate } from 'react-router-dom';
// import logo from "../assets/logoDark.png"

const Search = () => {

  const [posts, setPosts] = useState([]);
  const searchInputRef = useRef(null)

  const search = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`/api/v1/search?q=${searchInputRef.current.value}`);
      console.log(response.data);

      setPosts([...response.data]);
    } catch (error) {
      console.log(error.data);
    }
    e.target.reset()
  };

  return (
    <form className='search postForm' onSubmit={search}>
      <input required type="search" placeholder="Search Here..." className="searchInput" ref={searchInputRef} />
      <button type="submit" className="postButton searchButton">
        Search
      </button>
    </form>
  )
};

export default Search;