import React from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import '../styles/onboarding_0.css';

function Onboarding() {
  return (
    <div>
      <header>
        <Header></Header>
      </header>
      <div className='Joining_div'>
        <h1>Join as a Candidate or a Recruiter</h1>

        <div className='button_class'>

            <div className='joining_buttons'>
                <div className='recruiter_button'>
                    <label >I am a recruiter, looking to hire.</label>
                    <input type="radio" ></input>
                </div>
                
                <div className='candidate_button'>
                    <label>I am a candidate, looking for opportunity.</label>
                    <input type="radio" ></input>
                </div>
            </div>

            <div className='continue_part'>
                <Link to="/signin">
                    <button id='continue_button'>Continue</button>
                </Link>
                <h4>Already have an account? </h4>
            </div>
            
        </div>
      </div>
    </div>
  );
}

export default Onboarding;
