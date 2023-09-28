import React, {
  useState, useRef
  // , useContext 
} from 'react';
import axios from 'axios';
// import Swal from 'sweetalert2';
import '../signup/signup.css';
import { Link, useNavigate } from 'react-router-dom';
import logo from "../assets/logoDark.png"
// import { GlobalContext } from "../../context/context"

const Login = () => {

  // let { state, dispatch } = useContext(GlobalContext);

  const [email, setEmail] = useState('');
  const [validationMessage, setValidationMessage] = useState('');
  const [isShowPassword, setShowPassword] = useState(false);

  const passwordRef = useRef(null);
  // const history = useHistory();

  const navigate = useNavigate()

  // Handle form submission
  const login = async (event) => {
    event.preventDefault();

    if (!email.endsWith("@gmail.com")) {
      setValidationMessage("Invalid email address");
      return;
    }

    if (email.trim() === '' || passwordRef.current.value.trim() === '') {
      setValidationMessage("Please fill required fields");
      return;
    }

    try {
      await axios.post(`/api/v1/login`, {
        email: email,
        password: passwordRef.current.value,
      });
      console.log("login successfully");
      setValidationMessage('Login Successfull');
      navigate('/');
      // history.push("/"); // Redirect to the homepage after successful login
    } catch (error) {
      setValidationMessage('Email or Password incorrect');
      console.log("Email or Password incorrect");
      console.error(error.data);
    }
  };

  return (
    <div className="authContainer">
      <h3 className="desktopHeading center">Welcome<br />Back</h3>
      <div className='logoCont'>
        <img src={logo} className='logo' alt="logo" />
        <h1 className='line'><span className='black'>We</span><span> App</span></h1>
        <p>Make Your Own</p>
        <p className="leftLogo">
          Don't have an account ? {" "}
          <Link to="/signup" className="center">
            Signup
          </Link>
        </p>
      </div>
      <form className="login c jcc ais login-signup" onSubmit={login}>
        <div className='topHeading'>
          <h2 className="center mobileHeading">Welcome<br />Back</h2>
        </div>
        <input
          required
          id="email-login"
          type="email"
          className="input"
          placeholder="example@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className="r jcsb aic pass">
          <input
            ref={passwordRef}
            required
            id="password-login"
            type={isShowPassword ? "text" : "password"}
            className="input"
            placeholder="Password"
            minLength="4"
            maxLength="8"
          />
          <i
            className={`bi ${isShowPassword ? "bi-eye" : "bi-eye-slash"}`}
            onClick={() => setShowPassword(!isShowPassword)}
          ></i>
        </div>
        {/* <p className='forget'>Forgot Password</p> */}
        <p className="validationMessage">{validationMessage}</p>
        <button type="submit" className="button">
          Login
        </button>
        <div className='last'>
          <p className="center">
            Don't have an account ?
            <Link to="/signup" className="center">
              SignUp
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;