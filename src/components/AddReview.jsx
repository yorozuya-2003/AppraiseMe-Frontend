import { React, useState, useEffect, useRef } from "react";
import { useParams, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "./ApiConfig";
import Header from "./Header";
import "../styles/add_review.css";
import useCheckProfileCompletion from "./checkProfileCompletion";
import Carousel from "./Carousel";
import Select from "react-select";
import { ReactComponent as HelpIcon } from "./help.svg";

function AddReview() {
  const carouselRef = useRef();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  useCheckProfileCompletion();
  const { username } = useParams();
  const [userData, setUserData] = useState(null);

  const [profileModel, setProfileModel] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await axios.get(
          `${API_BASE_URL}/user/${username}/`
        );
        setUserData(userResponse.data);

        const [profileModelResponse] = await Promise.all([
          axios.get(
            `${API_BASE_URL}/api/addprofile/?email=${userResponse.data.email}`
          ),
        ]);

        setProfileModel(profileModelResponse.data[0]);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [username]);

  const loggedInUser = JSON.parse(localStorage.getItem("user"));
  const [formData, setFormData] = useState({
    to_user: "",
    from_user: loggedInUser.email,
    acquaintance: "Work",
    acquaintance_time: "Less than 1 year",
    relation: "Boss",
    team_size: "Less than 5",
    slider1: 0,
    slider2: 0,
    slider3: 0,
    slider4: 0,
    slider5: 0,
    slider6: 0,
    slider7: 0,
    slider8: 0,
    slider9: 0,
    sentence: "",
    is_anonymous: false,
  });

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/user/${username}/`)
      .then((response) => {
        setUserData(response.data);
        setFormData({ ...formData, to_user: response.data.email });
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

  const handleChange = (name, selectedOption) => {
    let updatedValue = "";
    if (
      name === "acquaintance" ||
      name === "acquaintance_time" ||
      name === "relation" ||
      name === "team_size"
    ) {
      updatedValue = selectedOption.value;
    } else if (name === "is_anonymous") {
      updatedValue = !formData.is_anonymous;
    } else {
      updatedValue = selectedOption;
    }
    setFormData({ ...formData, [name]: updatedValue });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post(`${API_BASE_URL}/api/add-review/`, formData)
      .then((response) => {
        console.log("Review added successfully:", response.data);
        navigate(`/user/${username}`);
      })
      .catch((error) => {
        console.log("Error adding review:", error);
      });
    // console.log(formData);
  };

  const handleContinue = () => {
    const nextIndex = currentIndex + 1;
    setCurrentIndex(nextIndex);
    carouselRef.current.goToSlide(nextIndex);
    console.log(currentIndex);
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

  const renderSlider = (sliderNumber) => {
    return (
      <div className="slider-div" key={sliderNumber}>
        <div className="slider-question">
          <p>Communication</p>
          <HelpIcon />
        </div>
        <input
          type="range"
          min="0"
          max="10"
          name={`slider${sliderNumber}`}
          value={formData[`slider${sliderNumber}`]}
          onChange={(e) =>
            handleChange(`slider${sliderNumber}`, e.target.value)
          }
          className="slider-slider custom-slider"
        />
        <div className="slider-ends">
          <p style={{ float: "left" }}>Introspective</p>
          <p style={{ float: "right" }}>Gregarious</p>
        </div>
      </div>
    );
  };

  const items = [
    <>
      <div className="review_form">
        <div className="review-box">
          <p style={{ fontSize: "22px", marginBottom: "15px" }} id="tell-us">
            Tell us a little about your history with {profileModel.first_name}
          </p>
          <div className="review-dropdowns" style={{ fontWeight: 400 }}>
            <div className="dropdown-section">
              <div className="dropdown-subsection">
                <p style={{ marginBottom: 0 }} className="dropdown-question">
                  Where do you know {profileModel.first_name} from?
                </p>
                <Select
                  name="acquaintance"
                  value={{
                    label: formData.acquaintance,
                    value: formData.acquaintance,
                  }}
                  onChange={(selectedOption) =>
                    handleChange("acquaintance", selectedOption)
                  }
                  options={[
                    { value: "Work", label: "Work" },
                    { value: "Personal", label: "Personal" },
                    { value: "Other", label: "Other" },
                  ]}
                  styles={selectStyles}
                />
              </div>

              <div className="dropdown-section">
                <p style={{ marginBottom: 0 }} className="dropdown-question">
                  How many years have you known {profileModel.first_name} for?
                </p>
                <Select
                  name="acquaintance_time"
                  value={{
                    label: formData.acquaintance_time,
                    value: formData.acquaintance_time,
                  }}
                  onChange={(selectedOption) =>
                    handleChange("acquaintance_time", selectedOption)
                  }
                  options={[
                    { value: "Less than 1 year", label: "Less than 1 year" },
                    { value: "1 to 3 years", label: "1 to 3 years" },
                    { value: "More than 3 years", label: "More than 3 years" },
                  ]}
                  styles={selectStyles}
                />
              </div>
            </div>

            <div className="dropdown-section">
              <div className="dropdown-subsection">
                <p style={{ marginBottom: 0 }} className="dropdown-question">
                  What is your relation with {profileModel.first_name}?
                </p>
                <Select
                  name="relation"
                  value={{ label: formData.relation, value: formData.relation }}
                  onChange={(selectedOption) =>
                    handleChange("relation", selectedOption)
                  }
                  options={[
                    { value: "Boss", label: "Boss" },
                    { value: "Employee", label: "Employee" },
                    { value: "Colleague", label: "Colleague" },
                    { value: "Client", label: "Client" },
                    { value: "Friend", label: "Friend" },
                    {
                      value: "Family or Relative",
                      label: "Family or Relative",
                    },
                    { value: "Other", label: "Other" },
                  ]}
                  styles={selectStyles}
                />
              </div>

              <div className="dropdown-section">
                <p style={{ marginBottom: 0 }} className="dropdown-question">
                  What was the team size?
                </p>
                <Select
                  name="team_size"
                  value={{
                    label: formData.team_size,
                    value: formData.team_size,
                  }}
                  onChange={(selectedOption) =>
                    handleChange("team_size", selectedOption)
                  }
                  options={[
                    { value: "Less than 5", label: "Less than 5" },
                    { value: "5 to 20", label: "5 to 20" },
                    { value: "More than 20", label: "More than 20" },
                    { value: "None", label: "None" },
                  ]}
                  styles={selectStyles}
                />
              </div>
            </div>
          </div>
        </div>
        <button type="button" className="continue-btn" onClick={handleContinue}>
          Continue to next step
        </button>
      </div>
    </>,
    <>
      <div className="review_form">
        <div className="slider-section">
          <div className="slider-question-div">
            <p className="slider-question">
              Great job! Let's understand {profileModel.first_name} better
            </p>
            <p className="slider-question-hint">
              Use the sliders below to find the adjectives that best describe{" "}
              {profileModel.first_name}
            </p>
          </div>

          <div className="sliders-box">
            {[1, 2, 3].map((sliderNumber) => renderSlider(sliderNumber))}
          </div>
        </div>
        <button type="button" className="continue-btn" onClick={handleContinue}>
          Continue to next step
        </button>
      </div>
    </>,
    <>
      <div className="review_form">
        <div className="slider-section">
          <div className="slider-question-div">
            <p className="slider-question">
              Great job! Let's understand {profileModel.first_name} better
            </p>
            <p className="slider-question-hint">
              Use the sliders below to find the adjectives that best describe{" "}
              {profileModel.first_name}
            </p>
          </div>

          <div className="sliders-box">
            {[4, 5, 6].map((sliderNumber) => renderSlider(sliderNumber))}
          </div>
        </div>
        <button type="button" className="continue-btn" onClick={handleContinue}>
          Continue to next step
        </button>
      </div>
    </>,
    <>
      <div className="review_form">
        <div className="slider-section">
          <div className="slider-question-div">
            <p className="slider-question">
              Great job! Let's understand {profileModel.first_name} better
            </p>
            <p className="slider-question-hint">
              Use the sliders below to find the adjectives that best describe{" "}
              {profileModel.first_name}
            </p>
          </div>

          <div className="sliders-box">
            {[7, 8, 9].map((sliderNumber) => renderSlider(sliderNumber))}
          </div>
        </div>
        <button type="button" className="continue-btn" onClick={handleContinue}>
          Continue to next step
        </button>
      </div>
    </>,
    <>
      <div className="review_form">
        <div className="sentence-section">
          <p className="sentence-question">
            Lastly, please write a single, short sentence that best describes{" "}
            {profileModel.first_name}'s demeanoar
          </p>
          <textarea
            placeholder="Short Description..."
            name="sentence"
            value={formData.sentence}
            onChange={(e) => handleChange("sentence", e.target.value)}
            className="sentence-box"
          />

          <div className="anonymous-checkbox">
            <input
              type="checkbox"
              id="anonymous"
              name="is_anonymous"
              checked={formData.is_anonymous}
              onChange={(e) => handleChange("is_anonymous", e.target.checked)}
            />
            <label>Review Anonymously</label>
          </div>

          <button type="submit" className="continue-btn">
            Finalize your review
          </button>
        </div>
      </div>
    </>,
  ];

  return (
    <>
      {isCurrentUserProfile ? (
        <Navigate to="/home" />
      ) : (
        <>
          <div className="addreview-body">
            <header>
              <Header></Header>
            </header>

            <div className="user-profile">
              <div className="user_profile_name">
                <p>You are now appraising</p>
                <p style={{ fontSize: "48px" }}>
                  {profileModel.first_name} {profileModel.second_name}
                </p>
              </div>

              <div className="user-profile-image">
                <img
                  src={
                    profileModel.Image
                      ? `${profileModel.Image}`
                      : `default_avatar.jpg`
                  }
                  alt=""
                  style={{
                    width: "150px",
                    height: "150px",
                    borderRadius: "75px",
                    marginRight: "35px",
                  }}
                />
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <Carousel ref={carouselRef} items={items} />
            </form>
          </div>
        </>
      )}
    </>
  );
}

export default AddReview;
