import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { onboardingService } from '../../services/onboardingService';
import { documentService } from '../../services/documentService';
import Button from '../../components/common/Button';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Modal from '../../components/common/Modal';
import FormField from '../../components/common/FormField';
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  ExternalLink,
  ShieldCheck,
  Building,
  CreditCard,
  MapPin,
  Mail,
  Phone,
  Briefcase,
} from 'lucide-react';

const OnboardingReview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Action Modals
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  const [changesModalOpen, setChangesModalOpen] = useState(false);
  const [requestedChanges, setRequestedChanges] = useState('');

  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');

  const fetchApplication = async () => {
    try {
      setLoading(true);
      const res = await onboardingService.getApplicationById(id);
      if (res.success) {
        setData(res);
      }
    } catch (err) {
      console.error('Error fetching application:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplication();
  }, [id]);

  const handleVerifyDocument = async (docId) => {
    try {
      await documentService.verifyDocument(docId);
      fetchApplication();
    } catch (err) {
      alert(err.response?.data?.message || 'Verification failed');
    }
  };

  const handleApprove = async () => {
    try {
      setActionLoading(true);
      await onboardingService.approveApplication(id, { adminNotes });
      setApproveModalOpen(false);
      fetchApplication();
    } catch (err) {
      alert(err.response?.data?.message || 'Approval failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }
    try {
      setActionLoading(true);
      await onboardingService.rejectApplication(id, rejectionReason);
      setRejectModalOpen(false);
      fetchApplication();
    } catch (err) {
      alert(err.response?.data?.message || 'Rejection failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRequestChanges = async () => {
    if (!requestedChanges.trim()) {
      alert('Please specify the changes required');
      return;
    }
    try {
      setActionLoading(true);
      await onboardingService.requestChanges(id, requestedChanges);
      setChangesModalOpen(false);
      fetchApplication();
    } catch (err) {
      alert(err.response?.data?.message || 'Action failed');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading onboarding application for review..." />;
  if (!data?.application) return <div className="card">Application not found</div>;

  const { application: app, documents = [] } = data;

  return (
    <div className="onboarding-review-page">
      <button
        onClick={() => navigate('/onboarding-requests')}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          background: 'none',
          border: 'none',
          color: 'var(--text-secondary)',
          cursor: 'pointer',
          marginBottom: '1rem',
          fontWeight: 600,
        }}
      >
        <ArrowLeft size={16} /> Back to Onboarding List
      </button>

      {/* Header Banner */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1.75rem 2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>{app.companyName}</h1>
              <StatusBadge status={app.status} />
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
              Application ID: {app.vendorId} &bull; Submitted by {app.contactPerson} ({app.email})
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Button
              variant="outline"
              icon={AlertTriangle}
              onClick={() => setChangesModalOpen(true)}
            >
              Request Changes
            </Button>
            <Button
              variant="danger"
              icon={XCircle}
              onClick={() => setRejectModalOpen(true)}
            >
              Reject
            </Button>
            <Button
              variant="primary"
              icon={CheckCircle2}
              onClick={() => setApproveModalOpen(true)}
            >
              Approve & Activate
            </Button>
          </div>
        </div>
      </div>

      {/* Changes / Rejection Note Banner if applicable */}
      {app.requestedChanges && (
        <div
          style={{
            background: 'var(--warning-light)',
            border: '1px solid var(--warning-border)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem 1.25rem',
            marginBottom: '1.5rem',
            color: 'var(--warning-text)',
          }}
        >
          <strong>Previously Requested Changes:</strong> {app.requestedChanges}
        </div>
      )}

      {app.rejectionReason && (
        <div
          style={{
            background: 'var(--danger-light)',
            border: '1px solid var(--danger-border)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem 1.25rem',
            marginBottom: '1.5rem',
            color: 'var(--danger-text)',
          }}
        >
          <strong>Rejection Reason:</strong> {app.rejectionReason}
        </div>
      )}

      {/* 6 Sections Inspection Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Step 1: Company Information */}
        <div className="card">
          <div className="card-header">
            <h3>Step 1: Company Information</h3>
          </div>
          <div className="form-grid-3">
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Company Name</span>
              <div style={{ fontWeight: 600 }}>{app.companyName}</div>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Business Type</span>
              <div style={{ fontWeight: 600 }}>{app.businessType}</div>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Industry</span>
              <div style={{ fontWeight: 600 }}>{app.industry}</div>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Registration Number</span>
              <div style={{ fontWeight: 600 }}>{app.registrationNumber || 'N/A'}</div>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>GST Number</span>
              <div style={{ fontWeight: 600, fontFamily: 'monospace' }}>{app.gstNumber || 'N/A'}</div>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>PAN Number</span>
              <div style={{ fontWeight: 600, fontFamily: 'monospace' }}>{app.panNumber || 'N/A'}</div>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Year Established</span>
              <div style={{ fontWeight: 600 }}>{app.yearEstablished || 'N/A'}</div>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Number of Employees</span>
              <div style={{ fontWeight: 600 }}>{app.numberOfEmployees || 'N/A'}</div>
            </div>
          </div>
        </div>

        {/* Step 2: Contact Information */}
        <div className="card">
          <div className="card-header">
            <h3>Step 2: Contact Information</h3>
          </div>
          <div className="form-grid-3">
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Contact Person</span>
              <div style={{ fontWeight: 600 }}>{app.contactPerson}</div>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Email Address</span>
              <div style={{ fontWeight: 600 }}>{app.email}</div>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Primary Phone</span>
              <div style={{ fontWeight: 600 }}>{app.phone}</div>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Alternate Phone</span>
              <div style={{ fontWeight: 600 }}>{app.alternatePhone || 'N/A'}</div>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Website</span>
              <div style={{ fontWeight: 600 }}>
                {app.website ? (
                  <a href={app.website} target="_blank" rel="noopener noreferrer">
                    {app.website}
                  </a>
                ) : 'N/A'}
              </div>
            </div>
          </div>
        </div>

        {/* Step 3: Address */}
        <div className="card">
          <div className="card-header">
            <h3>Step 3: Registered Address</h3>
          </div>
          <div className="form-grid-3">
            <div style={{ gridColumn: 'span 2' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Street Address</span>
              <div style={{ fontWeight: 600 }}>{app.address || 'N/A'}</div>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>City</span>
              <div style={{ fontWeight: 600 }}>{app.city || 'N/A'}</div>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>State</span>
              <div style={{ fontWeight: 600 }}>{app.state || 'N/A'}</div>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Pincode / Postal Code</span>
              <div style={{ fontWeight: 600 }}>{app.pincode || 'N/A'}</div>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Country</span>
              <div style={{ fontWeight: 600 }}>{app.country || 'India'}</div>
            </div>
          </div>
        </div>

        {/* Step 4: Business Information */}
        <div className="card">
          <div className="card-header">
            <h3>Step 4: Business & Capabilities</h3>
          </div>
          <div className="form-grid-2" style={{ marginBottom: '1rem' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Years of Experience</span>
              <div style={{ fontWeight: 600 }}>{app.yearsOfExperience} Years</div>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Annual Turnover</span>
              <div style={{ fontWeight: 600 }}>{app.annualTurnover || 'N/A'}</div>
            </div>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Business Description</span>
            <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', marginTop: '0.25rem', lineHeight: 1.5 }}>
              {app.businessDescription || 'N/A'}
            </p>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Products / Services Offered</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.35rem' }}>
              {app.productsServices?.map((p, i) => (
                <span
                  key={i}
                  style={{
                    padding: '0.35rem 0.75rem',
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--primary-light)',
                    color: 'var(--primary)',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                  }}
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Step 5: Bank Information */}
        <div className="card">
          <div className="card-header">
            <h3>Step 5: Bank Details</h3>
          </div>
          <div className="form-grid-2">
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Bank Name</span>
              <div style={{ fontWeight: 600 }}>{app.bankName || 'N/A'}</div>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Account Holder Name</span>
              <div style={{ fontWeight: 600 }}>{app.accountHolderName || 'N/A'}</div>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Account Number</span>
              <div style={{ fontWeight: 600, fontFamily: 'monospace' }}>{app.accountNumber || 'N/A'}</div>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>IFSC Code</span>
              <div style={{ fontWeight: 600, fontFamily: 'monospace' }}>{app.ifscCode || 'N/A'}</div>
            </div>
          </div>
        </div>

        {/* Step 6: Uploaded Documents */}
        <div className="card">
          <div className="card-header">
            <h3>Step 6: Submitted Compliance Documents</h3>
          </div>
          {documents.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '1.5rem' }}>
              No documents attached with this submission.
            </p>
          ) : (
            <div className="uploaded-docs-list">
              {documents.map((doc) => (
                <div key={doc._id} className="uploaded-doc-item">
                  <div className="doc-file-info">
                    <div className="doc-file-icon">
                      <FileText size={20} />
                    </div>
                    <div>
                      <h5 style={{ fontWeight: 600 }}>{doc.documentName}</h5>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {doc.documentType} &bull; Uploaded on {new Date(doc.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <StatusBadge status={doc.status} size="sm" />
                    <a
                      href={doc.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline btn-sm"
                    >
                      <ExternalLink size={14} /> View
                    </a>
                    {doc.status !== 'VERIFIED' && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleVerifyDocument(doc._id)}
                      >
                        Verify
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Approve Modal */}
      <Modal
        isOpen={approveModalOpen}
        onClose={() => setApproveModalOpen(false)}
        title="Approve & Activate Supplier"
        size="md"
      >
        <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
          Approving will transition <strong>{app.companyName}</strong> to an ACTIVE verified vendor on VENDORA and enable purchase order issuing.
        </p>
        <FormField label="Internal Procurement Remarks (Optional)">
          <textarea
            className="form-textarea"
            rows="3"
            placeholder="e.g. Verified tax filings and background check passed..."
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
          ></textarea>
        </FormField>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
          <Button variant="outline" onClick={() => setApproveModalOpen(false)}>
            Cancel
          </Button>
          <Button variant="primary" loading={actionLoading} onClick={handleApprove}>
            Confirm & Activate
          </Button>
        </div>
      </Modal>

      {/* Reject Modal */}
      <Modal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        title="Reject Onboarding Application"
        size="md"
      >
        <FormField label="Reason for Rejection" required>
          <textarea
            className="form-textarea"
            rows="4"
            placeholder="Specify reasons for rejection (e.g. compliance mismatch, incomplete documents)..."
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
          ></textarea>
        </FormField>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
          <Button variant="outline" onClick={() => setRejectModalOpen(false)}>
            Cancel
          </Button>
          <Button variant="danger" loading={actionLoading} onClick={handleReject}>
            Confirm Rejection
          </Button>
        </div>
      </Modal>

      {/* Request Changes Modal */}
      <Modal
        isOpen={changesModalOpen}
        onClose={() => setChangesModalOpen(false)}
        title="Request Application Changes"
        size="md"
      >
        <FormField label="Modifications Required from Supplier" required>
          <textarea
            className="form-textarea"
            rows="4"
            placeholder="Describe the specific information or document updates required from the vendor..."
            value={requestedChanges}
            onChange={(e) => setRequestedChanges(e.target.value)}
          ></textarea>
        </FormField>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
          <Button variant="outline" onClick={() => setChangesModalOpen(false)}>
            Cancel
          </Button>
          <Button variant="primary" loading={actionLoading} onClick={handleRequestChanges}>
            Send Change Request
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default OnboardingReview;
