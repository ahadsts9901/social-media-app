import React from "react"; // , { useState, useRef }
// import axios from 'axios';
// import Swal from 'sweetalert2';
import "./games.css";
import "../main.css";
// import { Link, useNavigate } from 'react-router-dom';
// import logo from "../assets/logoDark.png"

import { baseUrl } from "../../core.mjs";

const Games = () => {
  return (
    <div className="test">
      {/* <h2>Games</h2> */}
      {/* <h2>Under Construction</h2> */}
      <iframe
        src="https://ahadsts9901.github.io/sma-games/"
        className="gameWeb"
        frameborder="0"
      ></iframe>
    </div>
  );
};

export default Games;
