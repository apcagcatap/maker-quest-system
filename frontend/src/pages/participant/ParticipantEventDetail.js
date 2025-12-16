import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getEvent, getEventQuests } from '../../services/api';
import QuestCard from '../../components/common/QuestCard';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';
import './ParticipantPages.css';

const ParticipantEventDetail = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [quests, setQuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        setLoading(true);
        const [eventResponse, questsResponse] = await Promise.all([
          getEvent(id),
          getEventQuests(id)
        ]);
        setEvent(eventResponse.data);
        setQuests(questsResponse.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchEventDetails();
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      const [eventResponse, questsResponse] = await Promise.all([
        getEvent(id),
        getEventQuests(id)
      ]);
      setEvent(eventResponse.data);
      setQuests(questsResponse.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading message="Loading event details..." />;
  if (error) return <ErrorMessage message={error} onRetry={fetchEventDetails} />;
  if (!event) return <ErrorMessage message="Event not found" />;

  return (
    <div className="container">
      <Link to="/participant/events" className="back-link">← Back to Events</Link>
      
      <div className="event-detail-header">
        <div>
          <h1>{event.title}</h1>
          {event.is_active && <span className="badge badge-success">Active</span>}
        </div>
      </div>
      
      <div className="event-detail-info card">
        <p className="event-detail-description">{event.description}</p>
        
        <div className="event-detail-meta">
          <div className="meta-item">
            <span className="meta-label">📍 Location:</span>
            <span>{event.location}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">📅 Start:</span>
            <span>{new Date(event.start_date).toLocaleString()}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">📅 End:</span>
            <span>{new Date(event.end_date).toLocaleString()}</span>
          </div>
        </div>
      </div>
      
      <h2 style={{ marginTop: '2rem', marginBottom: '1rem' }}>Available Quests</h2>
      
      {quests.length === 0 ? (
        <div className="alert alert-info">
          No quests available for this event yet.
        </div>
      ) : (
        <div className="grid grid-2">
          {quests.map(quest => (
            <QuestCard key={quest.id} quest={quest} userType="participant" />
          ))}
        </div>
      )}
    </div>
  );
};

export default ParticipantEventDetail;