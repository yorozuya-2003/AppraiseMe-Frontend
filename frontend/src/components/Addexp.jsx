import axios from 'axios';
import React, {useEffect, useState } from 'react';
import "../styles/addexp.css";
import API_BASE_URL from "./ApiConfig"
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';

function Addexp() {

    let loggedInUser = JSON.parse(localStorage.getItem("user"));
    let loggedInUserObject = null;
    const navigate = useNavigate();

    useEffect(() => {
        if (!loggedInUser) {
        navigate('/');
        }
        else {
            loggedInUserObject = loggedInUser.email;  
        }
    }, []);


    const [models, setModels] = useState([]);

    const fetchData = () => {
        axios.get(`http://127.0.0.1:8000/api/addwork/?email=${loggedInUserObject}`)
            .then(response => {
            setModels(response.data);
            // console.log(response.data);
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
        emp_type:'Full-time',
        company: '',
        location:'',
        location_type:'OnSite',
        currently_working:1,
        start_time:'',
        end_time:'',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        // console.log(formData);
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
            console.log(formData)
            axios.post(`http://127.0.0.1:8000/api/addwork/`, formData)
            .then(response => {
                console.log('Experience added successfully:', response.data);
                setFormData({
                    email:loggedInUserObject,
                    title: '',
                    emp_type:'Full-time',
                    company: '',
                    location:'',
                    location_type:'OnSite',
                    currently_working:1,
                    start_time:'',
                    end_time:'',
                });
                fetchData();
            })
            .catch(error => {
                console.log('Error adding Work:', error);
            })
        } catch (error) {
            console.error('Error Adding Work:', error);
        }
    };

    

    const [isAddDivVisible, setIsAddDivVisible] = useState(false);

    const toggleAddDiv = () => {
        setIsAddDivVisible(!isAddDivVisible);
    };

    const buttonLabel = isAddDivVisible ? 'Not Needed' : 'Add more work Experience ';

    const handleDelete = (index) => {
        console.log(models[index]);
        axios.delete('http://127.0.0.1:8000/api/addwork/', { data: models[index] })
        .then(response => {
            if (response.status === 200) {
                // Update your local state to reflect the deletion
                const updatedModels = [...models];
                updatedModels.splice(index, 1);
                setModels(updatedModels);
            }
        })
        .catch(error => {
            console.error('Error deleting item', error);
        });
    };

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
                <button onClick={() => handleDelete(index)}>Delete</button>
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
      <button onClick={toggleAddDiv} className='addbutton' id="addbutton">{buttonLabel}</button>
      <Link style={{textDecoration: 'none'}} to='/home'>
      <button className="continue-btn" type="submit">
        Continue
      </button>
      </Link>
    </div>
  );
}

export default Addexp;
