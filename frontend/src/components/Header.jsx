import { React, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/header.css";

export default function Header() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    }
  }, []);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <header className="header-div">
      <h2>AppraiseMe</h2>
      <button>Find Talent</button>
      <button>Show Skills</button>
      <button>Why AppraiseMe</button>
      <input type="text" id="search-input" placeholder="Search..."></input>
      {user ? (
        <button id="signup" onClick={handleLogout}>
          Log Out
        </button>
      ) : (
        <>
          <button id="signin">
            {" "}
            <Link to="/signin">Log In</Link>
          </button>
          <button id="signup">
            <Link to="/signup">Sign Up</Link>
          </button>
        </>
      )}
    </header>
  );
}
