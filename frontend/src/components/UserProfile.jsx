import { React, useState, useEffect } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import axios from "axios";
import API_URL from "./ApiConfig";
import Header from "./Header";
import "../styles/landing_page.css";

function UserProfile() {
  const { username } = useParams();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    axios
      .get(`${API_URL}/user/${username}/`)
      .then((response) => {
        setUserData(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [username]);

  if (!userData) {
    // return <Navigate to="/" />
    return <div>Loading...</div>;
  }

  const localStorageUser = JSON.parse(localStorage.getItem("user"));
  const isCurrentUserProfile = userData.username === localStorageUser.username;

  return (
    <>
      {isCurrentUserProfile ? (
        <Navigate to="/home" />
      ) : (
        <>
          <header>
            <Header></Header>
          </header>
          <div className="welcome-div">
            <h1>USERPAGE</h1>
            <p>
              {userData.username} {userData.email}
            </p>

            <Link to="/start">
              <button className="get-started-btn">Get Started</button>
            </Link>

            <p>Trusted by</p>

            <div>
              <img src="microsoft.png" alt="" />
              <img src="airbnb.png" alt="" />
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default UserProfile;
