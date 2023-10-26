import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import Onboarding from "./components/Onboarding";
import SignUp from "./components/Signup";
import SignIn from "./components/SignIn";
import Details from "./components/Details";
import Employment from "./components/Employment";
import HomePage from "./components/Home";

import UserProfile from "./components/UserProfile";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/start" element={<Onboarding />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/details" element={<Details />} />
        <Route path="/employment" element={<Employment />} />
        <Route path="/home" element={<HomePage />} />

        <Route path="/user/:username" element={<UserProfile/ >} />
      </Routes>
    </Router>
  );
}

export default App;
