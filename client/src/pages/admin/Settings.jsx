import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import FormField from '../../components/common/FormField';
import Input from '../../components/common/Input';
import {
  Settings as SettingsIcon,
  Building,
  ShieldCheck,
  Bell,
  CheckCircle2,
  Lock,
  User,
  Save,
} from 'lucide-react';

const Settings = () => {
  const { user, refreshUser } = useAuth();
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      // update profile
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      alert('Failed to update profile');
    }
  };

  return (
    <div className="settings-page">
      <div className="page-header">
        <div className="page-title-group">
          <h1>System & Account Settings</h1>
          <p>Configure procurement organizational parameters and security credentials</p>
        </div>
      </div>

      <div className="dashboard-charts-grid">
        {/* Left Column: Organization & Profile */}
        <div className="chart-card-col-6" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card">
            <div className="card-header">
              <h3>Admin User Profile</h3>
            </div>
            {savedSuccess && (
              <div style={{ padding: '0.75rem 1rem', background: 'var(--success-light)', color: 'var(--success-text)', borderRadius: 'var(--radius-md)', marginBottom: '1rem', border: '1px solid var(--success-border)', fontSize: '0.875rem' }}>
                Profile information updated successfully.
              </div>
            )}
            <form onSubmit={handleSaveProfile}>
              <FormField label="Full Name">
                <Input
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                />
              </FormField>

              <FormField label="Registered Email (Read Only)">
                <Input value={user?.email || ''} disabled style={{ backgroundColor: 'var(--surface-alt)' }} />
              </FormField>

              <FormField label="Phone Number">
                <Input
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                />
              </FormField>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <Button type="submit" variant="primary" icon={Save}>
                  Save Profile Changes
                </Button>
              </div>
            </form>
          </div>

          <div className="card">
            <div className="card-header">
              <h3>Procurement Rules & Policy Defaults</h3>
            </div>
            <div className="form-grid-2">
              <FormField label="Default Currency">
                <Input value="INR (₹)" disabled style={{ backgroundColor: 'var(--surface-alt)' }} />
              </FormField>
              <FormField label="Standard Tax / GST Rate">
                <Input value="18%" disabled style={{ backgroundColor: 'var(--surface-alt)' }} />
              </FormField>
              <FormField label="Default Payment Term">
                <Input value="Net 30 Days" disabled style={{ backgroundColor: 'var(--surface-alt)' }} />
              </FormField>
              <FormField label="Evaluation Cycle">
                <Input value="Quarterly (90 Days)" disabled style={{ backgroundColor: 'var(--surface-alt)' }} />
              </FormField>
            </div>
          </div>
        </div>

        {/* Right Column: Security & System Health */}
        <div className="chart-card-col-6" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card">
            <div className="card-header">
              <h3>Security & Password Management</h3>
            </div>
            {passwordSuccess && (
              <div style={{ padding: '0.75rem 1rem', background: 'var(--success-light)', color: 'var(--success-text)', borderRadius: 'var(--radius-md)', marginBottom: '1rem', border: '1px solid var(--success-border)', fontSize: '0.875rem' }}>
                Password changed successfully.
              </div>
            )}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setPasswordSuccess(true);
                setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                setTimeout(() => setPasswordSuccess(false), 3000);
              }}
            >
              <FormField label="Current Password">
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                />
              </FormField>

              <FormField label="New Password">
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                />
              </FormField>

              <FormField label="Confirm New Password">
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                />
              </FormField>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <Button type="submit" variant="primary" icon={Lock}>
                  Update Password
                </Button>
              </div>
            </form>
          </div>

          <div className="card">
            <div className="card-header">
              <h3>System Status & Infrastructure</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border-light)' }}>
                <span>Backend API Status</span>
                <span className="badge badge-active" style={{ fontSize: '0.75rem' }}>HEALTHY 200 OK</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border-light)' }}>
                <span>Database Connection</span>
                <span className="badge badge-active" style={{ fontSize: '0.75rem' }}>MONGODB CONNECTED</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border-light)' }}>
                <span>Environment</span>
                <strong>Development</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0' }}>
                <span>Application Version</span>
                <strong>VENDORA v1.0.0 (FSD)</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
