import React, { useState } from 'react';
import '../styles/onboarding_1.css';
import axios from 'axios';
import API_BASE_URL from './apiConfig';


function SignIn() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
      const { name, value } = e.target;
      console.log(formData);
      setFormData({...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(`${API_BASE_URL}/`, formData);
            console.log('User created:', response.data);
            // Optionally, you can reset the form after a successful submission
            setFormData({
                email: '',
                password: ''
            });
        } catch (error) {
            console.error('Error creating user:', error);
        }
    };

    return (
        <div className='SignIn_div'>
            <h1 className="heading">🚀 Sign in to continue</h1>
            <form onSubmit={handleSubmit} className='signup-form'>
                <input
                    type="text"
                    placeholder="Email Address"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                />
                <input
                    type="password"
                    placeholder="Password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                />
                <button type="submit">Sign Up</button>
                <p></p>
                <button className='linkedin' id='useaccount'><img src="linkedin-logo-linkedin-icon-transparent-free-png 1.png" alt="" /> Continue with LinkedIn</button>
                <button className='google' id ='useaccount'><img src="Google__G__Logo 1.png" alt="" /> Continue with Google</button>
                <h4>Already have an account ? Log In</h4>
            </form>
        </div>
    );
}

export default SignIn;
