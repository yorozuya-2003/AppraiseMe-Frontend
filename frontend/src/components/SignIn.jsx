import { React, useState, useEffect } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "./ApiConfig";
import "../styles/signin.css";

function SignIn() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    }
  }, []);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };


  const [loginError, setLoginError] = useState("");
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}/user_login/`, {
        email,
        password,
      });
      if (response.status === 200) {
        const loggedInUser = response.data;
        setLoginError("");
        console.log("Login successful");
        localStorage.setItem("user", JSON.stringify(loggedInUser));
        navigate("/home");
      }
    } catch (error) {
      console.error("Error:", error);
      const response = error.response;
      if (response.status === 401) {
        setLoginError(
          "Invalid credentials. Please check your email and password."
        );
      } else if (response.status === 400) {
        setLoginError("Email is not registered.");
      }
    }
  };

  return (
    <>
      {user ? (
        <Navigate to="/home" />
      ) : (
        <div className="signin-div">
          <h1 className="heading">🚀 Sign in to continue</h1>
          <form onSubmit={handleLoginSubmit} className="signup-form">
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <div 
              style={{
                display: 'flex',
                width: '320px',
                height: '56px',
                padding: '16px',
                borderRadius: '16px',
                border: '1px solid #d9d9d9',
                borderColor: '#d9d9d9'
              }}
            >
              <input
                style={{ border: 'none',width:'100%',outline: 'none' }}
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <img
                style={{ width: '25px', height: '25px', color: 'white', cursor: 'pointer',display:'flex' }}
                src={`${API_BASE_URL}/media/eye_icon/${showPassword ? 'open eye.png' : 'close eye.png'}`}
                alt=""
                onClick={togglePasswordVisibility}
              />
            </div>
            <button type="submit">Login</button>
            <p></p>
            <button id="linkedin" className="useaccount">
              <img src="linkedin-logo.png" alt="" /> Continue with LinkedIn
            </button>
            <button id="google" className="useaccount">
              <img src="google-logo.png" alt="" /> Continue with Google
            </button>
            <h4 id="dont-have-an-account">
              Don't have an account ? <Link to="/signup">Sign up</Link>
            </h4>
          </form>
          {loginError && <p className="error-message">{loginError}</p>}
        </div>
      )}
      ;
    </>
  );
}

export default SignIn;
