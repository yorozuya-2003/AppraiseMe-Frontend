import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Onboarding from './components/Onboarding0';
import SignIn from './components/Onboarding1';
import Details from './components/Onboarding2';
import Employment from './components/Onboarding3';

function App() {
  return (
    <Router>
      <Routes>
        
        <Route path="/" element={<LandingPage />} />
        <Route path="/start" element={<Onboarding />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/details" element={<Details />} />
        <Route path="/employment" element={<Employment />} />
      </Routes>
    </Router>
  );
}

export default App;
