import { React, useState, useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import axios from "axios";
import API_URL from "./ApiConfig";
import Header from "./Header";
import "../styles/add_review.css";

function AddReview() {
  const { username } = useParams();
  const [userData, setUserData] = useState(null);

  const loggedInUser = JSON.parse(localStorage.getItem("user"));
  const [formData, setFormData] = useState({
    to_user: '',
    from_user: loggedInUser.email,
    acquaintance: 'Work',
    acquaintance_time: 'Less than 1 year',
    relation: 'Boss',
    team_size: 'Less than 5',
    slider1: 0,
    slider2: 0,
    slider3: 0,
    slider4: 0,
    slider5: 0,
    slider6: 0,
    slider7: 0,
    slider8: 0,
    slider9: 0,
    sentence: '',
  });

  useEffect(() => {
    axios
      .get(`${API_URL}/user/${username}/`)
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
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // console.log(formData);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    
    axios.post(`${API_URL}/api/add-review/`, formData)
    .then(response => {
      console.log('Review added successfully:', response.data);
    })
    .catch(error => {
      console.log('Error adding review:', error);
    })
  }

  return (
    <>
      {isCurrentUserProfile ? (
        <Navigate to="/home" />
      ) : (
        <>
          <header>
            <Header></Header>
          </header>

            <div className="user-profile">
                <div className="user-profile-name">
                    <h3>You are now appraising</h3>
                    <h2>{userData.username}</h2>
                </div>

                <div className="user-profile-image">
                    <img id="profile-image" src="" alt="user profile" />
                </div>
            </div>


            <form onSubmit={handleSubmit} className="review-box">
                <p id="tell-us">Tell us a little about your history with {userData.email}</p>
                <div className="review-dropdowns">
                    <div className="dropdown-section">
                        <div className="dropdown-subsection">
                            <p className="dropdown-question">Where do you know {userData.email} from?</p>
                            <select name="acquaintance" value={formData.acquaintance} onChange={handleChange}>
                                <option value="Work">Work</option>
                                <option value="Personal">Personal</option>
                                <option value="Other">Other</option>
                            </select>
                          </div>

                        <div className="dropdown-section">
                            <p className="dropdown-question">How many years have you known {userData.email} for?</p>
                            <select name="acquaintance_time" value={formData.acquaintance_time} onChange={handleChange}>
                                <option value="Less than 1 year">Less than 1 year</option>
                                <option value="1 to 3 years">1 to 3 years</option>
                                <option value="More than 3 years">More than 3 years</option>
                            </select>
                        </div>

                        </div>

                        <div className="dropdown-section">
                        <div className="dropdown-subsection">
                            <p className="dropdown-question">What is your relation with {userData.email}?</p>
                            <select name="relation" value={formData.relation} onChange={handleChange}>
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
                            <p className="dropdown-question">What was the team size?</p>
                            <select name="team_size" value={formData.team_size} onChange={handleChange}>
                                <option value="Less than 5">Less than 5</option>
                                <option value="5 to 20">5 to 20</option>
                                <option value="More than 20">More than 20</option>
                                <option value="None">None</option>
                            </select>
                        </div>

                        </div>

                </div>

                <div className="slider-section">
                    <p className="slider-question">How would you rate {userData.email}?</p>
                    <input type="range" min="0" max="10" name="slider1" value={formData.slider1} onChange={handleChange} className="custom-slider"/>
                    <p className="slider-number">{formData.slider1}</p>

                    <input type="range" min="0" max="10" name="slider2" value={formData.slider2} onChange={handleChange} className="custom-slider"/>
                    <p className="slider-number">{formData.slider2}</p>

                    <input type="range" min="0" max="10" name="slider3" value={formData.slider3} onChange={handleChange} className="custom-slider"/>
                    <p className="slider-number">{formData.slider3}</p>

                    <input type="range" min="0" max="10" name="slider4" value={formData.slider4} onChange={handleChange} className="custom-slider"/>
                    <p className="slider-number">{formData.slider4}</p>

                    <input type="range" min="0" max="10" name="slider5" value={formData.slider5} onChange={handleChange} className="custom-slider"/>
                    <p className="slider-number">{formData.slider5}</p>

                    <input type="range" min="0" max="10" name="slider6" value={formData.slider6} onChange={handleChange} className="custom-slider"/>
                    <p className="slider-number">{formData.slider6}</p>

                    <input type="range" min="0" max="10" name="slider7" value={formData.slider7} onChange={handleChange} className="custom-slider"/>
                    <p className="slider-number">{formData.slider7}</p>

                    <input type="range" min="0" max="10" name="slider8" value={formData.slider8} onChange={handleChange} className="custom-slider"/>
                    <p className="slider-number">{formData.slider8}</p>

                    <input type="range" min="0" max="10" name="slider9" value={formData.slider9} onChange={handleChange} className="custom-slider"/>
                    <p className="slider-number">{formData.slider9}</p>
                </div>

                <div className="sentence-section">
                    <p className="sentence-question">Last, please write a single , short sentence that best describes {userData.email}'s demeanoar</p>
                    <textarea name="sentence" value={formData.sentence} onChange={handleChange} className="sentence-box" />
                </div>

                <button type="submit" className="continue-btn">
                    Submit Review
                </button>
            </form>

          <div className="welcome-div">
            <h1>USERPAGE</h1>
            <p>
              {userData.username} {userData.email}
            </p>
          </div>
        </>
      )}
    </>
  );
}

export default AddReview;
