import { useState, useEffect, React } from "react";
import { Link } from "react-router-dom";
import Header from "./Header";
import "../styles/landing_page.css";

function HomePage() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    }
  }, []);

  return (
    // <>
    //   {user ? (
        <div>
          <header>
            <Header></Header>
          </header>
          <div className="welcome-div">
            <h1>HOMEPAGE</h1>
            {user && <p>Logged in as: {user.username} {user.email}</p>}
            <Link to="/start">
              <button className="get-started-btn">Get Started</button>
            </Link>

            <p>Trusted by</p>

            <div>
              <img src="microsoft.png" alt="" />
              <img src="airbnb.png" alt="" />
            </div>
          </div>
        </div>
    //   ) : (
    //     <Navigate to="/signin" />
    //   )}
    // </>
  );
}

export default HomePage;
