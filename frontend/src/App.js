import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Onboarding from './components/Onboarding0';
import SignIn from './components/Onboarding1';
import Details from './components/Onboarding2';
import Employment from './components/Onboarding3';

import SignUp from './components/Signup';


function App() {
  return (
    <Router>
      <Routes>
        
        <Route path="/" element={<LandingPage />} />
        <Route path="/start" element={<Onboarding />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/details" element={<Details />} />
        <Route path="/employment" element={<Employment />} />

        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </Router>
  );
}

export default App;

// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import LandingPage from './components/LandingPage';
// import Onboarding from './components/Onboarding0';
// import SignIn from './components/Onboarding1';
// import Details from './components/Onboarding2';
// import Employment from './components/Onboarding3';

// import SignUp from './components/Signup';
// import API_BASE_URL from './components/apiConfig';

// function App() {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   useEffect(() => {
//     checkAuthenticationStatus();
//   }, []);

//   const checkAuthenticationStatus = () => {
//     axios.get(`${API_BASE_URL}/check_authentication/`)
//       .then(response => {
//         setIsAuthenticated(response.data.authenticated);
//       })
//       .catch(error => {
//         console.error('Error checking authentication:', error);
//       });
//   };

//   return (
//     <Router>
//         <Routes>
//             <Route path="/" element={<LandingPage />} />
//             <Route path="/start" element={<Onboarding />} />

//             {isAuthenticated ? (
//                     <>
//                         <Route path="/signin" element={<Navigate to="/" />} />
//                         <Route path="/signup" element={<Navigate to="/" />} />
//                     </>
//                 ) : (
//                     <>
//                         <Route path="/signin" element={<SignIn />} />
//                         <Route path="/signup" element={<SignUp />} />
//                     </>
//                 )
//             }

//             <Route
//                 path="/details"
//                 element={
//                     isAuthenticated ? <Details /> : <Navigate to="/signup" />
//                 }
//             />
//             <Route
//                 path="/employment"
//                 element={
//                     isAuthenticated ? <Employment /> : <Navigate to="/signup" />
//                 }
//             />
//         </Routes>
//     </Router>
//   );
// }

// export default App;
