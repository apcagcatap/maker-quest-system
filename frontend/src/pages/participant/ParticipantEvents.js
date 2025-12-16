import React, { useEffect, useState } from 'react';
import { getActiveEvents } from '../../services/api';
import EventCard from '../../components/common/EventCard';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';

const ParticipantEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await getActiveEvents();
      setEvents(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading message="Loading events..." />;
  if (error) return <ErrorMessage message={error} onRetry={fetchEvents} />;

  return (
    <div className="container">
      <h1 style={{ marginBottom: '2rem' }}>Active Events</h1>
      
      {events.length === 0 ? (
        <div className="alert alert-info">
          No active events at the moment. Check back later!
        </div>
      ) : (
        <div className="grid grid-2">
          {events.map(event => (
            <EventCard key={event.id} event={event} userType="participant" />
          ))}
        </div>
      )}
    </div>
  );
};

export default ParticipantEvents;