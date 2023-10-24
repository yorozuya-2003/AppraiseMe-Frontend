import React, { useState, useEffect } from 'react';
import '../styles/onboarding_1.css';
import axios from 'axios';
import API_BASE_URL from './apiConfig';
import { Link, useNavigate, Navigate } from 'react-router-dom';


function SignIn() {
    const [user, setUser] = useState(null);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const loggedInUser = localStorage.getItem('user');
        if (loggedInUser) {
            setUser(JSON.parse(loggedInUser));
        }
    }, []);

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${API_BASE_URL}/user_login/`, { email, password });
            if (response.status === 200) {
                const loggedInUser = response.data;
                setLoginError('');
                console.log('Login successful');
                localStorage.setItem('user', JSON.stringify(loggedInUser));
                navigate('/home');
            }
        } catch (error) {
            console.error('Error:', error);
            const response = error.response;
            if (response.status === 401) {
                setLoginError('Invalid credentials. Please check your email and password.');
            } else if (response.status === 400) {
                setLoginError('Email is not registered.');
            }
        }
    };

    return (
        <>
        {user ? (
            <Navigate to="/home" />
        ): (
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
            </form>
            {loginError && <p className="error-message">{loginError}</p>}
        </div>
        )};
        </>
    );
}

export default SignIn;
