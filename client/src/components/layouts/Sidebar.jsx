import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Award,
  ShoppingCart,
  FileText,
  BarChart3,
  Settings,
  LogOut,
  Bell,
  Building,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

const Sidebar = ({ isMobileOpen, onCloseMobile }) => {
  const { user, logout, isAdmin, isVendor } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const adminNavItems = [
    { title: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { title: 'Vendors', path: '/vendors', icon: Users },
    { title: 'Onboarding', path: '/onboarding-requests', icon: UserCheck },
    { title: 'Evaluations', path: '/evaluations', icon: Award },
    { title: 'Purchase Orders', path: '/purchase-orders', icon: ShoppingCart },
    { title: 'Documents', path: '/documents', icon: FileText },
    { title: 'Reports', path: '/reports', icon: BarChart3 },
    { title: 'Settings', path: '/settings', icon: Settings },
  ];

  const vendorNavItems = [
    { title: 'Dashboard', path: '/vendor/dashboard', icon: LayoutDashboard },
    { title: 'My Profile', path: '/vendor/profile', icon: Building },
    { title: 'Onboarding', path: '/onboarding', icon: ShieldCheck },
    { title: 'Documents', path: '/documents', icon: FileText },
    { title: 'Purchase Orders', path: '/purchase-orders', icon: ShoppingCart },
    { title: 'Performance', path: '/performance', icon: Award },
    {
      title: 'Notifications',
      path: '/notifications',
      icon: Bell,
      badge: unreadCount > 0 ? unreadCount : null,
    },
    { title: 'Settings', path: '/settings', icon: Settings },
  ];

  const navItems = isAdmin ? adminNavItems : vendorNavItems;

  return (
    <>
      <aside className={`sidebar ${isMobileOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <NavLink to="/" className="brand-logo" onClick={onCloseMobile}>
            <div className="brand-icon-wrapper">
              <Sparkles size={20} />
            </div>
            <span>
              VEN<span className="brand-text-accent">DORA</span>
            </span>
          </NavLink>
          <span className="sidebar-role-badge">
            {isAdmin ? 'Procurement' : 'Supplier'}
          </span>
        </div>

        <nav className="sidebar-nav">
          <span className="nav-section-title">Main Navigation</span>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                onClick={onCloseMobile}
              >
                <Icon className="nav-icon" />
                <span>{item.title}</span>
                {item.badge && <span className="nav-badge">{item.badge}</span>}
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
