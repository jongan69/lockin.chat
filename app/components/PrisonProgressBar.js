import React from 'react';

const PrisonProgressBar = ({ totalHolders, largestPrisonPopulation, translate }) => {
  const progressPercentage = ((totalHolders / largestPrisonPopulation) * 100 || 0).toFixed(2);

  return (
    <div className="status-bar">
      <p>{translate('holdersCompared')} {totalHolders}</p>
      <div className="progress-bar">
        <div
          className="progress"
          style={{
            width: `${progressPercentage}%`,
          }}
        ></div>
      </div>
      <p>{progressPercentage}% {translate('progressComplete')}</p>
    </div>
  );
};

export default PrisonProgressBar; 