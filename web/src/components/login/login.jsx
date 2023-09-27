import React, { useState, useRef } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import '../signup/signup.css';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
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
      const response = await axios.post(`/api/v1/login`, {
        email: email,
        password: passwordRef.current.value,
      });

      console.log("login successfully");
      setValidationMessage('');
      console.log(response.data);

      Swal.fire({
        icon: 'success',
        title: 'Login Successful',
        timer: 1000,
        showConfirmButton: false,
      });

      navigate('/');
      // history.push("/"); // Redirect to the homepage after successful login
    } catch (error) {
      console.log("error");
      console.error(error.data);

      Swal.fire({
        icon: 'error',
        title: 'Error in logging in',
        text: "Please enter the correct email or password",
        timer: 2500,
        showConfirmButton: false,
      });
    }
  };

  return (
    <form className="login c jcc ais login-signup" onSubmit={login}>
      <div>
        <h2 className="center">Welcome Back</h2>
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
  );
};

export default Login;