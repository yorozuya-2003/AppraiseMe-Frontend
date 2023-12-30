import { useState, useEffect, React } from "react";
import axios from "axios";
import Header from "./Header";
import "../styles/home.css";
import "../styles/user_page.css";
import useCheckProfileCompletion from "./checkProfileCompletion";
import API_BASE_URL from "./ApiConfig";
import { useNavigate, Link } from "react-router-dom";
import { ReactComponent as CopyURL } from "./add_link.svg";
import { ReactComponent as HelpIcon } from "./help.svg";
import { ReactComponent as EditIcon } from "./edit.svg";
import { ReactComponent as TickIcon } from "./tick.svg";

function HomePage() {
  useCheckProfileCompletion();
  let loggedInUser = JSON.parse(localStorage.getItem("user"));
  let userEmail = null;
  const navigate = useNavigate();

  const [workModel, setWorkModel] = useState([]);
  const [profileModel, setProfileModel] = useState([]);
  const [reviewModel, setReviewModel] = useState([]);

  console.log(loggedInUser);

  useEffect(() => {
    if (loggedInUser) {
      userEmail = loggedInUser.email;
    } else {
      navigate("/");
    }
  }, [loggedInUser]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [workModelResponse, profileModelResponse, reviewModelResponse] =
          await Promise.all([
            axios.get(`${API_BASE_URL}/api/addwork/?email=${userEmail}`),
            axios.get(`${API_BASE_URL}/api/addprofile/?email=${userEmail}`),
            axios.get(`${API_BASE_URL}/get_reviews/${userEmail}`, {
              params: { email: userEmail },
            }),
          ]);
        // console.log(profileModelResponse.data);
        setWorkModel(workModelResponse.data);
        setProfileModel(profileModelResponse.data);
        setReviewModel(reviewModelResponse.data.reviews);

        // console.log(profileModel.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const calculateAverage = (property) =>
    reviewModel.reduce((total, model) => total + model[property], 0) /
    reviewModel.length;

  const [isBioAddDivVisible, setIsBioAddDivVisible] = useState(false);
  const [bioInput, setBioInput] = useState(profileModel.bio);

  const toggleAddDiv = () => {
    setIsBioAddDivVisible(!isBioAddDivVisible);
  };

  const handleInputChange = (e) => {
    setBioInput(e.target.value);
  };

  const handleSaveBio = async () => {
    try {
      // console.log(bioInput)
      await axios.post(`${API_BASE_URL}/update_bio/${userEmail}/`, {
        bio: bioInput,
      });

      setProfileModel((prevProfileModel) => {
        return prevProfileModel.map((profile) => {
          if (profile.email === userEmail) {
            return { ...profile, bio: bioInput };
          }
          return profile;
        });
      });

      setIsBioAddDivVisible(false);
    } catch (error) {
      console.error("Error updating Bio:", error);
    }
  };

  const [isAttributeAddDivVisible, setIsAttributeAddDivVisible] =
    useState(false);

  const toggleAddDiv2 = () => {
    setIsAttributeAddDivVisible(!isAttributeAddDivVisible);
  };

  const attributesButtonLabel = isAttributeAddDivVisible
    ? "Show Less"
    : "Click here";
  const [imageinput, setImageInput] = useState(null);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];

    if (file) {
      // Validate file type
      const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
      if (!allowedTypes.includes(file.type)) {
        // Display an alert for an invalid file type
        alert("Please select a valid image file (png, jpg, or jpeg).");
        return;
      }

      try {
        const formData = new FormData();
        formData.append("image", file);

        const response = await axios.post(
          `${API_BASE_URL}/update_image/${userEmail}/`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        const updatedModel = response.data;

        setProfileModel((prevProfileModel) => {
          return prevProfileModel.map((profile) =>
            profile.email === userEmail ? updatedModel : profile
          );
        });

        window.location.reload();
      } catch (error) {
        console.error("Error updating Image:", error);
      }
    }
  };

  const handleCopyURL = () => {
    // const url = window.location.href;
    // const url = `http://localhost:3000/user/${loggedInUser.username}`;
    const url = `https://appraise-me.vercel.app/user/${loggedInUser.username}`;
    navigator.clipboard.writeText(url);
    alert("URL copied to clipboard");
  };

  const handleUpvote = async (reviewId) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const userEmail = user.email;
      const response = await axios.post(
        `${API_BASE_URL}/upvote_review/${reviewId}`,
        { email: userEmail }
      );
      if (response.data.success) {
        console.log(response.data);
        setReviewModel((prevReviews) =>
          prevReviews.map((review) =>
            review.id === reviewId
              ? {
                  ...review,
                  upvotes_count: response.data.upvotes_count,
                  downvotes_count: response.data.downvotes_count,
                  has_upvoted: response.data.has_upvoted,
                  has_downvoted: response.data.has_downvoted,
                }
              : review
          )
        );
      } else {
        alert("Something went wrong");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDownvote = async (reviewId) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const userEmail = user.email;
      const response = await axios.post(
        `${API_BASE_URL}/downvote_review/${reviewId}`,
        { email: userEmail }
      );
      if (response.data.success) {
        console.log(response.data);
        setReviewModel((prevReviews) =>
          prevReviews.map((review) =>
            review.id === reviewId
              ? {
                  ...review,
                  upvotes_count: response.data.upvotes_count,
                  downvotes_count: response.data.downvotes_count,
                  has_upvoted: response.data.has_upvoted,
                  has_downvoted: response.data.has_downvoted,
                }
              : review
          )
        );
      } else {
        alert("Something went wrong");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const renderSlider = (index) => {
    const sliderValue = calculateAverage(`slider${index}`);

    return (
      <div
        className={`attr-slider-box ${index === 1 && "top-slider"}`}
        key={index}
      >
        <div className="attr-slider-question-div">
          <p className="attr-slider-question">Communication</p>
          <HelpIcon />
        </div>
        <input
          type="range"
          min="0"
          max="10"
          value={sliderValue}
          className="attr-slider custom-slider"
        />
        <div className="attr-slider-ends">
          <p style={{ float: "left" }}>Introspective</p>
          <p style={{ float: "right" }}>Greagrious</p>
        </div>
      </div>
    );
  };

  return (
    <div className="home">
      <header>
        <Header></Header>
      </header>

      <div
        className="homediv1"
        style={{ marginBottom: "160px", marginTop: "10px" }}
      >
        {profileModel.map((model, index) => {
          console.log("Image Path:", model.image);
          return (
            <div style={{ display: "flex", flexDirection: "row" }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginRight: "25px",
                }}
              >
                <img
                  src={model.image ? `${model.image}` : `default_avatar.jpg`}
                  alt=""
                  style={{
                    width: "150px",
                    height: "150px",
                    borderRadius: "75px",
                    marginRight: "35px",
                  }}
                />
                <label
                  className="continue-btn"
                  style={{
                    marginTop: "15px",
                    padding: "5px",
                    fontSize: "15px",
                    backgroundColor: "ButtonShadow",
                    color: "black",
                  }}
                >
                  Change Image
                  <input
                    type="file"
                    accept=".jpeg, .jpg, .png, application/json"
                    name="imageinput"
                    id="imageinput"
                    style={{ display: "none" }}
                    onChange={handleImageChange}
                  />
                </label>
              </div>
              <p>
                {model.first_name} {model.second_name}
              </p>
            </div>
          );
        })}
      </div>

      <div className="homediv3">
        <div className="experiences">
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <p
              style={{
                fontFamily: "Inter",
                fontSize: "20px",
                fontWeight: 500,
                marginBottom: "40px",
              }}
            >
              Previous Experiences
            </p>

            <Link style={{ textDecoration: "none" }} to={"/addexp"}>
              <button
                id="addbutton"
                style={{
                  padding: "0px 20px",
                  fontSize: "13px",
                  height: "30px",
                }}
                className="continue-btn"
                type="button"
              >
                Add +
              </button>
            </Link>
          </div>

          {workModel.map((model, index) => (
            <div style={{}} className="">
              <p style={{ marginBottom: "1px" }}>{model.title}</p>
              <p
                style={{
                  fontSize: "16px",
                  fontWeight: 300,
                  color: "#4A4A4A",
                  marginBottom: "20px",
                }}
              >
                {model.company}, {model.location}, {model.location_type}{" "}
              </p>
            </div>
          ))}
        </div>

        <div className="about">
          <div className="about-bio">
            <div className="about-bio-header">
              {profileModel.map((model, index) => (
                <p> About {model.first_name} </p>
              ))}

              <div className="buttons">
                <button
                  className="url-btn"
                  type="button"
                  onClick={handleCopyURL}
                >
                  <CopyURL />
                </button>

                <button
                  onClick={isBioAddDivVisible ? handleSaveBio : toggleAddDiv}
                  className="url-btn"
                  type="button"
                >
                  {isBioAddDivVisible ? <TickIcon /> : <EditIcon />}
                </button>
              </div>
            </div>

            <div
              style={{
                display: !isBioAddDivVisible ? "flex" : "none",
                flexDirection: "column",
              }}
            >
              {profileModel.map((model, index) => (
                <p className="bio-text">
                  {model.bio ? (
                    model.bio
                  ) : (
                    <span style={{ fontStyle: "italic", color: "#4A4A4A" }}>
                      (Bio not added)
                    </span>
                  )}
                </p>
              ))}
            </div>

            <div
              style={{
                display: isBioAddDivVisible ? "flex" : "none",
                flexDirection: "column",
                width: "100%",
              }}
            >
              <input
                className="bio-input"
                type="text"
                value={bioInput}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="attributes">
            <div className="key-attr">
              <p className="key-attr-heading">Key Attributes</p>
              {profileModel.map((model, index) => (
                <p className="key-attr-subheading">
                  What best describes {model.first_name}
                </p>
              ))}
            </div>

            {[1, 2, 3].map((index) => renderSlider(index))}
            {isAttributeAddDivVisible &&
              [4, 5, 6, 7, 8, 9].map((index) => renderSlider(index))}

            <button
              onClick={toggleAddDiv2}
              style={{
                boxSizing: "19px",
                backgroundColor: "white",
                color: "blue",
                border: "none",
                fontSize: "16px",
              }}
            >
              {" "}
              {!isAttributeAddDivVisible && (
                <span style={{ color: "black" }}>Need more details? </span>
              )}
              {attributesButtonLabel}
            </button>
          </div>

          <div className="reviews">
            <div className="reviews-div">
              <div className="reviews-div-header">
                <p className="reviews-div-header-title">User Reviews</p>

                {profileModel.map((model, index) => (
                  <p className="reviews-div-header-subtitle">
                    What other users say about {model.first_name}
                  </p>
                ))}
              </div>

              {reviewModel.map((model, index) => (
                <div className="user-review-div">
                  {!model.is_anonymous ? (
                    <Link
                      to={`/user/${model.user_id}/`}
                      style={{ textDecoration: "none" }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          width: "187px",
                          gap: "12px",
                        }}
                      >
                        <img
                          src={
                            model.image
                              ? `${model.image}`
                              : `default_avatar.jpg`
                          }
                          alt=""
                        />
                        <p
                          className="review-user-name"
                          style={{
                            fontSize: "18px",
                            fontWeight: 500,
                            marginBottom: "11px",
                          }}
                        >
                          {model.from_user_name}
                        </p>
                      </div>
                    </Link>
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        width: "187px",
                        gap: "12px",
                      }}
                    >
                      <img src={`default_avatar.jpg`} alt="" />
                      <p
                        className="review-user-name"
                        style={{
                          fontSize: "18px",
                          fontWeight: 500,
                          marginBottom: "11px",
                        }}
                      >
                        {model.from_user_name}
                      </p>
                    </div>
                  )}
                  <p style={{ marginBottom: "20px" }}>{model.sentence}</p>

                  <div className="review-buttons">
                    <button
                      onClick={() => handleUpvote(model.id)}
                      className={`vote-button ${
                        model.has_upvoted ? "voted" : ""
                      }`}
                    >
                      Upvote ({model.upvotes_count})
                    </button>

                    <button
                      onClick={() => handleDownvote(model.id)}
                      className={`vote-button ${
                        model.has_downvoted ? "voted" : ""
                      }`}
                    >
                      Downvote ({model.downvotes_count})
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
