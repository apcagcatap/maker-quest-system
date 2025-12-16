import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyProgress } from '../../services/api';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';
import './ParticipantPages.css';

const ParticipantMyQuests = () => {
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      setLoading(true);
      const response = await getMyProgress();
      setProgress(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading message="Loading your quests..." />;
  if (error) return <ErrorMessage message={error} onRetry={fetchProgress} />;

  return (
    <div className="container">
      <h1 style={{ marginBottom: '2rem' }}>My Quests</h1>
      
      {progress.length === 0 ? (
        <div className="alert alert-info">
          You haven't started any quests yet. 
          <Link to="/participant/events"> Browse events</Link> to get started!
        </div>
      ) : (
        <div className="progress-list">
          {progress.map(p => (
            <div key={p.id} className="progress-card card">
              <div className="progress-header">
                <h3>{p.quest.title}</h3>
                {p.is_completed ? (
                  <span className="badge badge-success">Completed ✓</span>
                ) : (
                  <span className="badge badge-primary">In Progress</span>
                )}
              </div>
              
              <div className="progress-bar-container">
                <div 
                  className="progress-bar" 
                  style={{ width: `${p.completion_percentage}%` }}
                >
                  {p.completion_percentage}%
                </div>
              </div>
              
              <div className="progress-stats">
                <span>
                  {p.task_completions.length} of {p.quest.tasks.length} tasks completed
                </span>
                <span>Started: {new Date(p.started_at).toLocaleDateString()}</span>
              </div>
              
              <Link 
                to={`/participant/quests/${p.quest.id}`}
                className="btn btn-outline"
                style={{ marginTop: '1rem' }}
              >
                View Quest
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ParticipantMyQuests;