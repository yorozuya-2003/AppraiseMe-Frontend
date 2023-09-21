import React from 'react';
import '../styles/onboarding_1.css';

function SignIn() {
  return (
    <div className='SignIn_div'>
        <h1 className="heading"> <img src="" alt="" /> 🚀 Sign in to continue</h1>
        <form action="" className='signup-form'>
            <input type="text" placeholder="Email Address"/>
            <input type="text" placeholder="Password"/>
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
