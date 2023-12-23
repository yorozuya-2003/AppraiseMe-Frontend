import { React, useState, useEffect, useRef } from "react";
import { useParams, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "./ApiConfig";
import Header from "./Header";
import "../styles/add_review.css";
import useCheckProfileCompletion from "./checkProfileCompletion";
import Carousel from "./Carousel";

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
            `${API_BASE_URL}/api/addprofile/?Email=${userResponse.data.email}`
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setFormData({ ...formData, [name]: newValue });
    // console.log(formData);
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

  const items = [
    <>
      <div className="review_form">
        <div className="review-box">
          <p style={{ fontSize: "22px", marginBottom: "15px" }} id="tell-us">
            Tell us a little about your history with {profileModel.First_name}
          </p>
          <div className="review-dropdowns" style={{ fontWeight: 400 }}>
            <div className="dropdown-section">
              <div className="dropdown-subsection">
                <p style={{ marginBottom: 0 }} className="dropdown-question">
                  Where do you know {profileModel.First_name} from?
                </p>
                <select
                  name="acquaintance"
                  value={formData.acquaintance}
                  onChange={handleChange}
                  className="select"
                >
                  <option value="Work">Work</option>
                  <option value="Personal">Personal</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="dropdown-section">
                <p style={{ marginBottom: 0 }} className="dropdown-question">
                  How many years have you known {profileModel.First_name} for?
                </p>
                <select
                  style={{ marginBottom: 0 }}
                  name="acquaintance_time"
                  value={formData.acquaintance_time}
                  onChange={handleChange}
                  className="select"
                >
                  <option value="Less than 1 year">Less than 1 year</option>
                  <option value="1 to 3 years">1 to 3 years</option>
                  <option value="More than 3 years">More than 3 years</option>
                </select>
              </div>
            </div>

            <div className="dropdown-section">
              <div className="dropdown-subsection">
                <p style={{ marginBottom: 0 }} className="dropdown-question">
                  What is your relation with {profileModel.First_name}?
                </p>
                <select
                  name="relation"
                  value={formData.relation}
                  onChange={handleChange}
                  className="select"
                >
                  <option value="Boss">Boss</option>
                  <option value="Employee">Employee</option>
                  <option value="Colleague">Colleague</option>
                  <option value="Client">Client</option>
                  <option value="Friend">Friend</option>
                  <option value="Family or Relative">Family or Relative</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="dropdown-section">
                <p style={{ marginBottom: 0 }} className="dropdown-question">
                  What was the team size?
                </p>
                <select
                  style={{ marginBottom: 0 }}
                  name="team_size"
                  value={formData.team_size}
                  onChange={handleChange}
                  className="select"
                >
                  <option value="Less than 5">Less than 5</option>
                  <option value="5 to 20">5 to 20</option>
                  <option value="More than 20">More than 20</option>
                  <option value="None">None</option>
                </select>
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
            Great job! Let’s understand {profileModel.First_name} better
          </p>
          <p className="slider-question-hint">
            Use the sliders below to find the adjectives that best describe {profileModel.First_name}
          </p>
          </div>
          <div style={{ marginBottom: "50px" }}>
            <p
              style={{
                marginBottom: "10px",
                fontSize: "20px",
                fontWeight: 400,
              }}
              className="slider-question"
            >
              Communication
            </p>
            <input
              style={{ marginBottom: "0px", marginLeft: "0px" }}
              type="range"
              min="0"
              max="10"
              name="slider1"
              value={formData.slider1}
              onChange={handleChange}
              className="custom-slider"
            />
            <div
              style={{
                marginTop: "0px",
                padding: "0px",
                fontWeight: 100,
                fontSize: "12px",
              }}
            >
              <p style={{ margin: 0, display: "inline", float: "left" }}>
                Introspective
              </p>
              <p style={{ margin: 0, display: "inline", float: "right" }}>
                Greagrious
              </p>
            </div>
          </div>

          <div style={{ marginBottom: "50px" }}>
            <p
              style={{
                marginBottom: "10px",
                fontSize: "20px",
                fontWeight: 400,
              }}
              className="slider-question"
            >
              Communication
            </p>
            <input
              style={{ marginBottom: "0px", marginLeft: "0px" }}
              type="range"
              min="0"
              max="10"
              name="slider2"
              value={formData.slider2}
              onChange={handleChange}
              className="custom-slider"
            />
            <div
              style={{
                marginTop: "0px",
                padding: "0px",
                fontWeight: 100,
                fontSize: "12px",
              }}
            >
              <p style={{ margin: 0, display: "inline", float: "left" }}>
                Introspective
              </p>
              <p style={{ margin: 0, display: "inline", float: "right" }}>
                Greagrious
              </p>
            </div>
          </div>

          <div style={{ marginBottom: "50px" }}>
            <p
              style={{
                marginBottom: "10px",
                fontSize: "20px",
                fontWeight: 400,
              }}
              className="slider-question"
            >
              Communication
            </p>
            <input
              style={{ marginBottom: "0px", marginLeft: "0px" }}
              type="range"
              min="0"
              max="10"
              name="slider3"
              value={formData.slider3}
              onChange={handleChange}
              className="custom-slider"
            />
            <div
              style={{
                marginTop: "0px",
                padding: "0px",
                fontWeight: 100,
                fontSize: "12px",
              }}
            >
              <p style={{ margin: 0, display: "inline", float: "left" }}>
                Introspective
              </p>
              <p style={{ margin: 0, display: "inline", float: "right" }}>
                Greagrious
              </p>
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
            Great job! Let’s understand {profileModel.First_name} better
          </p>
          <p className="slider-question-hint">
            Use the sliders below to find the adjectives that best describe {profileModel.First_name}
          </p>
          </div>
          <div style={{ marginBottom: "50px" }}>
            <p
              style={{
                marginBottom: "10px",
                fontSize: "20px",
                fontWeight: 400,
              }}
              className="slider-question"
            >
              Communication
            </p>
            <input
              style={{ marginBottom: "0px", marginLeft: "0px" }}
              type="range"
              min="0"
              max="10"
              name="slider4"
              value={formData.slider4}
              onChange={handleChange}
              className="custom-slider"
            />
            <div
              style={{
                marginTop: "0px",
                padding: "0px",
                fontWeight: 100,
                fontSize: "12px",
              }}
            >
              <p style={{ margin: 0, display: "inline", float: "left" }}>
                Introspective
              </p>
              <p style={{ margin: 0, display: "inline", float: "right" }}>
                Greagrious
              </p>
            </div>
          </div>

          <div style={{ marginBottom: "50px" }}>
            <p
              style={{
                marginBottom: "10px",
                fontSize: "20px",
                fontWeight: 400,
              }}
              className="slider-question"
            >
              Communication
            </p>
            <input
              style={{ marginBottom: "0px", marginLeft: "0px" }}
              type="range"
              min="0"
              max="10"
              name="slider5"
              value={formData.slider5}
              onChange={handleChange}
              className="custom-slider"
            />
            <div
              style={{
                marginTop: "0px",
                padding: "0px",
                fontWeight: 100,
                fontSize: "12px",
              }}
            >
              <p style={{ margin: 0, display: "inline", float: "left" }}>
                Introspective
              </p>
              <p style={{ margin: 0, display: "inline", float: "right" }}>
                Greagrious
              </p>
            </div>
          </div>

          <div style={{ marginBottom: "50px" }}>
            <p
              style={{
                marginBottom: "10px",
                fontSize: "20px",
                fontWeight: 400,
              }}
              className="slider-question"
            >
              Communication
            </p>
            <input
              style={{ marginBottom: "0px", marginLeft: "0px" }}
              type="range"
              min="0"
              max="10"
              name="slider6"
              value={formData.slider6}
              onChange={handleChange}
              className="custom-slider"
            />
            <div
              style={{
                marginTop: "0px",
                padding: "0px",
                fontWeight: 100,
                fontSize: "12px",
              }}
            >
              <p style={{ margin: 0, display: "inline", float: "left" }}>
                Introspective
              </p>
              <p style={{ margin: 0, display: "inline", float: "right" }}>
                Greagrious
              </p>
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
            Great job! Let’s understand {profileModel.First_name} better
          </p>
          <p className="slider-question-hint">
            Use the sliders below to find the adjectives that best describe {profileModel.First_name}
          </p>
          </div>
          <div style={{ marginBottom: "50px" }}>
            <p
              style={{
                marginBottom: "10px",
                fontSize: "20px",
                fontWeight: 400,
              }}
              className="slider-question"
            >
              Communication
            </p>
            <input
              style={{ marginBottom: "0px", marginLeft: "0px" }}
              type="range"
              min="0"
              max="10"
              name="slider7"
              value={formData.slider7}
              onChange={handleChange}
              className="custom-slider"
            />
            <div
              style={{
                marginTop: "0px",
                padding: "0px",
                fontWeight: 100,
                fontSize: "12px",
              }}
            >
              <p style={{ margin: 0, display: "inline", float: "left" }}>
                Introspective
              </p>
              <p style={{ margin: 0, display: "inline", float: "right" }}>
                Greagrious
              </p>
            </div>
          </div>

          <div style={{ marginBottom: "50px" }}>
            <p
              style={{
                marginBottom: "10px",
                fontSize: "20px",
                fontWeight: 400,
              }}
              className="slider-question"
            >
              Communication
            </p>
            <input
              style={{ marginBottom: "0px", marginLeft: "0px" }}
              type="range"
              min="0"
              max="10"
              name="slider8"
              value={formData.slider8}
              onChange={handleChange}
              className="custom-slider"
            />
            <div
              style={{
                marginTop: "0px",
                padding: "0px",
                fontWeight: 100,
                fontSize: "12px",
              }}
            >
              <p style={{ margin: 0, display: "inline", float: "left" }}>
                Introspective
              </p>
              <p style={{ margin: 0, display: "inline", float: "right" }}>
                Greagrious
              </p>
            </div>
          </div>

          <div style={{ marginBottom: "50px" }}>
            <p
              style={{
                marginBottom: "10px",
                fontSize: "20px",
                fontWeight: 400,
              }}
              className="slider-question"
            >
              Communication
            </p>
            <input
              style={{ marginBottom: "0px", marginLeft: "0px" }}
              type="range"
              min="0"
              max="10"
              name="slider9"
              value={formData.slider9}
              onChange={handleChange}
              className="custom-slider"
            />
            <div
              style={{
                marginTop: "0px",
                padding: "0px",
                fontWeight: 100,
                fontSize: "12px",
              }}
            >
              <p style={{ margin: 0, display: "inline", float: "left" }}>
                Introspective
              </p>
              <p style={{ margin: 0, display: "inline", float: "right" }}>
                Greagrious
              </p>
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
        <div className="sentence-section">
          <p className="sentence-question">
            Lastly, please write a single, short sentence that best describes{" "}
            {profileModel.First_name}'s demeanoar
          </p>
          <textarea
            placeholder="Short Description..."
            name="sentence"
            value={formData.sentence}
            onChange={handleChange}
            className="sentence-box"
          />

          <div className="anonymous-checkbox">
            <input
              type="checkbox"
              id="anonymous"
              name="is_anonymous"
              checked={formData.is_anonymous}
              onChange={handleChange}
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
                {profileModel.First_name} {profileModel.Second_name}
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
            <Carousel ref={carouselRef} items={items}/>
          </form>
      </div>
        </>
      )}
    </>
  );
}

export default AddReview;
