import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../context/NotificationContext';
import Button from '../../components/common/Button';
import {
  Bell,
  CheckCircle2,
  AlertCircle,
  Info,
  Clock,
  ExternalLink,
} from 'lucide-react';

const VendorNotifications = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const navigate = useNavigate();

  const handleNotificationClick = (n) => {
    if (!n.isRead) {
      markAsRead(n._id);
    }
    if (n.link) {
      navigate(n.link);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 size={18} />;
      case 'warning':
      case 'danger':
        return <AlertCircle size={18} />;
      default:
        return <Info size={18} />;
    }
  };

  return (
    <div className="notifications-page">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Supplier Alerts & Notifications</h1>
          <p>Real-time updates regarding your onboarding status, purchase orders, and document verifications</p>
        </div>
        {unreadCount > 0 && (
          <div className="page-actions">
            <Button variant="outline-primary" size="sm" onClick={markAllAsRead}>
              Mark All as Read ({unreadCount})
            </Button>
          </div>
        )}
      </div>

      <div className="card">
        {notifications.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            No notifications to display.
          </div>
        ) : (
          <div className="notification-list" style={{ maxHeight: 'none' }}>
            {notifications.map((n) => (
              <div
                key={n._id}
                className={`notification-item ${!n.isRead ? 'unread' : ''}`}
                onClick={() => handleNotificationClick(n)}
                style={{ padding: '1.25rem 1.5rem' }}
              >
                <div className={`notification-item-icon ${n.type || 'info'}`} style={{ width: '38px', height: '38px' }}>
                  {getIcon(n.type)}
                </div>
                <div className="notification-content" style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h5 style={{ fontSize: '1rem', fontWeight: 600 }}>{n.title}</h5>
                    <span className="notification-time">
                      <Clock size={12} style={{ display: 'inline', marginRight: '4px' }} />
                      {new Date(n.createdAt).toLocaleDateString()} {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>{n.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorNotifications;
