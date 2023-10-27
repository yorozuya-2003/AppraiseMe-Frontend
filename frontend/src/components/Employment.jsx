import axios from 'axios';
import React, { useState } from 'react';
import "../styles/employment.css";

function Employment() {
  const loggedInUser = localStorage.getItem("user");
  const loggedInUserObject = JSON.parse(loggedInUser);

  const [formData, setFormData] = useState({
    email:loggedInUserObject.email,
    title: '',
    company: '',
    location:'',
    emp_type:'',
    location_type:'',
    currently_working:1,
    start_time:'',
    end_time:'',
  });

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
          const response = await axios.post(`http://127.0.0.1:8000/api/addwork/`, formData);
          console.log('Details added:', response.data);
          setFormData({
              email:loggedInUserObject.email,
              company: '',
              title: '',
              location:'',
              emp_type:'',
              location_type:'',
              currently_working:1,
              start_time:'',
              end_time:'',
          });
      } catch (error) {
          console.error('Error Adding Details:', error);
      }
  };

  return (
    <div className="employment">
      <h1>
        {" "}
        <img src="" alt="" /> 👔 Add any previous <br /> employment history
      </h1>
      <div className="employment-box">
        <div className="employment-box-contents">
          <h4 id="work-experience">Work Experience-1</h4>
          <form onSubmit={handleSubmit} className="employment-form" action="">

            <div className="title">
              <input type="text" name='title' value={formData.title} onChange={handleChange} placeholder="Title" />
            </div>

            <div className='emp_type'>

                <select name='emp_type' value={formData.emp_type} onChange={handleChange}>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                </select>

            </div>

            <div className="company">
              <input type="text" name='company' value={formData.company} onChange={handleChange} placeholder="Company Name" />
            </div>

            <div className="location" >
              <input type="text" name='location' value={formData.location} onChange={handleChange} placeholder="Location" />
            </div>

            <div className='location_type'>

                <select name='location_type' value={formData.location_type} onChange={handleChange}>
                    <option value="Onsite">OnSite</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Remote">Remote</option>
                </select>

            </div>

            <div className="currently">
              <input type="radio" name="currently_working" value={formData.currently_working} onChange={handleChange}/>
              <label>I am currently working in this role</label>
            </div>

            <input type="date" name='start_time' value={formData.start_time} onChange={handleChange}/>

            <input type="date" name='end_time' value={formData.end_time} onChange={handleChange}/>

            <div className="continue">
              <button className="continue-btn" type="submit">
                Continue
              </button>
              <div className="faq-div">
                <h4>Don't have any prior experience? Skip</h4>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Employment;
