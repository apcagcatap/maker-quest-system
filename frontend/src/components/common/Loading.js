import React from 'react';

const Loading = ({ message = 'Loading...' }) => {
  return (
    <div style={{ textAlign: 'center', padding: '3rem' }}>
      <div className="spinner"></div>
      <p style={{ marginTop: '1rem', color: 'var(--gray-600)' }}>{message}</p>
    </div>
  );
};

export default Loading;