import axios from 'axios';
import React, {useEffect, useState } from 'react';
import "../styles/addexp.css";

function Addexp() {

    const loggedInUser = localStorage.getItem("user");
    const loggedInUserObject = 'tt@gmail.com'
    const [models, setModels] = useState([]);

    const fetchData = () => {
        axios.get(`http://127.0.0.1:8000/api/addwork/?email=${loggedInUserObject}`)
            .then(response => {
            setModels(response.data);
            console.log(response.data);
        })
            .catch(error => {
            console.error(error);
        });
    };

    useEffect(() => {
        fetchData();
    }, [loggedInUserObject]);

    const [formData, setFormData] = useState({
        email:loggedInUserObject,
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
                email:loggedInUserObject,
                company: '',
                title: '',
                location:'',
                emp_type:'',
                location_type:'',
                currently_working:1,
                start_time:'',
                end_time:'',
            });
            fetchData();
        } catch (error) {
            console.error('Error Adding Details:', error);
        }
    };


    const [isAddDivVisible, setIsAddDivVisible] = useState(false);

    const toggleAddDiv = () => {
        setIsAddDivVisible(!isAddDivVisible);
    };

    const buttonLabel = isAddDivVisible ? 'Not Needed' : 'Add Work';

  return (
    <div className="addexp">
      <h1>👔 Add any previous employment history</h1>
        
      {models.map((model, index) => (
            <div className="addexp-box">
                <p>Work Experience: {index+1}</p>
                <p>Title: <br /> {model.title}</p>
                <p>Company: <br /> {model.company}</p>
                <p>Employement type: <br /> {model.emp_type}</p>
                <p>Location: <br /> {model.location}</p>
                <p>Location type: <br /> {model.location_type}</p>
                <button>Edit</button>
                <button>Delete</button>
            </div>
      ))}
      
      <div className="addexp-box" id="add_div" style={{ display: isAddDivVisible ? 'block' : 'none' }}>
        <div className="addexp-box-contents">
        <form onSubmit={handleSubmit} className="addexp-form" action="">

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
                Add Work
              </button>
            </div>
          </form>
        </div>
      </div>
      <button onClick={toggleAddDiv} id="addbutton">{buttonLabel}</button>
    </div>
  );
}

export default Addexp;
