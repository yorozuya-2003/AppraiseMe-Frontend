import { useState, useEffect, React } from "react";
import axios from 'axios';
import Header from "./Header";
import "../styles/home.css";
import useCheckProfileCompletion from "./checkProfileCompletion";
import API_BASE_URL from "./ApiConfig";
import { useNavigate } from "react-router-dom";

function HomePage() {
  useCheckProfileCompletion();
  let loggedInUser = JSON.parse(localStorage.getItem("user"));
  let userEmail = null;
  const navigate = useNavigate();
  
  const [workModel, setWorkModel] = useState([]);
  const [profileModel, setProfileModel] = useState([]);
  const [reviewModel, setReviewModel] = useState([]);

  if (!loggedInUser) {
    navigate('/');
  }
  else {
    userEmail = loggedInUser.email;  
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [workModelResponse, profileModelResponse, reviewModelResponse] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/addwork/?email=${userEmail}`),
          axios.get(`${API_BASE_URL}/api/addprofile/?Email=${userEmail}`),
          axios.get(`${API_BASE_URL}/get_reviews/${userEmail}`)
        ]);
  
        setWorkModel(workModelResponse.data);
        setProfileModel(profileModelResponse.data);
        setReviewModel(reviewModelResponse.data.reviews);
      
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
    console.log(Email);
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
  
  const toggleAddDiv = () => {
      setIsAddDivVisible(!isAddDivVisible);
  };

  const buttonLabel = isAddDivVisible ? 'Show Less' : 'Show More';

  return (
        <div className="home">
          <header>
            <Header></Header>
          </header>
          
          <div className="homediv1">
          
            <img src="microsoft.png" alt="" />
            {profileModel.map((model, index) =>(
              <p style={{textTransform:'capitalize'}}>{model.First_name} {model.Second_name}</p>
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
              
              <p style={{
                fontFamily:'Inter',
                fontSize: '22px',
                fontWeight: 500,
                marginBottom:'9px'
              }}>Senior Interaction Designer</p>
              
              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim ea minima accusamus unde debitis reprehenderit ad, dicta qui temporibus vitae fuga, vero error quia quisquam, necessitatibus dolorem fugit! Repudiandae error dolorum rem consequatur illo? Deleniti nesciunt natus dolor, deserunt ipsam sunt quibusdam quos sed unde. Deserunt numquam ducimus illum atque nobis eligendi necessitatibus explicabo non dicta ipsum eum eaque incidunt fuga velit corrupti ipsam quas omnis perferendis, quaerat impedit expedita saepe quos officia natus? Iure consequuntur accusantium quae adipisci officiis at repellat harum sapiente. Hic laboriosam, commodi maiores facere repellat earum voluptatibus dolores voluptas fugiat, corporis delectus molestiae aliquid at!</p>
              
              <div className="attributes">

                <p style={{
                  fontSize: '22px',
                  fontWeight: 500,
                  marginBottom: '0.5px',
                }}>Key Attributes</p>
                
                <p style={
                  {fontSize: '12px',
                  fontWeight: 350,
                  marginTop:'0.5px',
                  color: '#4A4A4A',
                  marginBottom:'25px'
                  }}>What best describes Vinay</p>

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
                
                <p style={
                  {fontSize: '12px',
                  fontWeight: 350,
                  marginTop:'0.5px',
                  marginBottom:'25px',
                  color: '#4A4A4A'
                }}>What other users say about Vinay</p>

                {reviewModel.map((model, index) =>(
                  
                  <div>
                    <div style={{display:'flex',flexDirection:'row',width:'187px',gap:'12px'}}>
                      <img src="microsoft.png" alt="" />
                      <p style={
                        {fontSize: '18px',
                        fontWeight: 500,
                        marginBottom:'11px',
                      }}>{model.from_user_first_name} {model.from_user_last_name}</p>
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