import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navigation.css';

const Navigation = ({ userType, currentUser }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    navigate('/login');
  };

  return (
    <nav className="navigation">
      <div className="container nav-container">
        <Link to="/" className="nav-brand">
          <h1>MAKER Quest System</h1>
        </Link>
        
        <div className="nav-links">
          {!currentUser ? (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="nav-link btn-primary">Register</Link>
            </>
          ) : (
            <>
              {userType === 'participant' && (
                <>
                  <Link to="/participant/events" className="nav-link">Events</Link>
                  <Link to="/participant/my-quests" className="nav-link">My Quests</Link>
                  <Link to="/participant/skills" className="nav-link">My Skills</Link>
                </>
              )}
              
              {userType === 'facilitator' && (
                <>
                  <Link to="/facilitator/events" className="nav-link">Manage Events</Link>
                  <Link to="/facilitator/quests" className="nav-link">Manage Quests</Link>
                  <Link to="/facilitator/skills" className="nav-link">Manage Skills</Link>
                  <Link to="/facilitator/validate" className="nav-link">Validate Tasks</Link>
                </>
              )}
              
              <span className="nav-user">Welcome, {currentUser.username}</span>
              <button onClick={handleLogout} className="btn btn-outline">
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;