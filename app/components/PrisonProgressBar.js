import React from 'react';
import Confetti from 'react-confetti';

const PrisonProgressBar = ({ totalHolders, largestPrisonPopulation, translate }) => {
  const progressPercentage = ((totalHolders / largestPrisonPopulation) * 100 || 0).toFixed(2);
  const isComplete = progressPercentage >= 100;

  return (
    <div className="status-bar">
      {isComplete && <Confetti />}
      <p>{translate('holdersCompared')} {largestPrisonPopulation}</p>
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