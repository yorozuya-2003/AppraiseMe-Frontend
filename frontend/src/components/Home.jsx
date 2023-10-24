import { useState, useEffect, React } from 'react';
// import axios from 'axios';
import Header from './Header';
import '../styles/landing_page.css';
import { Link } from 'react-router-dom';
// import API_BASE_URL from './apiConfig';

function HomePage() {
    const [user, setUser] = useState(null);
  useEffect(() => {
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) {
        setUser(JSON.parse(loggedInUser));
    }
  }, []);

  return (
    <div>
      <header>
        <Header></Header>
      </header>
      <div className='Welcome_div'>
        <h1>HOMEPAGE</h1>
        {user && <p>Logged in as: {user.username}</p>}
        <Link to="/start">
          <button className='getStartedButton'>Get Started</button>
        </Link>

        <p>Trusted by</p>

        <div>
          <img src="microsoft.png" alt="" />
          <img src="airbnb.png" alt="" />
        </div>
      </div>
    </div>
  );
}

export default HomePage;
