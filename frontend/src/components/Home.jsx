import { useState, useEffect, React } from "react";
import axios from 'axios';
import Header from "./Header";
import "../styles/home.css";
import "../styles/user_profile.css";
import useCheckProfileCompletion from "./checkProfileCompletion";
import API_BASE_URL from "./ApiConfig";
import { useNavigate,Link } from "react-router-dom";
import { ReactComponent as CopyURL } from './add_link.svg'

function HomePage() {
  useCheckProfileCompletion();
  let loggedInUser = JSON.parse(localStorage.getItem("user"));
  let userEmail = null;
  const navigate = useNavigate();
  
  const [workModel, setWorkModel] = useState([]);
  const [profileModel, setProfileModel] = useState([]);
  const [reviewModel, setReviewModel] = useState([]);

  console.log(loggedInUser)

  useEffect(() => {
    if(loggedInUser){
      userEmail = loggedInUser.email;
    }
    else {
      navigate('/');
    }
  }, [loggedInUser]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [workModelResponse, profileModelResponse, reviewModelResponse] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/addwork/?email=${userEmail}`),
          axios.get(`${API_BASE_URL}/api/addprofile/?Email=${userEmail}`),
          axios.get(`${API_BASE_URL}/get_reviews/${userEmail}`, { params: { email: userEmail } })
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
  
  const averageSlider1 = reviewModel.reduce((total, model) => total + model.slider1, 0) / reviewModel.length;
  const averageSlider2 = reviewModel.reduce((total, model) => total + model.slider2, 0) / reviewModel.length;
  const averageSlider3 = reviewModel.reduce((total, model) => total + model.slider3, 0) / reviewModel.length;
  const averageSlider4 = reviewModel.reduce((total, model) => total + model.slider4, 0) / reviewModel.length;
  const averageSlider5 = reviewModel.reduce((total, model) => total + model.slider5, 0) / reviewModel.length;
  const averageSlider6 = reviewModel.reduce((total, model) => total + model.slider6, 0) / reviewModel.length;
  const averageSlider7 = reviewModel.reduce((total, model) => total + model.slider7, 0) / reviewModel.length;
  const averageSlider8 = reviewModel.reduce((total, model) => total + model.slider8, 0) / reviewModel.length;
  const averageSlider9 = reviewModel.reduce((total, model) => total + model.slider9, 0) / reviewModel.length;
  
  const [userProfiles, setUserProfiles] = useState([]);
  
  const fetchUserProfiles = (userEmails) => {
  // console.log(userEmails)
  userEmails.map(Email => {
    // console.log(Email);
    // axios.get(`{$API _API_BASE_URL}/api/addprofile/?Email=${Email}`)
    //   .then(response => {
    //     setUserProfiles(prevProfiles => [...prevProfiles, response.data]);
    //   })
    //   .catch(error => {
    //     console.error(error);
    //   });
    });
  };

  useEffect(() => {
    const userEmails = reviewModel.map(model => model.from_user);
    // console.log(userEmails)
    fetchUserProfiles(userEmails);
  }, [reviewModel]);
  
  const [isAddDivVisible, setIsAddDivVisible] = useState(false);
  const [bioInput, setBioInput] = useState(profileModel.Bio);
  
  const toggleAddDiv = () => {
    setIsAddDivVisible(!isAddDivVisible);
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

      setProfileModel(prevProfileModel => {
        return prevProfileModel.map(profile => {
          if (profile.Email === userEmail) {
            return { ...profile, Bio: bioInput };
          }
          return profile;
        });
      });
      
      setIsAddDivVisible(false);
    } catch (error) {
      console.error('Error updating Bio:', error);
    }
  };
  
  const buttonLabel = isAddDivVisible ? 'Save Bio' : 'Edit Bio';
  
  const [isAddDivVisible2, setIsAddDivVisible2] = useState(false);
  
  const toggleAddDiv2 = () => {
    setIsAddDivVisible2(!isAddDivVisible2);
  };
  
  const buttonLabel2 = isAddDivVisible2 ? 'Show Less' : 'Show More';
  const [imageinput, setImageInput] = useState(null);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
  
    if (file) {
      // Validate file type
      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        // Display an alert for an invalid file type
        alert('Please select a valid image file (png, jpg, or jpeg).');
        return;
      }
  
      try {
        const formData = new FormData();
        formData.append('image', file);
  
        const response = await axios.post(`${API_BASE_URL}/update_image/${userEmail}/`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
  
        // Assuming the API returns the updated model with the new image path
        const updatedModel = response.data;
  
        setProfileModel(prevProfileModel => {
          return prevProfileModel.map(profile => (profile.Email === userEmail ? updatedModel : profile));
        });
  
        window.location.reload();
      } catch (error) {
        console.error('Error updating Image:', error);
      }
    }
  };
  

  const handleCopyURL = () => {
    // const url = window.location.href;
    const url = `http://localhost:3000/user/${loggedInUser.username}`
    navigator.clipboard.writeText(url);
    alert("URL copied to clipboard");
  };

  return (
        <div className="home">
          <header>
            <Header></Header>
          </header>
          
          <div className="homediv1" style={{marginBottom:'160px',marginTop:'10px'}}>

            {profileModel.map((model, index) =>{
              console.log("Image Path:", model.Image);
              return(

                <div style={{display:'flex',flexDirection:'row'}}>

                  <div style={{display:'flex',flexDirection:'column', marginRight:'25px'}}>
                  <img
                    src={model.Image ? `${model.Image}` : `${API_BASE_URL}/media/profile_images/default_avatar.jpg`}
                    alt=""
                    style={{ width: '150px', height: '150px', borderRadius: '75px', marginRight: '35px' }}
                  />
                  <label className="continue-btn" style={{ marginTop: '15px', padding: '5px', fontSize: '15px', backgroundColor: 'ButtonShadow', color: 'black' }}>
                    Change Image
                    <input type="file" accept=".jpeg, .jpg, .png, application/json" name="imageinput" id="imageinput" style={{ display: 'none' }} onChange={handleImageChange} />
                  </label>
                  </div>
                  <p>{model.First_name} {model.Second_name}</p>
                </div>
              );
            })}

          </div>

          <div className="homediv3">

            <div className="experiences">
            
            <div style={{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>

              <p style={{
                fontFamily: 'Inter',
                fontSize: '20px',
                fontWeight: 500,
                marginBottom:'40px',
              }}>Previous Experiences</p>

              <Link style={{textDecoration: 'none'}} to={'/addexp'}>
                <button
                    id="addbutton"
                    style={{ padding: '0px 20px',fontSize:'13px',height:'30px' }}
                    className="continue-btn"
                    type="button" // Set type to "button" to prevent form submission
                  >
                    Add +
                </button>
              </Link>

            </div>
            
            {workModel.map((model, index) => (
                <div style={{}} className="">
                    <p style={{marginBottom:'1px'}}>{model.title}</p>
                    <p style={{fontSize: '16px',fontWeight: 300, color: '#4A4A4A', marginBottom:'20px'}}>{model.company}, {model.location}, {model.location_type} </p>
                </div>
              ))}
            </div>


            <div className="about">

            <div style={{justifyContent:'space-between',display:'flex',flexDirection:'row'}}>

              {profileModel.map((model, index) =>(
                <p style={{
                  fontSize: '23px',
                  fontWeight: 500,
                  marginBottom: '15px',
                }}>About {model.First_name} </p>
              ))}

              <div className="buttons">
                  <button 
                    className="url-btn" type="button" onClick={handleCopyURL}>
                      <CopyURL />
                    </button>

                <button
                  onClick={isAddDivVisible ? handleSaveBio : toggleAddDiv}
                  id="addbutton"
                  className="review-btn"
                  type="button"
                  style={{height:'35px',width:'125px'}}
                >
                  {buttonLabel}
                </button>
              </div>
            </div>
              
            <div style={{ display: !isAddDivVisible ? 'flex' : 'none', flexDirection: 'column',marginTop:'10px',paddingTop:'10px' }}>
                
                {profileModel.map((model, index) =>(
                  <p style={{fontSize:'17px',marginBottom:'20px',marginLeft:'7px'}}>{model.Bio} </p>
                ))}
              </div>

              <div style={{ display: isAddDivVisible ? 'flex' : 'none', flexDirection: 'column', marginBottom:'10px',padding:'7px',borderRadius:'5px' }}>
                <input style={{padding:'7px',borderRadius:'9px'}} type="text" value={bioInput} onChange={handleInputChange} />
              </div>

              
              <div className="attributes">

                <p style={{
                  fontSize: '22px',
                  fontWeight: 500,
                  marginBottom: '25px',
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
                  
                  <div style={{marginBottom:'50px',display: isAddDivVisible2 ? 'block' : 'none'}}>
                    <p style={{marginBottom:'10px',fontSize:'20px',fontWeight:400}} className="slider-question">Communication</p>
                    <input style={{marginBottom:'0px',marginLeft:'15px'}} type="range" min="0" max="10" name="slider1" value={averageSlider4}  className="custom-slider"/>
                    <div style={{marginTop:'0px',padding:'0px',fontWeight:100,fontSize:'12px'}}>
                      <p style={{margin:0, display:'inline', float:'left'}}>Introspective</p>
                      <p style={{margin:0,marginRight:100, display:'inline', float:'right'}}>Greagrious</p>
                    </div>
                  </div>

                  <div style={{marginBottom:'50px',display: isAddDivVisible2 ? 'block' : 'none'}}>
                    <p style={{marginBottom:'10px',fontSize:'20px',fontWeight:400}} className="slider-question">Communication</p>
                    <input style={{marginBottom:'0px',marginLeft:'15px'}} type="range" min="0" max="10" name="slider1" value={averageSlider5}  className="custom-slider"/>
                    <div style={{marginTop:'0px',padding:'0px',fontWeight:100,fontSize:'12px'}}>
                      <p style={{margin:0, display:'inline', float:'left'}}>Introspective</p>
                      <p style={{margin:0,marginRight:100, display:'inline', float:'right'}}>Greagrious</p>
                    </div>
                  </div>

                  <div style={{marginBottom:'50px',display: isAddDivVisible2 ? 'block' : 'none'}}>
                    <p style={{marginBottom:'10px',fontSize:'20px',fontWeight:400}} className="slider-question">Communication</p>
                    <input style={{marginBottom:'0px',marginLeft:'15px'}} type="range" min="0" max="10" name="slider1" value={averageSlider6}  className="custom-slider"/>
                    <div style={{marginTop:'0px',padding:'0px',fontWeight:100,fontSize:'12px'}}>
                      <p style={{margin:0, display:'inline', float:'left'}}>Introspective</p>
                      <p style={{margin:0,marginRight:100, display:'inline', float:'right'}}>Greagrious</p>
                    </div>
                  </div>

                  <div style={{marginBottom:'50px',display: isAddDivVisible2 ? 'block' : 'none'}}>
                    <p style={{marginBottom:'10px',fontSize:'20px',fontWeight:400}} className="slider-question">Communication</p>
                    <input style={{marginBottom:'0px',marginLeft:'15px'}} type="range" min="0" max="10" name="slider1" value={averageSlider7}  className="custom-slider"/>
                    <div style={{marginTop:'0px',padding:'0px',fontWeight:100,fontSize:'12px'}}>
                      <p style={{margin:0, display:'inline', float:'left'}}>Introspective</p>
                      <p style={{margin:0,marginRight:100, display:'inline', float:'right'}}>Greagrious</p>
                    </div>
                  </div>

                  <div style={{marginBottom:'50px',display: isAddDivVisible2 ? 'block' : 'none'}}>
                    <p style={{marginBottom:'10px',fontSize:'20px',fontWeight:400}} className="slider-question">Communication</p>
                    <input style={{marginBottom:'0px',marginLeft:'15px'}} type="range" min="0" max="10" name="slider1" value={averageSlider8}  className="custom-slider"/>
                    <div style={{marginTop:'0px',padding:'0px',fontWeight:100,fontSize:'12px'}}>
                      <p style={{margin:0, display:'inline', float:'left'}}>Introspective</p>
                      <p style={{margin:0,marginRight:100, display:'inline', float:'right'}}>Greagrious</p>
                    </div>
                  </div>

                  <div style={{marginBottom:'50px',display: isAddDivVisible2 ? 'block' : 'none'}}>
                    <p style={{marginBottom:'10px',fontSize:'20px',fontWeight:400}} className="slider-question">Communication</p>
                    <input style={{marginBottom:'0px',marginLeft:'15px'}} type="range" min="0" max="10" name="slider1" value={averageSlider9}  className="custom-slider"/>
                    <div style={{marginTop:'0px',padding:'0px',fontWeight:100,fontSize:'12px'}}>
                      <p style={{margin:0, display:'inline', float:'left'}}>Introspective</p>
                      <p style={{margin:0,marginRight:100, display:'inline', float:'right'}}>Greagrious</p>
                    </div>
                  </div>
                  
                  <button onClick={toggleAddDiv2} style={{boxSizing:'19px', backgroundColor:'white',color:'blue',border:'none',paddingBottom:'20px',fontSize:'16px'}}>{buttonLabel2}</button>
                
              </div>

              <div className="reviews">
                
                <p style={
                  {fontSize: '20px',
                  fontWeight: 500,
                  marginBottom: '0.5px',
                  }}>User Reviews</p>
                
                {profileModel.map((model, index) => (
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
                      <Link to={`/user/${model.from_user_name}/`}>
                        <img src="microsoft.png" alt="" />
                        <p style={
                          {fontSize: '18px',
                          fontWeight: 500,
                          marginBottom:'11px',
                        }}>{model.from_user_name}</p>
                      </Link>
                    </div>
                    <p style={{marginBottom:'20px',}}>{model.sentence}</p>
                  </div>
                ))}

              </div>
            </div>
          </div>
        </div>
  );
}

export default HomePage;