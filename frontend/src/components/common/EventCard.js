import React from 'react';
import { Link } from 'react-router-dom';
import './EventCard.css';

const EventCard = ({ event, userType }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const linkTo = userType === 'facilitator' 
    ? `/facilitator/events/${event.id}`
    : `/participant/events/${event.id}`;

  return (
    <div className="event-card card">
      <div className="event-card-header">
        <h3>{event.title}</h3>
        {event.is_active && (
          <span className="badge badge-success">Active</span>
        )}
      </div>
      
      <p className="event-description">{event.description}</p>
      
      <div className="event-details">
        <div className="event-detail-item">
          <span className="event-detail-label">📍 Location:</span>
          <span>{event.location}</span>
        </div>
        
        <div className="event-detail-item">
          <span className="event-detail-label">📅 Start:</span>
          <span>{formatDate(event.start_date)}</span>
        </div>
        
        <div className="event-detail-item">
          <span className="event-detail-label">📅 End:</span>
          <span>{formatDate(event.end_date)}</span>
        </div>
        
        {event.quest_count !== undefined && (
          <div className="event-detail-item">
            <span className="event-detail-label">🎯 Quests:</span>
            <span>{event.quest_count}</span>
          </div>
        )}
      </div>
      
      <Link to={linkTo} className="btn btn-primary event-card-button">
        View Details
      </Link>
    </div>
  );
};

export default EventCard;