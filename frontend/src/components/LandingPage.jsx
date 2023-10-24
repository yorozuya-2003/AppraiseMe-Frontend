import React from "react";
import Header from "./Header";
import "../styles/landing_page.css";
import { Link } from "react-router-dom";

function LandingPage() {
  return (
    <div>
      <header>
        <Header></Header>
      </header>
      <div className="welcome-div">
        <h1>Welcome To AppraiseMe</h1>
        <h3>The easiest way to measure soft skills</h3>
        <Link to="/start">
          <button className="get-started-btn">Get Started</button>
        </Link>

        <p>Trusted by</p>

        <div>
          <img src="microsoft.png" alt="" />
          <img src="airbnb.png" alt="" />
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
