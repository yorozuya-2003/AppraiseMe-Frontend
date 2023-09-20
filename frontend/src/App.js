import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Onboarding from './components/Onboarding0';
import SignIn from './components/Onboarding1';

function App() {
  return (
    <Router>
      <Routes>
        
        <Route path="/" element={<LandingPage />} />
        <Route path="/start" element={<Onboarding />} />
        <Route path="/signin" element={<SignIn />} />
        
      </Routes>
    </Router>
  );
}

export default App;
