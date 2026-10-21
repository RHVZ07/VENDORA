import React from 'react';

const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'purple', // purple, pink, emerald, amber, blue
  trend,
  className = '',
}) => {
  return (
    <div className={`stat-card ${className}`}>
      <div className="stat-info">
        <span className="stat-label">{title}</span>
        <span className="stat-value">{value}</span>
        {subtitle && (
          <span className="stat-subtitle">
            {trend && <span className={`trend-tag ${trend > 0 ? 'up' : 'down'}`}></span>}
            {subtitle}
          </span>
        )}
      </div>
      {Icon && (
        <div className={`stat-icon-wrapper ${color}`}>
          <Icon size={24} />
        </div>
      )}
    </div>
  );
};

export default StatCard;
