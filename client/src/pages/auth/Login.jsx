import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import FormField from '../../components/common/FormField';
import Input from '../../components/common/Input';
import {
  Sparkles,
  ShieldCheck,
  Award,
  ShoppingCart,
  LogIn,
  CheckCircle2,
  Lock,
  Mail,
} from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (!email.trim()) errs.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(email)) errs.email = 'Please enter a valid email address';

    if (!password) errs.password = 'Password is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    if (!validate()) return;

    try {
      setLoading(true);
      const data = await login({ email, password });
      if (data.user?.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/vendor/dashboard');
      }
    } catch (err) {
      setServerError(
        err.response?.data?.message || 'Login failed. Please check your credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = (role) => {
    if (role === 'admin') {
      setEmail('admin@vendora.com');
      setPassword('Admin@123');
    } else {
      setEmail('vendor@vendora.com');
      setPassword('Vendor@123');
    }
    setErrors({});
    setServerError('');
  };

  return (
    <div className="auth-page-wrapper">
      {/* Left Brand Showcase Panel */}
      <div className="auth-brand-side">
        <div className="auth-brand-header">
          <div className="brand-icon-wrapper">
            <Sparkles size={24} />
          </div>
          <span className="auth-logo-text">
            VEN<span className="brand-text-accent">DORA</span>
          </span>
        </div>

        <div className="auth-brand-body">
          <div className="auth-hero-badge">
            <ShieldCheck size={16} /> Enterprise Procurement Platform
          </div>
          <h1 className="auth-hero-title">
            Intelligent <span className="gradient-span">Vendor Lifecycle</span> & PO Management
          </h1>
          <p className="auth-hero-desc">
            Streamline supplier onboarding, monitor real-time performance scorecards, and orchestrate purchase order lifecycles with enterprise clarity.
          </p>

          <div className="auth-feature-list">
            <div className="auth-feature-item">
              <div className="auth-feature-icon">
                <CheckCircle2 size={16} />
              </div>
              <span>Multi-step supplier compliance and document verification</span>
            </div>
            <div className="auth-feature-item">
              <div className="auth-feature-icon">
                <Award size={16} />
              </div>
              <span>6-Factor automated vendor performance evaluation matrix</span>
            </div>
            <div className="auth-feature-item">
              <div className="auth-feature-icon">
                <ShoppingCart size={16} />
              </div>
              <span>End-to-end purchase order tracking with visual timelines</span>
            </div>
          </div>
        </div>

        <div className="auth-brand-footer">
          <span>&copy; {new Date().getFullYear()} VENDORA Procurement Systems</span>
          <span>Full Stack Development (MERN)</span>
        </div>
      </div>

      {/* Right Login Card Panel */}
      <div className="auth-form-side">
        <div className="auth-card">
          <div className="auth-card-header">
            <h2>Welcome Back</h2>
            <p>Sign in to access your procurement portal</p>
          </div>

          {/* 1-Click Demo Accounts */}
          <div className="demo-accounts-box">
            <div className="demo-accounts-title">
              <Sparkles size={14} /> Quick Demo Access (1-Click Fill)
            </div>
            <div className="demo-buttons-row">
              <button
                type="button"
                className="demo-fill-btn"
                onClick={() => handleQuickDemo('admin')}
              >
                Admin (Procurement)
              </button>
              <button
                type="button"
                className="demo-fill-btn"
                onClick={() => handleQuickDemo('vendor')}
              >
                Vendor (Supplier)
              </button>
            </div>
          </div>

          {serverError && (
            <div
              style={{
                padding: '0.75rem 1rem',
                backgroundColor: 'var(--danger-light)',
                border: '1px solid var(--danger-border)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--danger-text)',
                fontSize: '0.875rem',
                marginBottom: '1.25rem',
              }}
            >
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <FormField label="Email Address" required error={errors.email}>
              <Input
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={!!errors.email}
              />
            </FormField>

            <FormField label="Password" required error={errors.password}>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={!!errors.password}
              />
            </FormField>

            <Button
              type="submit"
              variant="primary"
              className="auth-form-submit"
              loading={loading}
              icon={LogIn}
            >
              Sign In to Portal
            </Button>
          </form>

          <div className="auth-switch-link">
            Don&apos;t have a supplier account yet?{' '}
            <Link to="/register">Register as Vendor</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
