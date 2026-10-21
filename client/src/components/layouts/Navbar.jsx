import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import {
  Menu,
  Search,
  Bell,
  CheckCircle2,
  AlertCircle,
  Info,
  Clock,
  ExternalLink,
} from 'lucide-react';

const Navbar = ({ onToggleMobile }) => {
  const { user, logout } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef(null);
  const navigate = useNavigate();

  // Close notifications on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = (notif) => {
    if (!notif.isRead) {
      markAsRead(notif._id);
    }
    setShowNotifications(false);
    if (notif.link) {
      navigate(notif.link);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 size={16} />;
      case 'warning':
      case 'danger':
        return <AlertCircle size={16} />;
      default:
        return <Info size={16} />;
    }
  };

  return (
    <header className="navbar">
      <div className="navbar-left">
        <button className="mobile-menu-btn" onClick={onToggleMobile}>
          <Menu size={24} />
        </button>
        <div className="navbar-search">
          <Search size={16} className="navbar-search-icon" />
          <input
            type="text"
            placeholder="Search vendors, POs, compliance..."
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.target.value.trim()) {
                navigate(user?.role === 'admin' ? `/vendors?search=${encodeURIComponent(e.target.value)}` : `/purchase-orders?search=${encodeURIComponent(e.target.value)}`);
              }
            }}
          />
        </div>
      </div>

      <div className="navbar-right">
        {/* Notification Bell Dropdown */}
        <div className="notification-wrapper" ref={notifRef}>
          <button
            className="icon-button"
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="Notifications"
          >
            <Bell size={19} />
            {unreadCount > 0 && (
              <span className="notification-count">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="notification-dropdown">
              <div className="notification-dropdown-header">
                <h4>Notifications ({unreadCount})</h4>
                {unreadCount > 0 && (
                  <button className="mark-all-btn" onClick={markAllAsRead}>
                    Mark all read
                  </button>
                )}
              </div>

              <div className="notification-list">
                {notifications.length === 0 ? (
                  <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No notifications yet
                  </div>
                ) : (
                  notifications.slice(0, 8).map((notif) => (
                    <div
                      key={notif._id}
                      className={`notification-item ${!notif.isRead ? 'unread' : ''}`}
                      onClick={() => handleNotificationClick(notif)}
                    >
                      <div className={`notification-item-icon ${notif.type || 'info'}`}>
                        {getNotificationIcon(notif.type)}
                      </div>
                      <div className="notification-content">
                        <h5>{notif.title}</h5>
                        <p>{notif.message}</p>
                        <span className="notification-time">
                          <Clock size={11} style={{ display: 'inline', marginRight: '3px' }} />
                          {new Date(notif.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Chip */}
        <div
          className="user-profile-chip"
          onClick={() => navigate(user?.role === 'admin' ? '/settings' : '/vendor/profile')}
        >
          <div className="user-avatar">{getInitials(user?.name)}</div>
          <div className="user-info">
            <span className="user-name">{user?.name}</span>
            <span className="user-role-label">
              {user?.role === 'admin' ? 'Procurement Lead' : 'Supplier Partner'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
