import React from 'react';

const LoadingSpinner = ({ text = 'Loading...', size = 'md' }) => {
  return (
    <div className="spinner-wrapper">
      <div className={`spinner ${size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : ''}`}></div>
      {text && <span className="spinner-text">{text}</span>}
    </div>
  );
};

export default LoadingSpinner;
