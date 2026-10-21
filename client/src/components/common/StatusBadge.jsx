import React from 'react';

const StatusBadge = ({ status, size = 'md' }) => {
  if (!status) return null;

  const normalized = status.toUpperCase().replace(/\s+/g, '-');

  let badgeClass = 'badge-pending';

  switch (normalized) {
    case 'ACTIVE':
    case 'APPROVED':
    case 'VERIFIED':
    case 'COMPLETED':
      badgeClass = 'badge-active';
      break;
    case 'UNDER-REVIEW':
    case 'PROCESSING':
      badgeClass = 'badge-under-review';
      break;
    case 'SHIPPED':
      badgeClass = 'badge-shipped';
      break;
    case 'DELIVERED':
      badgeClass = 'badge-delivered';
      break;
    case 'REJECTED':
    case 'SUSPENDED':
    case 'CANCELLED':
      badgeClass = 'badge-rejected';
      break;
    case 'PENDING':
    case 'PENDING-APPROVAL':
    case 'DRAFT':
    default:
      badgeClass = 'badge-pending';
      break;
  }

  const formatText = (text) => {
    return text.replace(/-/g, ' ');
  };

  return (
    <span className={`badge ${badgeClass} ${size === 'sm' ? 'badge-sm' : ''}`}>
      <span className="badge-dot"></span>
      {formatText(status)}
    </span>
  );
};

export default StatusBadge;
