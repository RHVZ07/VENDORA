import React from 'react';
import {
  FileText,
  Clock,
  CheckCircle2,
  Cpu,
  Truck,
  PackageCheck,
  CheckCheck,
  XCircle,
} from 'lucide-react';

const STATUS_STEPS = [
  { key: 'DRAFT', label: 'Draft', icon: FileText },
  { key: 'PENDING APPROVAL', label: 'Pending Approval', icon: Clock },
  { key: 'APPROVED', label: 'Approved', icon: CheckCircle2 },
  { key: 'PROCESSING', label: 'Processing', icon: Cpu },
  { key: 'SHIPPED', label: 'Shipped', icon: Truck },
  { key: 'DELIVERED', label: 'Delivered', icon: PackageCheck },
  { key: 'COMPLETED', label: 'Completed', icon: CheckCheck },
];

const POTimeline = ({ currentStatus, statusHistory = [] }) => {
  const isCancelled = currentStatus === 'CANCELLED';

  const getCurrentStepIndex = () => {
    if (isCancelled) return -1;
    return STATUS_STEPS.findIndex((s) => s.key === currentStatus);
  };

  const currentIndex = getCurrentStepIndex();
  const progressPercent =
    currentIndex >= 0 ? (currentIndex / (STATUS_STEPS.length - 1)) * 100 : 0;

  return (
    <div className="po-timeline-container">
      <div className="po-timeline-header">
        <div>
          <h3>Purchase Order Lifecycle Progress</h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Real-time status tracking from creation to fulfillment and invoice settlement
          </p>
        </div>
        {isCancelled && (
          <span className="badge badge-rejected" style={{ fontSize: '0.875rem' }}>
            <XCircle size={14} /> ORDER CANCELLED
          </span>
        )}
      </div>

      <div className="po-timeline-steps">
        <div className="po-timeline-bar">
          <div
            className="po-timeline-bar-fill"
            style={{
              width: `${progressPercent}%`,
              background: isCancelled ? 'var(--danger)' : 'var(--primary-gradient)',
            }}
          ></div>
        </div>

        {STATUS_STEPS.map((step, idx) => {
          const Icon = step.icon;
          const isCompleted = !isCancelled && idx < currentIndex;
          const isActive = !isCancelled && idx === currentIndex;
          const isUpcoming = !isCancelled && idx > currentIndex;

          // Check if timestamp exists in history
          const historyItem = statusHistory.find(
            (h) => h.status?.toUpperCase() === step.key
          );

          let nodeClass = '';
          if (isCompleted) nodeClass = 'completed';
          else if (isActive) nodeClass = 'active';
          else if (isCancelled) nodeClass = 'cancelled';

          return (
            <div key={step.key} className={`po-step-node ${nodeClass}`}>
              <div className="po-step-circle">
                {isCompleted ? <CheckCircle2 size={20} /> : <Icon size={18} />}
              </div>
              <span className="po-step-label">{step.label}</span>
              {historyItem && (
                <span
                  style={{
                    fontSize: '0.7rem',
                    color: 'var(--text-muted)',
                    marginTop: '0.25rem',
                  }}
                >
                  {new Date(historyItem.changedAt).toLocaleDateString([], {
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default POTimeline;
