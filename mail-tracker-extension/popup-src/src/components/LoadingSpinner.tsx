import React from "react";

const LoadingSpinner: React.FC = () => {
  return (
    <div className="loading-container">
      <div className="loading-content">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
