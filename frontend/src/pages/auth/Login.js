import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Auth.css';

const Login = ({ setCurrentUser, setUserType }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // TODO: Replace with actual API call
      // For now, simulate login
      
      // Demo users:
      // participant / participant123
      // facilitator / facilitator123
      
      if (formData.username === 'participant' && formData.password === 'participant123') {
        localStorage.setItem('token', 'demo-token-participant');
        localStorage.setItem('userType', 'participant');
        setUserType('participant');
        setCurrentUser({ username: 'participant' });
        navigate('/participant/events');
      } else if (formData.username === 'facilitator' && formData.password === 'facilitator123') {
        localStorage.setItem('token', 'demo-token-facilitator');
        localStorage.setItem('userType', 'facilitator');
        setUserType('facilitator');
        setCurrentUser({ username: 'facilitator' });
        navigate('/facilitator/events');
      } else {
        setError('Invalid credentials. Try: participant/participant123 or facilitator/facilitator123');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card card">
        <h2>Login to MAKER</h2>
        <p className="auth-subtitle">Access your quest management system</p>
        
        {error && <div className="alert alert-error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              type="text"
              name="username"
              className="form-input"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className="form-input"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary auth-button"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <p className="auth-footer">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
        
        <div className="auth-demo">
          <p><strong>Demo Accounts:</strong></p>
          <p>Participant: participant / participant123</p>
          <p>Facilitator: facilitator / facilitator123</p>
        </div>
      </div>
    </div>
  );
};

export default Login;