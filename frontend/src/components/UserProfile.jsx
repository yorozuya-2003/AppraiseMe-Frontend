import { React, useState, useEffect } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import axios from "axios";
import useCheckProfileCompletion from "./checkProfileCompletion";
import API_BASE_URL from "./ApiConfig";
import Header from "./Header";
import "../styles/landing_page.css";
import "../styles/user_page.css";
import "../styles/user_profile.css";
import { ReactComponent as ReviewLogo } from "./add_review.svg";
import { ReactComponent as CopyURL } from "./add_link.svg";
import { ReactComponent as Delete } from "./delete.svg";
import { ReactComponent as HelpIcon } from "./help.svg";

function UserProfile() {
  useCheckProfileCompletion();
  const { username } = useParams();
  const [userData, setUserData] = useState(null);

  const [workModel, setWorkModel] = useState([]);
  const [profileModel, setProfileModel] = useState([]);
  const [reviewModel, setReviewModel] = useState([]);

  const [isAddDivVisible, setIsAddDivVisible] = useState(false);

  const [reviewToDelete, setReviewToDelete] = useState(null);
  const [isDeleteConfirmationVisible, setIsDeleteConfirmationVisible] =
    useState(false);

  const [hasReviewed, setHasReviewed] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || !user.email) {
          console.log("user not logged in");
          return;
        }

        const userResponse = await axios.get(
          `${API_BASE_URL}/user/${username}/`
        );
        setUserData(userResponse.data);

        const userEmail = user.email;

        const [
          workModelResponse,
          profileModelResponse,
          reviewModelResponse,
          hasReviewedResponse,
        ] = await Promise.all([
          axios.get(
            `${API_BASE_URL}/api/addwork/?email=${userResponse.data.email}`
          ),
          axios.get(
            `${API_BASE_URL}/api/addprofile/?Email=${userResponse.data.email}`
          ),
          axios.get(`${API_BASE_URL}/get_reviews/${userResponse.data.email}`, {
            params: { email: userEmail },
          }),
          axios.get(`${API_BASE_URL}/has_reviewed/${userResponse.data.email}`, {
            params: { email: userEmail },
          }),
        ]);

        setWorkModel(workModelResponse.data);
        setProfileModel(profileModelResponse.data);
        setReviewModel(reviewModelResponse.data.reviews);
        setHasReviewed(hasReviewedResponse.data.has_reviewed);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [username]);

  if (!userData) {
    return <div>Loading...</div>;
  }

  const calculateAverage = (property) =>
    reviewModel.reduce((total, model) => total + model[property], 0) /
    reviewModel.length;

    const renderSlider = (index) => {
      const sliderValue = calculateAverage(`slider${index}`);
  
      return (
        <div className={`attr-slider-box ${index===1 && "top-slider"}`} key={index}>
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
            <p style={{ float: "right"}}>Greagrious</p>
          </div>
        </div>
      );
    };

  const toggleAddDiv = () => {
    setIsAddDivVisible(!isAddDivVisible);
  };

  const attributesButtonLabel = isAddDivVisible ? "Show Less" : "Click here";

  let isCurrentUserProfile = false;
  const localStorageUser = JSON.parse(localStorage.getItem("user"));
  if (localStorageUser) {
    isCurrentUserProfile = userData.username === localStorageUser.username;
  }

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

  const handleCopyURL = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    alert("URL copied to clipboard");
  };

  const handleDeleteReview = async () => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/delete_review/${reviewToDelete}`
      );
      if (response.data.success) {
        setReviewModel((prevReviews) =>
          prevReviews.filter((review) => review.id !== reviewToDelete)
        );
        setHasReviewed(false);
        setIsDeleteConfirmationVisible(false);
      } else {
        alert("Failed to delete the review");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {isCurrentUserProfile ? (
        <Navigate to="/home" />
      ) : (
        <>
          <div className="home">
            <header>
              <Header></Header>
            </header>

            <div
              className="homediv1"
              style={{ marginBottom: "160px", marginTop: "10px" }}
            >
              {profileModel.map((model, index) => (
                <div style={{ display: "flex", flexDirection: "row" }}>
                  <img
                    src={model.Image ? `${model.Image}` : `default_avatar.jpg`}
                    alt=""
                    style={{
                      width: "150px",
                      height: "150px",
                      borderRadius: "75px",
                      marginRight: "35px",
                    }}
                  />
                  <p>
                    {model.First_name} {model.Second_name}
                  </p>
                </div>
              ))}
            </div>

            <div className="homediv3">
              <div className="experiences">
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
                      <p> About {model.First_name} </p>
                    ))}

                    <div className="buttons">
                      <button
                        className="url-btn"
                        type="button"
                        onClick={handleCopyURL}
                      >
                        <CopyURL />
                      </button>

                      {!hasReviewed ? (
                        <Link
                          style={{ textDecoration: "none" }}
                          to={`/addreview/${userData.username}`}
                        >
                          <button className="review-btn" type="submit">
                            <ReviewLogo />
                            Review
                          </button>
                        </Link>
                      ) : (
                        <Link
                          style={{ textDecoration: "none" }}
                          to={`/editreview/${userData.username}`}
                        >
                          <button className="review-btn" type="submit">
                            <ReviewLogo />
                            Edit Review
                          </button>
                        </Link>
                      )}
                    </div>
                  </div>

                  {profileModel.map((model, index) => (
                    <p className="bio-text">
                      {model.Bio ? (
                        model.Bio
                      ) : (
                        <span style={{ fontStyle: "italic", color: "#4A4A4A" }}>
                          (Bio not added)
                        </span>
                      )}
                    </p>
                  ))}
                </div>

                <div className="attributes">
                  <div className="key-attr">
                    <p className="key-attr-heading">Key Attributes</p>
                    {profileModel.map((model, index) => (
                      <p className="key-attr-subheading">
                        What best describes {model.First_name}
                      </p>
                    ))}
                  </div>

                  {[1, 2, 3].map((index) => renderSlider(index))}
                  {isAddDivVisible && [4, 5, 6, 7, 8, 9].map((index) => renderSlider(index))}

                  <button
                    onClick={toggleAddDiv}
                    style={{
                      boxSizing: "19px",
                      backgroundColor: "white",
                      color: "blue",
                      border: "none",
                      fontSize: "16px",
                    }}
                  >
                    {" "}
                    {!isAddDivVisible && (
                      <span style={{ color: "black" }}>
                        Need more details?{" "}
                      </span>
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
                          What other users say about {model.First_name}
                        </p>
                      ))}
                    </div>

                    <div className="user-reviews">
                      {reviewModel.map((model, index) => (
                        <div className="user-review-div" key={model.id}>
                          {!model.is_anonymous ? (
                            <Link
                              to={`/user/${model.user_id}/`}
                              style={{ textDecoration: "none" }}
                            >
                              <div className="user-review-div-profile">
                                <img
                                  src={
                                    model.Image
                                      ? `${model.Image}`
                                      : `default_avatar.jpg`
                                  }
                                  alt=""
                                />
                                <p className="review-user-name">
                                  {model.from_user_name}
                                </p>
                              </div>
                            </Link>
                          ) : (
                            <div className="user-review-div-profile">
                              <img src={`default_avatar.jpg`} alt="" />
                              <p className="review-user-name">
                                {model.from_user_name}
                              </p>
                            </div>
                          )}
                          <p className="user-review-sentence">
                            {model.sentence}
                          </p>

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

                            {model.can_delete && (
                              <button
                                className="delete-btn"
                                onClick={() => {
                                  setReviewToDelete(model.id);
                                  setIsDeleteConfirmationVisible(
                                    !isDeleteConfirmationVisible
                                  );
                                }}
                              >
                                <Delete />
                              </button>
                            )}
                          </div>

                          {model.can_delete && isDeleteConfirmationVisible && (
                            <div className="delete-confirmation-modal">
                              <p className="confirm-delete-sentence">
                                Are you sure you want to delete this review?
                              </p>
                              <div className="confirm-delete-buttons">
                                <button
                                  className="confirm-delete-btn"
                                  onClick={handleDeleteReview}
                                >
                                  Yes
                                </button>
                                <button
                                  className="confirm-delete-btn"
                                  onClick={() =>
                                    setIsDeleteConfirmationVisible(false)
                                  }
                                >
                                  No
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
export default UserProfile;
