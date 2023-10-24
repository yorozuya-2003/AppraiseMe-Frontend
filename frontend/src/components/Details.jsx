import React from "react";
import { Link } from "react-router-dom";
import "../styles/details.css";

function Details() {
  return (
    <div className="details">
      <h1>
        {" "}
        <img src="" alt="" /> 👋🏾 Tell us a <br /> little about yourself
      </h1>
      <form className="details-form" action="">
        <div className="details-box">
          <div className="preferred-pronouns">
            <input type="text" placeholder="Preferred Pronouns" />
          </div>

          <div className="names">
            <input type="text" placeholder="First Name" />
            <input type="text" placeholder="Second Name" />
          </div>

          <div className="dob-gender">
            <input type="text" placeholder="Date of Birth" />
            <input type="text" placeholder="Gender" />
          </div>

          <div className="continue">
            <Link to="/employment">
              <button className="continue-btn" type="submit">
                Continue
              </button>
            </Link>
            <div className="faq-div">
              <h4>Have a question? See our FAQ </h4>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Details;
