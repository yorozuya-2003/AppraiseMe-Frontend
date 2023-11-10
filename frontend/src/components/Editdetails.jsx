import React, {useEffect, useState } from 'react';
import '../styles/editdetails.css';
import axios from 'axios';
import API_BASE_URL from './ApiConfig';
import { Link, useHistory } from 'react-router-dom'; 

function Details() {

    const loggedInUser = localStorage.getItem("user");
    const loggedInUserObject = 'loggedInUser@email.com'
    const [models, setModels] = useState([]);

    const fetchData = () => {
        axios.get(`http://127.0.0.1:8000/api/addprofile/?email=${loggedInUserObject}`)
            .then(response => {
            setModels(response.data);
            const data = response.data; // Assuming the response is an object with the profile data

            setFormData({
                Email: data[0].Email,
                First_name: data[0].First_name,
                Second_name: data[0].Second_name,
                DOB: data[0].DOB,
                Gender: data[0].Gender,
                Pronouns: data[0].Pronouns,
            });
            console.log(data);
        })
            .catch(error => {
            console.error(error);
        });
    };
    
    const [formData, setFormData] = useState({
        Email: loggedInUserObject,
        First_name: '',
        Second_name: '',
        DOB:'',
        Gender: '',
        Pronouns: '',
    });

    useEffect(() => {
        fetchData();
    }, [loggedInUserObject]);
    

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
            const response = await axios.post(`http://127.0.0.1:8000/api/addprofile/`, formData);
            console.log('Details added:', response.data);
            setFormData({
                Email:loggedInUserObject.email,
                First_name: '',
                Second_name: '',
                DOB:'',
                Gender:'',
                Pronouns:'',
            });
        } catch (error) {
            console.error('Error Adding Details:', error);
        }
    };

    return (
        <div className='editdetails'>
            <h1> <img src="" alt=""/> Edit your Experience<br/></h1>
            <form onSubmit={handleSubmit} className='editdetails-form' action="">            
                <div className='editdetails-box'>
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
