import React from 'react';
import { Star } from 'lucide-react';

const CriteriaMeter = ({ label, score, max = 5 }) => {
  const percentage = Math.min(100, Math.max(0, (score / max) * 100));

  return (
    <div className="criteria-card">
      <div className="criteria-top">
        <span className="criteria-name">{label}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Star size={16} fill="#F59E0B" color="#F59E0B" />
          <span className="criteria-score-text">{Number(score).toFixed(1)}</span>
        </div>
      </div>
      <div className="criteria-meter-bg">
        <div
          className="criteria-meter-fill"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default CriteriaMeter;
