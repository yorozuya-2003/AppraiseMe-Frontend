import React, { useEffect, useState } from 'react';
import '../styles/details.css';
import axios from 'axios';
import API_BASE_URL from './ApiConfig';
import { useNavigate } from 'react-router-dom';

function Details() {
  const navigate = useNavigate();
  const loggedInUser = localStorage.getItem("user");
  const loggedInUserObject = JSON.parse(loggedInUser);
  
  const [formData, setFormData] = useState({
    Email:null,
    First_name: '',
    Second_name: '',
    DOB:'',
    Gender:'Male',
    Pronouns:'His/Him',
  });
  
  useEffect(() => {
    if (!loggedInUserObject){
      navigate('/');
    }
    else {
      formData.Email = loggedInUserObject.email;
    }
  }, []);


  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(formData);
    setFormData({...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
      e.preventDefault();

      const isAnyFieldEmpty = Object.values(formData).some(field => field === '');

      if (isAnyFieldEmpty) {
        
        console.error('Error: All fields must be filled');
        return;
      }

      try {
          const response = await axios.post(`${API_BASE_URL}/api/addprofile/`, formData);
          console.log('Details added:', response.data);
          setFormData({
              Email:loggedInUserObject.email,
              First_name: '',
              Second_name: '',
              DOB:'',
              Gender:'Male',
              Pronouns:'His/Him',
          });
      } catch (error) {
          console.error('Error Adding Details:', error);
      }
  };

  return (
    <div className='details'>
        <h1> <img src="" alt=""/> 👋🏾 Tell us a <br/>   little about yourself</h1>
        <form onSubmit={handleSubmit} className='details-form' action="">            
            <div className='details-box'>
              <div className='preferred-pronouns'>

                <select name='Pronouns' value={formData.Pronouns} onChange={handleChange}>
                    <option value="His/Him">His/Him</option>
                    <option value="Her/She">Her/She</option>
                    <option value="They/Their">They/Their</option>
                    <option value="other">other</option>
                </select>

              </div>
              
              <div className='names'>
                <input type="text" placeholder="First Name" name='First_name' value={formData.First_name} onChange={handleChange}/>
                <input type="text" placeholder="Second Name" name='Second_name' value={formData.Second_name} onChange={handleChange}/>
              </div>

              <div className='dob-gender'>

                <input type="date" name='DOB' value={formData.DOB} onChange={handleChange}/>

                <select name='Gender' value={formData.Gender} onChange={handleChange}>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="other">Other</option>
                </select>
              
              </div>

              <div className='continue'>
                <button className="continue-btn" type="submit" >Continue</button>
                
                <div className='faq-div'>
                  <h4>Have a question? See our FAQ </h4>
                </div>
              </div>
            </div>
        </form>
    </div>
  );
}

export default Details;
