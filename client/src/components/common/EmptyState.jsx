import React from 'react';
import { PackageOpen } from 'lucide-react';
import Button from './Button';

const EmptyState = ({
  icon: Icon = PackageOpen,
  title = 'No records found',
  description = 'There are no items to display at this moment.',
  actionText,
  onAction,
}) => {
  return (
    <div className="empty-state">
      <div className="empty-icon-wrapper">
        <Icon size={32} />
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
      {actionText && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
