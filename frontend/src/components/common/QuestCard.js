import React from 'react';
import { Link } from 'react-router-dom';
import './QuestCard.css';

const QuestCard = ({ quest, userType, showEvent = false }) => {
  const getDifficultyClass = (difficulty) => {
    return `badge-${difficulty.toLowerCase()}`;
  };

  const linkTo = userType === 'facilitator'
    ? `/facilitator/quests/${quest.id}`
    : `/participant/quests/${quest.id}`;

  return (
    <div className="quest-card card">
      <div className="quest-card-header">
        <h3>{quest.title}</h3>
        <span className={`badge ${getDifficultyClass(quest.difficulty)}`}>
          {quest.difficulty}
        </span>
      </div>
      
      <p className="quest-description">{quest.description}</p>
      
      <div className="quest-meta">
        {quest.task_count !== undefined && (
          <div className="quest-meta-item">
            <span>📝 {quest.task_count} Tasks</span>
          </div>
        )}
        
        {quest.skills && quest.skills.length > 0 && (
          <div className="quest-meta-item">
            <span>🎓 Skills:</span>
            <div className="quest-skills">
              {quest.skills.map(skill => (
                <span key={skill.id} className="badge badge-primary">
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <Link to={linkTo} className="btn btn-primary quest-card-button">
        {userType === 'facilitator' ? 'Manage Quest' : 'View Quest'}
      </Link>
    </div>
  );
};

export default QuestCard;