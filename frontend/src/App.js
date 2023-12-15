import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import Onboarding from "./components/Onboarding";
import SignUp from "./components/Signup";
import SignIn from "./components/SignIn";
import Details from "./components/Details";
import Employment from "./components/Employment";
import HomePage from "./components/Home";
import AddExperience from "./components/AddExperience";
import Editdetails from "./components/Editdetails";
import AddReview from "./components/AddReview";
import MyReviews from "./components/MyReviews";
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
        <Route path="/addexp" element={<AddExperience />} />
        <Route path="/editdetails" element={<Editdetails />} />
        <Route path="/myreviews" element={<MyReviews />} />
        <Route path="/user/:username" element={<UserProfile/ >} />
        <Route path="/addreview/:username" element={<AddReview />} />
      </Routes>
    </Router>
  );
}

export default App;
