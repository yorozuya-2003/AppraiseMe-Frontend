import React, { useEffect, useState } from "react";
import Select from "react-select";
import "../styles/editdetails.css";
import axios from "axios";
import API_BASE_URL from "./ApiConfig";
import { useNavigate } from "react-router-dom";
import useCheckProfileCompletion from "./checkProfileCompletion";

function EditDetails() {
  useCheckProfileCompletion();
  let loggedInUser = JSON.parse(localStorage.getItem("user"));
  let userEmail = null;

  // console.log(loggedInUser);

  useEffect(() => {
    if (loggedInUser) {
      userEmail = loggedInUser.email;
    } else {
      navigate("/");
    }
  }, [loggedInUser]);

  const fetchData = () => {
    axios
      .get(`${API_BASE_URL}/api/addprofile/?email=${userEmail}`)
      .then((response) => {
        const data = response.data;

        setFormData({
          email: data[0].email,
          first_name: data[0].first_name,
          second_name: data[0].second_name,
          dob: data[0].dob,
          gender: data[0].gender,
          pronouns: data[0].pronouns,
        });
        // console.log(data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const [formData, setFormData] = useState({
    email: userEmail,
    first_name: "",
    second_name: "",
    dob: "",
    gender: "",
    pronouns: "",
  });

  useEffect(() => {
    fetchData();
  }, [userEmail]);

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const handleChange = (name, selectedOption) => {
    let updatedValue = "";
    if (name === "dob") {
      updatedValue = selectedOption;
    } else {
      updatedValue =
        name === "first_name" || name === "second_name"
          ? capitalizeFirstLetter(selectedOption)
          : selectedOption.value;
    }
    // console.log(formData);
    setFormData({ ...formData, [name]: updatedValue });
  };

  const navigate = useNavigate();

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
      const response = await axios.post(
        `${API_BASE_URL}/api/addprofile/`,
        formData
      );
      console.log("Details added:", response.data);
      setFormData({
        email: userEmail,
        first_name: "",
        second_name: "",
        dob: "",
        gender: "",
        pronouns: "",
      });
      navigate("/home");
    } catch (error) {
      console.error("Error Adding Details:", error);
    }
  };

  const currentDate = new Date();
  currentDate.setFullYear(currentDate.getFullYear() - 3);

  const maxDateValue = currentDate.toISOString().split("T")[0];

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
    <div className="editdetails">
      <h1>Edit your Details</h1>
      <form onSubmit={handleSubmit} className="editdetails-form" action="">
        <div className="editdetails-box">
          <div className="preferred-pronouns">
            <Select
              name="pronouns"
              value={{ label: formData.pronouns, value: formData.pronouns }}
              onChange={(selectedOption) =>
                handleChange("pronouns", selectedOption)
              }
              options={[
                { value: "He/Him", label: "He/Him" },
                { value: "She/Her", label: "She/Her" },
                { value: "They/Them", label: "They/Them" },
                { value: "Other", label: "Other" },
              ]}
              styles={selectStyles}
            />
          </div>

          <div className="names">
            <input
              type="text"
              placeholder="First Name"
              name="first_name"
              value={formData.first_name}
              onChange={(e) => handleChange("first_name", e.target.value)}
              autoComplete="off"
            />
            <input
              type="text"
              placeholder="Second Name"
              name="second_name"
              value={formData.second_name}
              onChange={(e) => handleChange("second_name", e.target.value)}
              autoComplete="off"
            />
          </div>

          <div className="dob-gender">
            <div className="dob">
              <input
                type="date"
                name="dob"
                max={maxDateValue}
                value={formData.dob}
                onChange={(e) => handleChange("dob", e.target.value)}
              />
            </div>

            <Select
              name="gender"
              value={{ label: formData.gender, value: formData.gender }}
              onChange={(selectedOption) =>
                handleChange("gender", selectedOption)
              }
              options={[
                { value: "Male", label: "Male" },
                { value: "Female", label: "Female" },
                { value: "Other", label: "Other" },
              ]}
              styles={selectStyles}
            />
          </div>

          <div className="continue">
            <button className="continue-btn" type="submit">
              Save Details
            </button>
            <div className="faq-div">
              <h4>Have a question? See our FAQ </h4>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default EditDetails;
