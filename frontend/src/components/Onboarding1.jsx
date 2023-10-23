import React, { useState } from 'react';
import '../styles/onboarding_1.css';
import axios from 'axios';
import API_BASE_URL from './apiConfig';
import { Link } from 'react-router-dom';


function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginSuccess, setLoginSuccess] = useState(false);

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${API_BASE_URL}/user_login/`, { email, password });
            if (response.status === 200) {
                setLoginSuccess(true);
                console.log('Login successful');
            } else {
                console.log('Login failed');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className='SignIn_div'>
            <h1 className="heading">🚀 Sign in to continue</h1>
            <form onSubmit={handleLoginSubmit} className='signup-form'>
                <input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">Login</button>
                <p></p>
                <button className='linkedin' id='useaccount'><img src="linkedin-logo-linkedin-icon-transparent-free-png 1.png" alt="" /> Continue with LinkedIn</button>
                <button className='google' id ='useaccount'><img src="Google__G__Logo 1.png" alt="" /> Continue with Google</button>
                <h4>Don't have an account ? <Link to='/signup'>Sign up</Link></h4>
                {loginSuccess && <p>Login successful!</p>}
            </form>
        </div>
    );
}

export default SignIn;
