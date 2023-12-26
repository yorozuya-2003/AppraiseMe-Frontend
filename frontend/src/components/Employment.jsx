import axios from "axios";
import React, { useState } from "react";
import "../styles/add_experience.css";
import API_BASE_URL from "./ApiConfig";
import { Link, useNavigate } from "react-router-dom";
import Select from "react-select";

function Employment() {
  const navigate = useNavigate();
  let loggedInUser = JSON.parse(localStorage.getItem("user"));
  let loggedInUserObject = loggedInUser.email;

  const [formData, setFormData] = useState({
    email: loggedInUserObject,
    title: "",
    emp_type: "Full-time",
    company: "",
    location: "",
    location_type: "On-site",
    currently_working: true,
    start_time: "",
    end_time: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isAnyFieldEmpty = Object.values(formData).some(
      (field) => field === ""
    );

    if (isAnyFieldEmpty) {
      console.error("Error: All fields must be filled");
      return;
    }

    try {
      console.log(formData);
      axios
        .post(`${API_BASE_URL}/api/addwork/`, formData)
        .then((response) => {
          console.log("Experience added successfully:", response.data);
          navigate("/addexp");
        })
        .catch((error) => {
          console.log("Error adding Work:", error);
        });
    } catch (error) {
      console.error("Error Adding Work:", error);
    }
  };

  const selectStyles = {
    control: (provided) => ({
      ...provided,
      width: "320px",
      height: "56px",
      borderRadius: "16px",
      border: "1px solid #d9d9d9",
      padding: "0px",
      paddingLeft: "16px",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? "#3818fd" : "white",
      color: state.isSelected ? "white" : "#4a4a4a",
      ":hover": {
        backgroundColor: state.isSelected ? "#3818fd" : "#f3f3f3",
        color: state.isSelected ? "white" : "#4a4a4a",
      },
    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: "0px",
      margin: "0px",
    }),
    input: (provided) => ({
      ...provided,
      padding: "0px",
      margin: "0px",
    }),
  };

  return (
    <div className="addexp">
      <h1>👔 Add any previous employment history</h1>

      <div className="addexp-box" id="add_div">
        <div className="addexp-box-contents">
          <form onSubmit={handleSubmit} className="addexp-form" action="">
            <div className="add-exp-form-section title">
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Title"
                autoComplete="off"
              />
            </div>

            <div className="add-exp-form-section">
              <Select
                value={{ label: formData.emp_type, value: formData.emp_type }}
                onChange={(selectedOption) =>
                  setFormData({ ...formData, emp_type: selectedOption.value })
                }
                options={[
                  { label: "Full-time", value: "Full-time" },
                  { label: "Part-time", value: "Part-time" },
                ]}
                styles={selectStyles}
              />

              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Company Name"
                autoComplete="off"
              />
            </div>

            <div className="add-exp-form-section">
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Location"
                autoComplete="off"
              />

              <Select
                value={{
                  label: formData.location_type,
                  value: formData.location_type,
                }}
                onChange={(selectedOption) =>
                  setFormData({
                    ...formData,
                    location_type: selectedOption.value,
                  })
                }
                options={[
                  { label: "On-site", value: "On-site" },
                  { label: "Hybrid", value: "Hybrid" },
                  { label: "Remote", value: "Remote" },
                ]}
                styles={selectStyles}
              />
            </div>

            <div className="add-exp-form-section">
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label htmlFor="" style={{ marginLeft: "15px" }}>
                  Start Time
                </label>
                <input
                  type="date"
                  name="start_time"
                  value={formData.start_time}
                  onChange={handleChange}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column" }}>
                <label
                  htmlFor=""
                  style={{ marginLeft: "15px", marginDown: "20px" }}
                >
                  End Time
                </label>
                <input
                  type="date"
                  name="end_time"
                  value={formData.end_time}
                  onChange={handleChange}
                />
              </div>
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
