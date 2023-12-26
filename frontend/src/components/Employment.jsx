import axios from "axios";
import React, { useState } from "react";
import "../styles/employment.css";
import { Link, useNavigate } from "react-router-dom";

function Employment() {
  const navigate = useNavigate();
  let loggedInUser = JSON.parse(localStorage.getItem("user"));
  let userEmail = loggedInUser.email;

  const [formData, setFormData] = useState({
    email: userEmail,
    title: "",
    emp_type: "Full-time",
    company: "",
    location: "",
    location_type: "On-site",
    currently_working: 1,
    start_time: "",
    end_time: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    // console.log(formData);
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isAnyFieldEmpty = Object.values(formData).some(
      (field) => field === ""
    );

    if (isAnyFieldEmpty) {
      const errorMessageElement = document.getElementById("error-message");
      errorMessageElement.innerText = "!All fields must be filled";
      errorMessageElement.style.color = "red";

      setTimeout(() => {
        errorMessageElement.innerText = "";
      }, 5000);

      console.error("Error: All fields must be filled");
      return;
    }

    try {
      console.log(formData);
      const response = await axios.post(
        `http://127.0.0.1:8000/api/addwork/`,
        formData
      );
      // .then(response => {
      console.log("Experience added successfully:", response.data);
      setFormData({
        email: userEmail,
        title: "",
        emp_type: "Full-time",
        company: "",
        location: "",
        location_type: "On-site",
        currently_working: 1,
        start_time: "",
        end_time: "",
      });
      navigate("/addexp");
      // })
      // .catch(error => {
      //     console.log('Error adding Work:', error);
      // })
    } catch (error) {
      console.error("Error Adding Details:", error);
    }
  };

  return (
    <div className="employment">
      <h1>
        {" "}
        <img src="" alt="" /> 👔 Add any previous <br /> employment history
      </h1>
      <div className="employment-box">
        <div className="employment-box-contents">
          <h4 id="work-experience">Work Experience</h4>
          <form onSubmit={handleSubmit} className="employment-form" action="">
            <div className="title">
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Title"
              />
            </div>

            <div className="emp_type">
              <select
                name="emp_type"
                value={formData.emp_type}
                onChange={handleChange}
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
              </select>
            </div>

            <div className="company">
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Company Name"
              />
            </div>

            <div className="location">
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Location"
              />
            </div>

            <div className="location_type">
              <select
                name="location_type"
                value={formData.location_type}
                onChange={handleChange}
              >
                <option value="On-site">On-Site</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Remote">Remote</option>
              </select>
            </div>

            {/* <div className="currently">
              <input type="radio" name="currently_working" value={formData.currently_working} onChange={handleChange}/>
              <label>I am currently working in this role</label>
            </div> */}

            <div>
              <label
                htmlFor=""
                style={{ marginRight: "20px", marginLeft: "5px" }}
              >
                Start Time
              </label>
              <input
                style={{
                  width: "240px",
                  height: "36px",
                  padding: "16px",
                  borderRadius: "16px",
                  border: "1px solid",
                  borderColor: "#d9d9d9",
                }}
                type="date"
                name="start_time"
                value={formData.start_time}
                onChange={handleChange}
              />
            </div>

            <div>
              <label
                htmlFor=""
                style={{ marginRight: "20px", marginLeft: "5px" }}
              >
                End Time
              </label>
              <input
                style={{
                  width: "240px",
                  height: "36px",
                  padding: "16px",
                  borderRadius: "16px",
                  border: "1px solid",
                  borderColor: "#d9d9d9",
                }}
                type="date"
                name="end_time"
                value={formData.end_time}
                onChange={handleChange}
              />
            </div>

            <div style={{ marginTop: "10px" }} className="continue">
              <button className="continue-btn" type="submit">
                Continue
              </button>
              <div className="faq-div">
                <h4>
                  Don't have any prior experience?
                  <Link to="/home">
                    <button
                      style={{
                        background: "white",
                        color: "blue",
                        fontSize: "18px",
                      }}
                      className="get-started-btn"
                    >
                      Skip
                    </button>
                  </Link>
                </h4>
              </div>
            </div>
            <div
              style={{ marginTop: "2px", fontSize: "20px" }}
              id="error-message"
            ></div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Employment;
