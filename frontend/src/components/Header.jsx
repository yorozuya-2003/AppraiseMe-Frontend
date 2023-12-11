import { React, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/header.css";
import API_BASE_URL from "./ApiConfig";
import axios from "axios";

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

  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const handleInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    axios.get(`${API_BASE_URL}/search-suggestions?q=${query}`)
      .then(response => {
        setSuggestions(response.data);
      })
      .catch(error => {
        console.error('Error fetching search suggestions:', error);
      });
  };

  const navigate = useNavigate();

  const handleSearch = () => {
    navigate(`/search?q=${searchQuery}`);
  }

  const handleSearchSuggestionClick = (suggestion) => {
    const username = `${suggestion.username}`;
    navigate(`/user/${username}`);
  };

  return (
    <header className="header-div">
      <h2>AppraiseMe</h2>
      <button>Why AppraiseMe</button>
      <button>Show Skills</button>
      <Link to='/editdetails'>
        <button>Edit Profile</button>
      </Link>

      <div className="search-container">
        <input
          type="text"
          id="search-input"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleInputChange}
          autoComplete="off"
        />
        {suggestions.length > 0 && (
          <ul className="suggestions">
            {suggestions.map((suggestion, index) => (
              <li key={index} onClick={() => handleSearchSuggestionClick(suggestion)}>
                {suggestion.first_name} {suggestion.last_name}
              </li>
            ))}
          </ul>
        )}
        <button id="search-button" onClick={handleSearch}>Search</button>
      </div>
      
      
      
      {user ? (
        <Link style={{textDecoration: 'none'}} to='/'>
          <button id="signup" onClick={handleLogout}>
            Log Out
          </button>
        </Link>
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
