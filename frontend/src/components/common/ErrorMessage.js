import React from 'react';

const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div className="alert alert-error">
      <p><strong>Error:</strong> {message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;