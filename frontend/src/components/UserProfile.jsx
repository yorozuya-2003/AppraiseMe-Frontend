import { React, useState, useEffect } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import axios from "axios";
import useCheckProfileCompletion from "./checkProfileCompletion";
import API_BASE_URL from "./ApiConfig";
import Header from "./Header";
import "../styles/landing_page.css";

function UserProfile() {
  useCheckProfileCompletion();
  const { username } = useParams();
  const [userData, setUserData] = useState(null);

  const [workModel, setWorkModel] = useState([]);
  const [profileModel, setProfileModel] = useState([]);
  const [reviewModel, setReviewModel] = useState([]);

  const [isAddDivVisible, setIsAddDivVisible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await axios.get(`${API_BASE_URL}/user/${username}/`);
        setUserData(userResponse.data);
  
        const [workModelResponse, profileModelResponse, reviewModelResponse] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/addwork/?email=${userResponse.data.email}`),
          axios.get(`${API_BASE_URL}/api/addprofile/?Email=${userResponse.data.email}`),
          axios.get(`${API_BASE_URL}/get_reviews/${userResponse.data.email}`)
        ]);
  
        setWorkModel(workModelResponse.data);
        setProfileModel(profileModelResponse.data);
        setReviewModel(reviewModelResponse.data.reviews);
      } catch (error) {
        console.error(error);
      }
    };
  
    fetchData();
  }, [username]);
  

  if (!userData) {
    // return <Navigate to="/" />
    return <div>Loading...</div>; 
  }

  const averageSlider1 = reviewModel.reduce((total, model) => total + model.slider1, 0) / reviewModel.length;
  const averageSlider2 = reviewModel.reduce((total, model) => total + model.slider2, 0) / reviewModel.length;
  const averageSlider3 = reviewModel.reduce((total, model) => total + model.slider3, 0) / reviewModel.length;
  const averageSlider4 = reviewModel.reduce((total, model) => total + model.slider4, 0) / reviewModel.length;
  const averageSlider5 = reviewModel.reduce((total, model) => total + model.slider5, 0) / reviewModel.length;
  const averageSlider6 = reviewModel.reduce((total, model) => total + model.slider6, 0) / reviewModel.length;
  const averageSlider7 = reviewModel.reduce((total, model) => total + model.slider7, 0) / reviewModel.length;
  const averageSlider8 = reviewModel.reduce((total, model) => total + model.slider8, 0) / reviewModel.length;
  const averageSlider9 = reviewModel.reduce((total, model) => total + model.slider9, 0) / reviewModel.length;
  
  const toggleAddDiv = () => {
      setIsAddDivVisible(!isAddDivVisible);
  };

  const buttonLabel = isAddDivVisible ? 'Show Less' : 'Show More';

  let isCurrentUserProfile = false;
  const localStorageUser = JSON.parse(localStorage.getItem("user"));
  if (localStorageUser) {
    isCurrentUserProfile = userData.username === localStorageUser.username;
  }

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
          
          <div className="homediv1" style={{marginBottom:'160px',marginTop:'10px'}}>
          
            {profileModel.map((model, index) =>(
              <div style={{display:'flex',flexDirection:'row'}}>
              <img
                src={model.Image ? `${model.Image}` : `${API_BASE_URL}/media/profile_images/default_avatar.jpg`}
                alt=""
                style={{ width: '150px', height: '150px', borderRadius: '75px', marginRight: '35px' }}
              />
                <p style={{textTransform:'capitalize'}}>{model.First_name} {model.Second_name}</p>
              </div>
            ))}
          
          </div>

          <div className="homediv3">

            <div className="experiences">
            
            <p style={{
              fontFamily: 'Inter',
              fontSize: '20px',
              fontWeight: 500,
              marginBottom:'40px',
            }}>Previous Experiences</p>

            {workModel.map((model, index) => (
                <div style={{}} className="">
                    <p style={{marginBottom:'1px'}}>{model.title}</p>
                    <p style={{fontSize: '16px',fontWeight: 300, color: '#4A4A4A', marginBottom:'20px'}}>{model.company}, {model.location}, {model.location_type} </p>
                </div>
              ))}
            </div>

            <div className="about">
              
              <div style={{display:'flex',flexDirection:'row',justifyContent:'space-between', alignItems:'center',marginBottom:'12px'}}>
                {profileModel.map((model, index) =>(
                  <p style={{
                    fontSize: '23px',
                    fontWeight: 500,
                  }}>About {model.First_name} </p>
                ))}

                <Link style={{textDecoration: 'none'}} to={`/addreview/${userData.username}`}>
                  <button style={{padding:'15px 20px', marginTop:'0px'}} 
                  className="continue-btn" type="submit">
                    Review
                  </button>
                </Link>
              </div>
              
              {profileModel.map((model, index) =>(
                <p style={{fontSize:'17px',marginBottom:'20px'}}>{model.Bio} </p>
              ))}

              <div className="attributes">

                <p style={{
                  fontSize: '22px',
                  fontWeight: 500,
                  marginBottom: '0.5px',
                }}>Key Attributes</p>
                
                {profileModel.map((model, index) =>(
                <p style={
                  {fontSize: '12px',
                  fontWeight: 350,
                  marginTop:'0.5px',
                  color: '#4A4A4A',
                  marginBottom:'25px'
                  }}>What best describes {model.First_name}</p>
                ))}

                  <div style={{marginBottom:'50px'}}>
                    <p style={{marginBottom:'10px',fontSize:'20px',fontWeight:400}} className="slider-question">Communication</p>
                    <input style={{marginBottom:'0px',marginLeft:'15px'}} type="range" min="0" max="10" name="slider1" value={averageSlider1}  className="custom-slider"/>
                    <div style={{marginTop:'0px',padding:'0px',fontWeight:100,fontSize:'12px'}}>
                      <p style={{margin:0, display:'inline', float:'left'}}>Introspective</p>
                      <p style={{margin:0,marginRight:100, display:'inline', float:'right'}}>Greagrious</p>
                    </div>
                  </div>

                  <div style={{marginBottom:'50px'}}>
                    <p style={{marginBottom:'10px',fontSize:'20px',fontWeight:400}} className="slider-question">Thought Process</p>
                    <input style={{marginBottom:'0px',marginLeft:'15px'}} type="range" min="0" max="10" name="slider1" value={averageSlider2}  className="custom-slider"/>
                    <div style={{marginTop:'0px',padding:'0px',fontWeight:100,fontSize:'12px'}}>
                      <p style={{margin:0, display:'inline', float:'left'}}>Introspective</p>
                      <p style={{margin:0,marginRight:100, display:'inline', float:'right'}}>Greagrious</p>
                    </div>
                  </div>

                  <div style={{marginBottom:'50px'}}>
                    <p style={{marginBottom:'10px',fontSize:'20px',fontWeight:400}} className="slider-question">Teamwork & Management</p>
                    <input style={{marginBottom:'0px',marginLeft:'15px'}} type="range" min="0" max="10" name="slider1" value={averageSlider3}  className="custom-slider"/>
                    <div style={{marginTop:'0px',padding:'0px',fontWeight:100,fontSize:'12px'}}>
                      <p style={{margin:0, display:'inline', float:'left'}}>Introspective</p>
                      <p style={{margin:0,marginRight:100, display:'inline', float:'right'}}>Greagrious</p>
                    </div>
                  </div>
                  
                  <div style={{marginBottom:'50px',display: isAddDivVisible ? 'block' : 'none'}}>
                    <p style={{marginBottom:'10px',fontSize:'20px',fontWeight:400}} className="slider-question">Communication</p>
                    <input style={{marginBottom:'0px',marginLeft:'15px'}} type="range" min="0" max="10" name="slider1" value={averageSlider4}  className="custom-slider"/>
                    <div style={{marginTop:'0px',padding:'0px',fontWeight:100,fontSize:'12px'}}>
                      <p style={{margin:0, display:'inline', float:'left'}}>Introspective</p>
                      <p style={{margin:0,marginRight:100, display:'inline', float:'right'}}>Greagrious</p>
                    </div>
                  </div>

                  <div style={{marginBottom:'50px',display: isAddDivVisible ? 'block' : 'none'}}>
                    <p style={{marginBottom:'10px',fontSize:'20px',fontWeight:400}} className="slider-question">Communication</p>
                    <input style={{marginBottom:'0px',marginLeft:'15px'}} type="range" min="0" max="10" name="slider1" value={averageSlider5}  className="custom-slider"/>
                    <div style={{marginTop:'0px',padding:'0px',fontWeight:100,fontSize:'12px'}}>
                      <p style={{margin:0, display:'inline', float:'left'}}>Introspective</p>
                      <p style={{margin:0,marginRight:100, display:'inline', float:'right'}}>Greagrious</p>
                    </div>
                  </div>

                  <div style={{marginBottom:'50px',display: isAddDivVisible ? 'block' : 'none'}}>
                    <p style={{marginBottom:'10px',fontSize:'20px',fontWeight:400}} className="slider-question">Communication</p>
                    <input style={{marginBottom:'0px',marginLeft:'15px'}} type="range" min="0" max="10" name="slider1" value={averageSlider6}  className="custom-slider"/>
                    <div style={{marginTop:'0px',padding:'0px',fontWeight:100,fontSize:'12px'}}>
                      <p style={{margin:0, display:'inline', float:'left'}}>Introspective</p>
                      <p style={{margin:0,marginRight:100, display:'inline', float:'right'}}>Greagrious</p>
                    </div>
                  </div>

                  <div style={{marginBottom:'50px',display: isAddDivVisible ? 'block' : 'none'}}>
                    <p style={{marginBottom:'10px',fontSize:'20px',fontWeight:400}} className="slider-question">Communication</p>
                    <input style={{marginBottom:'0px',marginLeft:'15px'}} type="range" min="0" max="10" name="slider1" value={averageSlider7}  className="custom-slider"/>
                    <div style={{marginTop:'0px',padding:'0px',fontWeight:100,fontSize:'12px'}}>
                      <p style={{margin:0, display:'inline', float:'left'}}>Introspective</p>
                      <p style={{margin:0,marginRight:100, display:'inline', float:'right'}}>Greagrious</p>
                    </div>
                  </div>

                  <div style={{marginBottom:'50px',display: isAddDivVisible ? 'block' : 'none'}}>
                    <p style={{marginBottom:'10px',fontSize:'20px',fontWeight:400}} className="slider-question">Communication</p>
                    <input style={{marginBottom:'0px',marginLeft:'15px'}} type="range" min="0" max="10" name="slider1" value={averageSlider8}  className="custom-slider"/>
                    <div style={{marginTop:'0px',padding:'0px',fontWeight:100,fontSize:'12px'}}>
                      <p style={{margin:0, display:'inline', float:'left'}}>Introspective</p>
                      <p style={{margin:0,marginRight:100, display:'inline', float:'right'}}>Greagrious</p>
                    </div>
                  </div>

                  <div style={{marginBottom:'50px',display: isAddDivVisible ? 'block' : 'none'}}>
                    <p style={{marginBottom:'10px',fontSize:'20px',fontWeight:400}} className="slider-question">Communication</p>
                    <input style={{marginBottom:'0px',marginLeft:'15px'}} type="range" min="0" max="10" name="slider1" value={averageSlider9}  className="custom-slider"/>
                    <div style={{marginTop:'0px',padding:'0px',fontWeight:100,fontSize:'12px'}}>
                      <p style={{margin:0, display:'inline', float:'left'}}>Introspective</p>
                      <p style={{margin:0,marginRight:100, display:'inline', float:'right'}}>Greagrious</p>
                    </div>
                  </div>
                  
                  <button onClick={toggleAddDiv} style={{boxSizing:'19px', backgroundColor:'white',color:'blue',border:'none',paddingBottom:'20px',fontSize:'16px'}}>{buttonLabel}</button>
                
              </div>

              <div className="reviews">
                
                <p style={
                  {fontSize: '20px',
                  fontWeight: 500,
                  marginBottom: '0.5px',
                  }}>User Reviews</p>
                
                {profileModel.map((model, index) =>(
                <p style={
                  {fontSize: '12px',
                  fontWeight: 350,
                  marginTop:'0.5px',
                  marginBottom:'25px',
                  color: '#4A4A4A'
                }}>What other users say about {model.First_name}</p>
                ))}

                {reviewModel.map((model, index) =>(
                  
                  <div>
                    <div style={{display:'flex',flexDirection:'row',width:'187px',gap:'12px'}}>
                      <img src={model.Image ? `${model.Image}` : `${API_BASE_URL}/media/profile_images/default_avatar.jpg`} alt="" />
                      <p style={
                        {fontSize: '18px',
                        fontWeight: 500,
                        marginBottom:'11px',
                        textTransform:'capitalize'
                      }}>{model.from_user_name}</p>
                    </div>
                    <p style={{marginBottom:'20px',}}>{model.sentence}</p>
                  </div>
                ))}

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