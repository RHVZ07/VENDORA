import React, { useState, useEffect } from 'react';
import { vendorService } from '../../services/vendorService';
import Button from '../../components/common/Button';
import FormField from '../../components/common/FormField';
import Input from '../../components/common/Input';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import {
  Building,
  Save,
  CheckCircle2,
  Mail,
  Phone,
  Globe,
  MapPin,
  CreditCard,
  Briefcase,
} from 'lucide-react';

const VendorProfile = () => {
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [formData, setFormData] = useState({
    contactPerson: '',
    phone: '',
    alternatePhone: '',
    website: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    businessDescription: '',
    bankName: '',
    accountHolderName: '',
    accountNumber: '',
    ifscCode: '',
  });

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await vendorService.getMyProfile();
      if (res.success && res.vendor) {
        setVendor(res.vendor);
        setFormData({
          contactPerson: res.vendor.contactPerson || '',
          phone: res.vendor.phone || '',
          alternatePhone: res.vendor.alternatePhone || '',
          website: res.vendor.website || '',
          address: res.vendor.address || '',
          city: res.vendor.city || '',
          state: res.vendor.state || '',
          pincode: res.vendor.pincode || '',
          businessDescription: res.vendor.businessDescription || '',
          bankName: res.vendor.bankName || '',
          accountHolderName: res.vendor.accountHolderName || '',
          accountNumber: res.vendor.accountNumber || '',
          ifscCode: res.vendor.ifscCode || '',
        });
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await vendorService.updateVendor(vendor._id, formData);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
      fetchProfile();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading supplier credentials..." />;
  if (!vendor) return <div className="card">Vendor profile not found</div>;

  return (
    <div className="vendor-profile-page">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Supplier Profile & Coordinates</h1>
          <p>Maintain your official contact coordinates, bank accounts, and commercial details</p>
        </div>
      </div>

      {savedSuccess && (
        <div style={{ padding: '0.85rem 1.25rem', background: 'var(--success-light)', color: 'var(--success-text)', border: '1px solid var(--success-border)', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle2 size={18} /> Profile coordinates updated successfully.
        </div>
      )}

      {/* Header Profile Summary */}
      <div className="card" style={{ marginBottom: '1.75rem', padding: '1.75rem 2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: 'var(--radius-lg)',
                background: 'var(--primary-gradient)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.4rem',
                fontWeight: 800,
                fontFamily: 'Outfit',
              }}
            >
              {vendor.companyName?.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>{vendor.companyName}</h2>
                <StatusBadge status={vendor.status} />
              </div>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                Vendor ID: <strong>{vendor.vendorId}</strong> &bull; {vendor.industry} &bull; {vendor.businessType}
              </p>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="dashboard-charts-grid">
          {/* Left Column: Contact & Address Coordinates */}
          <div className="card chart-card-col-6">
            <div className="card-header">
              <h3>Contact & Location Coordinates</h3>
            </div>

            <FormField label="Contact Person Name" required>
              <Input
                required
                name="contactPerson"
                value={formData.contactPerson}
                onChange={handleChange}
              />
            </FormField>

            <div className="form-grid-2">
              <FormField label="Primary Phone" required>
                <Input
                  required
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </FormField>

              <FormField label="Alternate Phone">
                <Input
                  name="alternatePhone"
                  value={formData.alternatePhone}
                  onChange={handleChange}
                />
              </FormField>
            </div>

            <FormField label="Official Website">
              <Input
                name="website"
                value={formData.website}
                onChange={handleChange}
              />
            </FormField>

            <FormField label="Facility Address">
              <Input
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
            </FormField>

            <div className="form-grid-3">
              <FormField label="City">
                <Input name="city" value={formData.city} onChange={handleChange} />
              </FormField>
              <FormField label="State">
                <Input name="state" value={formData.state} onChange={handleChange} />
              </FormField>
              <FormField label="Pincode">
                <Input name="pincode" value={formData.pincode} onChange={handleChange} />
              </FormField>
            </div>
          </div>

          {/* Right Column: Banking & Business Description */}
          <div className="card chart-card-col-6">
            <div className="card-header">
              <h3>Disbursement Bank Coordinates</h3>
            </div>

            <div className="form-grid-2">
              <FormField label="Bank Name">
                <Input name="bankName" value={formData.bankName} onChange={handleChange} />
              </FormField>
              <FormField label="Account Beneficiary Name">
                <Input name="accountHolderName" value={formData.accountHolderName} onChange={handleChange} />
              </FormField>
            </div>

            <div className="form-grid-2">
              <FormField label="Account Number">
                <Input name="accountNumber" value={formData.accountNumber} onChange={handleChange} />
              </FormField>
              <FormField label="IFSC Code">
                <Input name="ifscCode" value={formData.ifscCode} onChange={handleChange} />
              </FormField>
            </div>

            <FormField label="Business Description">
              <textarea
                className="form-textarea"
                rows="4"
                name="businessDescription"
                value={formData.businessDescription}
                onChange={handleChange}
              ></textarea>
            </FormField>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <Button type="submit" variant="primary" loading={saving} icon={Save}>
                Save Profile Changes
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default VendorProfile;
