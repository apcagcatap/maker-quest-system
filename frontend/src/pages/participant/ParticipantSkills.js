import React, { useEffect, useState } from 'react';
import { getMySkills } from '../../services/api';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';
import './ParticipantPages.css';

const ParticipantSkills = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      setLoading(true);
      const response = await getMySkills();
      setSkills(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading message="Loading your skills..." />;
  if (error) return <ErrorMessage message={error} onRetry={fetchSkills} />;

  return (
    <div className="container">
      <h1 style={{ marginBottom: '2rem' }}>My Skills</h1>
      
      {skills.length === 0 ? (
        <div className="alert alert-info">
          You haven't earned any skills yet. Complete quests to earn skills!
        </div>
      ) : (
        <div className="grid grid-3">
          {skills.map(ps => (
            <div key={ps.id} className="skill-card card">
              <div className="skill-icon">🎓</div>
              <h3>{ps.skill.name}</h3>
              <p>{ps.skill.description}</p>
              <div className="skill-meta">
                <small>Earned from: {ps.quest.title}</small>
                <small>Date: {new Date(ps.acquired_at).toLocaleDateString()}</small>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ParticipantSkills;