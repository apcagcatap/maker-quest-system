import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getQuest, startQuest } from '../../services/api';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';
import './ParticipantPages.css';

const ParticipantQuestDetail = () => {
  const { id } = useParams();
  const [quest, setQuest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    fetchQuest();
  }, [id]);

  const fetchQuest = async () => {
    try {
      setLoading(true);
      const response = await getQuest(id);
      setQuest(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStartQuest = async () => {
    try {
      setStarting(true);
      await startQuest(id);
      alert('Quest started! You can now complete tasks.');
      // Refresh quest data
      fetchQuest();
    } catch (err) {
      alert('Failed to start quest: ' + err.message);
    } finally {
      setStarting(false);
    }
  };

  if (loading) return <Loading message="Loading quest..." />;
  if (error) return <ErrorMessage message={error} onRetry={fetchQuest} />;
  if (!quest) return <ErrorMessage message="Quest not found" />;

  const getDifficultyClass = (difficulty) => {
    return `badge-${difficulty.toLowerCase()}`;
  };

  return (
    <div className="container">
      <Link to={`/participant/events/${quest.event}`} className="back-link">
        ← Back to Event
      </Link>
      
      <div className="quest-detail-header">
        <h1>{quest.title}</h1>
        <span className={`badge ${getDifficultyClass(quest.difficulty)}`}>
          {quest.difficulty}
        </span>
      </div>
      
      <div className="quest-detail-card card">
        <div className="quest-section">
          <h3>Description</h3>
          <p>{quest.description}</p>
        </div>
        
        {quest.ai_generated_story && (
          <div className="quest-section">
            <h3>📖 Story</h3>
            <p className="quest-story">{quest.ai_generated_story}</p>
          </div>
        )}
        
        <div className="quest-section">
          <h3>🎓 Skills You'll Learn</h3>
          <div className="skill-badges">
            {quest.skills.map(skill => (
              <div key={skill.id} className="skill-badge">
                <strong>{skill.name}</strong>
                <span>{skill.description}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="quest-section">
          <h3>📝 Tasks ({quest.tasks.length})</h3>
          <div className="task-list">
            {quest.tasks.map((task, index) => (
              <div key={task.id} className="task-item card">
                <div className="task-number">{index + 1}</div>
                <div className="task-content">
                  <h4>{task.title}</h4>
                  <p>{task.description}</p>
                  {task.ai_generated_context && (
                    <p className="task-context">💡 {task.ai_generated_context}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <button 
          onClick={handleStartQuest}
          className="btn btn-primary"
          style={{ width: '100%', justifyContent: 'center', marginTop: '2rem' }}
          disabled={starting}
        >
          {starting ? 'Starting Quest...' : 'Start Quest'}
        </button>
      </div>
    </div>
  );
};

export default ParticipantQuestDetail;