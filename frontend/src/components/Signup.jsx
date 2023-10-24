import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import '../styles/onboarding_1.css';
import axios from 'axios';
import API_BASE_URL from './apiConfig';


function SignUp() {
    const [user, setUser] = useState(null);

    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordStrength, setPasswordStrength] = useState('');
    const [passwordsMatch, setPasswordsMatch] = useState(true);
    const [registrationStep, setRegistrationStep] = useState(1);

    const [message, setMessage] = useState('');

    useEffect(() => {
        const loggedInUser = localStorage.getItem('user');
        if (loggedInUser) {
            setUser(JSON.parse(loggedInUser));
        }
    }, []);

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        
        // const emailFormat = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
        // if (!email.match(emailFormat)) {
        //     setMessage('Invalid email format. Please enter a valid email address. ');
        //     return;
        // }
        // else{
        setMessage('');
        // }
    };
    
    const checkPasswordStrength = (password) => {
        if (password.length < 8) {
            setPasswordStrength('Password should be at least 8 characters long.');
        } else if (!/\d/.test(password)) {
            setPasswordStrength('Password should contain at least one digit.');
        } else if (!/[A-Z]/.test(password) || !/[a-z]/.test(password)) {
            setPasswordStrength('Password should contain both uppercase and lowercase letters.');
        } else {
            setPasswordStrength('Password is strong.');
        }
    };

    const handleEmailSubmit = async(e) => {
        e.preventDefault();

        try {
            const response = await axios.post(`${API_BASE_URL}/send_otp/`, { email });
            console.log(response);
            if (response.status === 200) {
                setRegistrationStep(2);
            } else {
                console.log('Error sending OTP:', response);
            }
        } catch (error) {
            console.error('Error sending OTP:', error);
            var response = error.response;
            if (response.status === 400 && response.data.message === 'Email already exists') {
                setMessage('Email is already registered. Please sign in instead. ');
            } else if (response.status === 400 && response.data.message === 'Email not provided') {
                setMessage('Please enter an email address.');
            }
        }
    }

    const handleOtpSubmit = async(e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${API_BASE_URL}/verify_otp/`, { email, otp });
            if (response.status === 200) {
                setRegistrationStep(3);
            } else {
                console.log('Error verifying OTP:', response);
            }
        }
        catch (error) {
            console.error('Error verifying OTP:', error);
        }
    }

    const handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        checkPasswordStrength(newPassword);
        checkPasswordsMatch(confirmPassword, newPassword);
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
        checkPasswordsMatch(password, e.target.value);
    };

    const checkPasswordsMatch = (password, confirmPassword) => {
        if (password === confirmPassword && passwordStrength==='Password is strong.') {
            setPasswordsMatch(true);
        } else {
            setPasswordsMatch(false);
        }
    };

    const handlePasswordSubmit = async(e) => {
        e.preventDefault();
        if (password === confirmPassword) {
            try {
                const response = await axios.post(`${API_BASE_URL}/register_user/`, { email, password });
                if (response.status === 201) {
                    const newUser = response.data;
                    setUser(newUser);
                    localStorage.setItem('user', JSON.stringify(newUser));

                    setRegistrationStep(4);
                } else {
                    console.log('Error registering user:', response.data.error);
                    setPasswordStrength(response.data.error)
                }
            }
            catch (error) {
                console.error('Error registering user:', error);
            }
        }
        else {
            console.log('Passwords do not match');
        }
    }

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    return (
        <div>
            {user ? (
                <Navigate to="/home" />
            ): (<>
            {registrationStep === 1 && (
                <div className='SignIn_div'>
                    <h1 className="heading">🚀 Sign up to continue</h1>
                    <form onSubmit={handleEmailSubmit} className='signup-form'>
                        <input
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={handleEmailChange}
                        />
                        <button type="submit">Send OTP</button>
                    </form>
                    {message && (
                        <div className="error-message">
                            {message}
                        </div>
                    )}
                    {message === 'Email is already registered. Please sign in instead. ' && 
                        <a href="/signin">Sign In</a>
                    }
                </div>
            )}

            {registrationStep === 2 && (
                <div className='SignIn_div'>
                    <h1 className="heading">Enter OTP</h1>
                    <form onSubmit={handleOtpSubmit} className='signup-form'>
                        <input
                            type="text"
                            placeholder="OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                        />
                        <button type="submit">Verify OTP</button>
                    </form>
                </div>
            )}

            {registrationStep === 3 && (
                <div className='SignIn_div'>
                    <h1 className="heading">Create Password</h1>
                    <form onSubmit={handlePasswordSubmit} className='signup-form'>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={handlePasswordChange}
                        />
                        <div className="password-strength">{passwordStrength}</div>
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={handleConfirmPasswordChange}
                        />
                        {(password !== '') && (passwordsMatch ? <div className="password-mismatch">Passwords match successfully!</div> : (
                        <div className="password-mismatch">Passwords do not match.</div>
                        ))}
                        <button type="submit">Create Account</button>
                    </form>
                </div>
            )}
        </>
        )}
        </div>
    );
}

export default SignUp;
