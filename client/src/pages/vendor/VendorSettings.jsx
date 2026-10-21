import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import FormField from '../../components/common/FormField';
import Input from '../../components/common/Input';
import {
  Settings as SettingsIcon,
  Lock,
  User,
  ShieldCheck,
  Save,
  CheckCircle2,
} from 'lucide-react';

const VendorSettings = () => {
  const { user } = useAuth();
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [success, setSuccess] = useState(false);

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    setSuccess(true);
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="vendor-settings-page">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Account & Security Settings</h1>
          <p>Manage your supplier login credentials and portal preferences</p>
        </div>
      </div>

      <div className="dashboard-charts-grid">
        <div className="card chart-card-col-6">
          <div className="card-header">
            <h3>Supplier Account Credentials</h3>
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <FormField label="Registered User Name">
              <Input value={user?.name || ''} disabled style={{ backgroundColor: 'var(--surface-alt)' }} />
            </FormField>

            <FormField label="Authorized Email">
              <Input value={user?.email || ''} disabled style={{ backgroundColor: 'var(--surface-alt)' }} />
            </FormField>

            <FormField label="Account Role">
              <Input value="Registered Supplier Partner" disabled style={{ backgroundColor: 'var(--surface-alt)' }} />
            </FormField>
          </div>
        </div>

        <div className="card chart-card-col-6">
          <div className="card-header">
            <h3>Change Password</h3>
          </div>

          {success && (
            <div style={{ padding: '0.75rem 1rem', background: 'var(--success-light)', color: 'var(--success-text)', borderRadius: 'var(--radius-md)', marginBottom: '1rem', border: '1px solid var(--success-border)', fontSize: '0.875rem' }}>
              Password updated successfully.
            </div>
          )}

          <form onSubmit={handlePasswordChange}>
            <FormField label="Current Password" required>
              <Input
                type="password"
                required
                placeholder="••••••••"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              />
            </FormField>

            <FormField label="New Password" required>
              <Input
                type="password"
                required
                placeholder="••••••••"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              />
            </FormField>

            <FormField label="Confirm New Password" required>
              <Input
                type="password"
                required
                placeholder="••••••••"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              />
            </FormField>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
              <Button type="submit" variant="primary" icon={Lock}>
                Update Password
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VendorSettings;
