import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navigation from './components/common/Navigation';
import Loading from './components/common/Loading';

// Import styles
import './styles/global.css';

// Auth Pages (we'll create these)
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Participant Pages (we'll create these)
import ParticipantEvents from './pages/participant/ParticipantEvents';
import ParticipantEventDetail from './pages/participant/ParticipantEventDetail';
import ParticipantQuestDetail from './pages/participant/ParticipantQuestDetail';
import ParticipantMyQuests from './pages/participant/ParticipantMyQuests';
import ParticipantSkills from './pages/participant/ParticipantSkills';

// Facilitator Pages (we'll create these)
import FacilitatorEvents from './pages/facilitator/FacilitatorEvents';
import FacilitatorEventDetail from './pages/facilitator/FacilitatorEventDetail';
import FacilitatorQuests from './pages/facilitator/FacilitatorQuests';
import FacilitatorQuestDetail from './pages/facilitator/FacilitatorQuestDetail';
import FacilitatorSkills from './pages/facilitator/FacilitatorSkills';
import FacilitatorValidate from './pages/facilitator/FacilitatorValidate';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const savedUserType = localStorage.getItem('userType');
    
    if (token && savedUserType) {
      // TODO: Verify token with backend
      setUserType(savedUserType);
      setCurrentUser({ username: 'User' }); // Placeholder
    }
    
    setLoading(false);
  }, []);

  if (loading) {
    return <Loading message="Loading application..." />;
  }

  return (
    <Router>
      <div className="App">
        <Navigation userType={userType} currentUser={currentUser} />
        
        <main style={{ minHeight: 'calc(100vh - 80px)', paddingTop: '2rem' }}>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login setCurrentUser={setCurrentUser} setUserType={setUserType} />} />
            <Route path="/register" element={<Register />} />
            
            {/* Participant Routes */}
            <Route 
              path="/participant/events" 
              element={currentUser && userType === 'participant' ? <ParticipantEvents /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/participant/events/:id" 
              element={currentUser && userType === 'participant' ? <ParticipantEventDetail /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/participant/quests/:id" 
              element={currentUser && userType === 'participant' ? <ParticipantQuestDetail /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/participant/my-quests" 
              element={currentUser && userType === 'participant' ? <ParticipantMyQuests /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/participant/skills" 
              element={currentUser && userType === 'participant' ? <ParticipantSkills /> : <Navigate to="/login" />} 
            />
            
            {/* Facilitator Routes */}
            <Route 
              path="/facilitator/events" 
              element={currentUser && userType === 'facilitator' ? <FacilitatorEvents /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/facilitator/events/:id" 
              element={currentUser && userType === 'facilitator' ? <FacilitatorEventDetail /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/facilitator/quests" 
              element={currentUser && userType === 'facilitator' ? <FacilitatorQuests /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/facilitator/quests/:id" 
              element={currentUser && userType === 'facilitator' ? <FacilitatorQuestDetail /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/facilitator/skills"
element={currentUser && userType === 'facilitator' ? <FacilitatorSkills /> : <Navigate to="/login" />}
/>
<Route
path="/facilitator/validate"
element={currentUser && userType === 'facilitator' ? <FacilitatorValidate /> : <Navigate to="/login" />}
/>
{/* Default Route */}
        <Route 
          path="/" 
          element={
            currentUser 
              ? (userType === 'participant' ? <Navigate to="/participant/events" /> : <Navigate to="/facilitator/events" />)
              : <Navigate to="/login" />
          } 
        />
      </Routes>
    </main>
  </div>
</Router>
);
}

export default App;