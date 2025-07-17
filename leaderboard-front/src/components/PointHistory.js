import React from 'react';

const PointHistory = ({ history }) => {
  if (!history || history.length === 0) {
    return <div>No history available</div>;
  }

  return (
    <div>
      {history.map((item, index) => (
        <div key={index} className="history-item">
          <span>+{item.points} points</span>
          <span>{new Date(item.createdAt).toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
};

export default PointHistory;
