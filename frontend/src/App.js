import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing_page from './components/Landing_page';
import Onboarding from './components/Onboarding';
import Onboarding_newuser0 from './components/Onboarding_newuser0';

function App() {
  return (
    <Router>
      <Routes>
        
        <Route path="/" element={<Landing_page />} />
        <Route path="/start" element={<Onboarding />} />
        <Route path="/signin" element={<Onboarding_newuser0 />} />
        
      </Routes>
    </Router>
  );
}

export default App;
