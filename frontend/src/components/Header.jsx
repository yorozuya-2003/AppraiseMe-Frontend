import React from 'react'
import {Link} from 'react-router-dom'
import { useState, useEffect } from 'react';
import '../styles/header.css';

export default function Header() {

  const [user, setUser] = useState(null);
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

  return (
    <header className='header_div'>
      <h2>AppraiseMe</h2>
      <button>Find Talent</button>
      <button>Show Skills</button>
      <button>Why AppraiseMe</button>
      <input type="text" id="searchInput" placeholder="Search..."></input>
      {user ? 
        (<button id='Signup' onClick={handleLogout}>Log Out</button>)
        : (
        <>
        <button> <Link to="/signin">Log In</Link></button>
        <button id='Signup'><Link to="/signup">Sign Up</Link></button>
        </>
      )}
  
    </header>
  )
}
