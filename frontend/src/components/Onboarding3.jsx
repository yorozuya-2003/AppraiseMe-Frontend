import React from 'react';
import '../styles/onboarding_3.css';

function Employment() {
  return (
    <div className='employment'>
        <h1> <img src="" alt=""/> 👔 Add any previous <br/> employment history</h1>
        <div className='employment-box'>
          <div className='employment-box-contents'>
              <h4 id='work-experience'>Work Experience-1</h4>
            <form className='employment-form' action="">
                <div className='title'>
                  <input type="text" placeholder="Title"/>
                </div>
                
                <div className='company'>
                  <input type="text" placeholder="Employment Type"/>
                  <input type="text" placeholder="Company Name"/>
                </div>

                <div className='location'>
                  <input type="text" placeholder="Location"/>
                  <input type="text" placeholder="Location Type"/>
                </div>

                <div className='currently'>
                  <input type="radio"/>
                  <label>I am currently working in this role</label>
                </div>

                <div className='continue'>
                  <button className="continue-btn" type="submit">Continue</button>
                  <div className='faq-div'>
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
