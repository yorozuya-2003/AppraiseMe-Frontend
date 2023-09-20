import React from 'react'
import '../styles/header.css';

export default function Header() {
  
  return (
    
    <header className='header_div'>
      <h2>AppraiseMe</h2>
      <button>Find Talent</button>
      <button>Show Skills</button>
      <button>Why AppraiseMe</button>
      <input type="text" id="searchInput" placeholder="Search..."></input>
      <button>Log In</button>
      <button id='Signup'>Sign Up</button>
      
    </header>
  )
}
