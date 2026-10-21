import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import FormField from '../../components/common/FormField';
import Input from '../../components/common/Input';
import {
  Sparkles,
  ShieldCheck,
  UserPlus,
  Building,
  Mail,
  Phone,
  Lock,
  CheckCircle2,
} from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    companyName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Full name is required';
    if (!formData.companyName.trim()) errs.companyName = 'Company name is required';

    if (!formData.email.trim()) errs.email = 'Email address is required';
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) errs.email = 'Please enter a valid email address';

    if (!formData.phone.trim()) errs.phone = 'Phone number is required';
    else if (!/^[0-9+\s-]{8,15}$/.test(formData.phone)) errs.phone = 'Please enter a valid phone number';

    if (!formData.password) errs.password = 'Password is required';
    else if (formData.password.length < 6) errs.password = 'Password must be at least 6 characters';

    if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    if (!validate()) return;

    try {
      setLoading(true);
      await register({
        name: formData.name,
        companyName: formData.companyName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: 'vendor',
      });
      navigate('/onboarding');
    } catch (err) {
      setServerError(
        err.response?.data?.message || 'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
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
            <ShieldCheck size={16} /> Supplier Registration
          </div>
          <h1 className="auth-hero-title">
            Partner with <span className="gradient-span">Top Enterprise</span> Procurement
          </h1>
          <p className="auth-hero-desc">
            Register your enterprise, complete the digital onboarding checklist, and receive purchase orders directly on your supplier portal.
          </p>

          <div className="auth-feature-list">
            <div className="auth-feature-item">
              <div className="auth-feature-icon">
                <CheckCircle2 size={16} />
              </div>
              <span>Fast 6-step paperless onboarding application</span>
            </div>
            <div className="auth-feature-item">
              <div className="auth-feature-icon">
                <CheckCircle2 size={16} />
              </div>
              <span>Direct access to RFQs and enterprise purchase orders</span>
            </div>
            <div className="auth-feature-item">
              <div className="auth-feature-icon">
                <CheckCircle2 size={16} />
              </div>
              <span>Transparent compliance & performance benchmarks</span>
            </div>
          </div>
        </div>

        <div className="auth-brand-footer">
          <span>&copy; {new Date().getFullYear()} VENDORA Procurement Systems</span>
          <span>Supplier Onboarding Portal</span>
        </div>
      </div>

      {/* Right Registration Card Panel */}
      <div className="auth-form-side">
        <div className="auth-card" style={{ maxWidth: '520px' }}>
          <div className="auth-card-header">
            <h2>Supplier Registration</h2>
            <p>Create your vendor account to start onboarding</p>
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
            <div className="form-grid-2">
              <FormField label="Contact Person Name" required error={errors.name}>
                <Input
                  name="name"
                  placeholder="e.g. Vikram Mehta"
                  value={formData.name}
                  onChange={handleChange}
                  error={!!errors.name}
                />
              </FormField>

              <FormField label="Company / Legal Entity" required error={errors.companyName}>
                <Input
                  name="companyName"
                  placeholder="e.g. Apex Hardware Ltd"
                  value={formData.companyName}
                  onChange={handleChange}
                  error={!!errors.companyName}
                />
              </FormField>
            </div>

            <div className="form-grid-2">
              <FormField label="Work Email Address" required error={errors.email}>
                <Input
                  type="email"
                  name="email"
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={handleChange}
                  error={!!errors.email}
                />
              </FormField>

              <FormField label="Phone Number" required error={errors.phone}>
                <Input
                  type="tel"
                  name="phone"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={handleChange}
                  error={!!errors.phone}
                />
              </FormField>
            </div>

            <div className="form-grid-2">
              <FormField label="Password" required error={errors.password}>
                <Input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  error={!!errors.password}
                />
              </FormField>

              <FormField label="Confirm Password" required error={errors.confirmPassword}>
                <Input
                  type="password"
                  name="confirmPassword"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  error={!!errors.confirmPassword}
                />
              </FormField>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="auth-form-submit"
              loading={loading}
              icon={UserPlus}
            >
              Create Vendor Account
            </Button>
          </form>

          <div className="auth-switch-link">
            Already registered? <Link to="/login">Sign In here</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
