import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { vendorService } from '../../services/vendorService';
import { documentService } from '../../services/documentService';
import Button from '../../components/common/Button';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import CriteriaMeter from '../../components/evaluations/CriteriaMeter';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Modal from '../../components/common/Modal';
import FormField from '../../components/common/FormField';
import Input from '../../components/common/Input';
import {
  Building,
  ArrowLeft,
  Mail,
  Phone,
  Globe,
  MapPin,
  Calendar,
  Award,
  ShoppingCart,
  FileText,
  Star,
  CheckCircle2,
  XCircle,
  Clock,
  PlusCircle,
  ExternalLink,
  ShieldCheck,
  CreditCard,
  Briefcase,
} from 'lucide-react';

const VendorDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview'); // overview, company, documents, performance, pos
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Document verification modal state
  const [rejectModal, setRejectModal] = useState({
    isOpen: false,
    docId: null,
    reason: '',
  });

  const fetchVendor = async () => {
    try {
      setLoading(true);
      const res = await vendorService.getVendorById(id);
      if (res.success) {
        setData(res);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load vendor details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendor();
  }, [id]);

  const handleVerifyDoc = async (docId) => {
    try {
      await documentService.verifyDocument(docId);
      fetchVendor();
    } catch (err) {
      alert(err.response?.data?.message || 'Verification failed');
    }
  };

  const handleRejectDoc = async () => {
    try {
      await documentService.rejectDocument(rejectModal.docId, rejectModal.reason);
      setRejectModal({ isOpen: false, docId: null, reason: '' });
      fetchVendor();
    } catch (err) {
      alert(err.response?.data?.message || 'Rejection failed');
    }
  };

  if (loading) return <LoadingSpinner text="Loading vendor profile..." />;
  if (error) return <div className="card" style={{ color: 'var(--danger)', padding: '2rem' }}>{error}</div>;

  const { vendor, documents = [], evaluations = [], purchaseOrders = [] } = data;

  return (
    <div className="vendor-details-page">
      {/* Back CTA */}
      <button
        onClick={() => navigate('/vendors')}
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
        <ArrowLeft size={16} /> Back to Vendors List
      </button>

      {/* Header Profile Card */}
      <div className="card" style={{ marginBottom: '1.75rem', padding: '1.75rem 2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.25rem' }}>
          <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: 'var(--radius-lg)',
                background: 'var(--primary-gradient)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                fontWeight: 800,
                fontFamily: 'Outfit',
                boxShadow: 'var(--shadow-glow)',
              }}
            >
              {vendor.companyName?.substring(0, 2).toUpperCase()}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{vendor.companyName}</h1>
                <StatusBadge status={vendor.status} />
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.2rem' }}>
                Vendor ID: <strong style={{ color: 'var(--primary)' }}>{vendor.vendorId}</strong> &bull; {vendor.industry} &bull; {vendor.businessType}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Button
              variant="outline-primary"
              icon={Award}
              onClick={() => navigate(`/evaluations/create?vendorId=${vendor._id}`)}
            >
              Evaluate Vendor
            </Button>
            <Button
              variant="primary"
              icon={PlusCircle}
              onClick={() => navigate(`/purchase-orders/create?vendorId=${vendor._id}`)}
            >
              Create Purchase Order
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="tabs-header">
        <button
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`tab-btn ${activeTab === 'company' ? 'active' : ''}`}
          onClick={() => setActiveTab('company')}
        >
          Company & Bank Info
        </button>
        <button
          className={`tab-btn ${activeTab === 'documents' ? 'active' : ''}`}
          onClick={() => setActiveTab('documents')}
        >
          Compliance Documents ({documents.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'performance' ? 'active' : ''}`}
          onClick={() => setActiveTab('performance')}
        >
          Performance Evaluations ({evaluations.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'pos' ? 'active' : ''}`}
          onClick={() => setActiveTab('pos')}
        >
          Purchase Orders ({purchaseOrders.length})
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="animate-fade-in">
          <div className="evaluations-overview-grid">
            {/* Performance Spotlight */}
            <div className="overall-score-spotlight">
              <span style={{ fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#DDD6FE', fontWeight: 700 }}>
                Vendor Scorecard
              </span>

              <div className="score-circle-badge">
                <span className="score-num">{vendor.performanceScore ? vendor.performanceScore.toFixed(1) : '0.0'}</span>
                <span className="score-total">out of 5.0</span>
              </div>

              <div className={`rating-tier-pill ${(vendor.ratingTier || 'Unrated').toLowerCase()}`}>
                {vendor.ratingTier || 'Unrated'} Tier
              </div>

              <p style={{ fontSize: '0.8125rem', color: '#CBD5E1', marginTop: '1rem' }}>
                Based on {vendor.evaluationCount || evaluations.length} comprehensive procurement reviews
              </p>
            </div>

            {/* Overview Details Grid */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="card">
                <div className="card-header">
                  <h3>Primary Contact & Location</h3>
                </div>
                <div className="form-grid-2">
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <Mail size={18} color="var(--primary)" />
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Official Email</span>
                      <div style={{ fontWeight: 600 }}>{vendor.email}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <Phone size={18} color="var(--primary)" />
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Phone Number</span>
                      <div style={{ fontWeight: 600 }}>{vendor.phone || 'N/A'}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <Globe size={18} color="var(--primary)" />
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Website</span>
                      <div style={{ fontWeight: 600 }}>
                        {vendor.website ? (
                          <a href={vendor.website} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            {vendor.website} <ExternalLink size={12} />
                          </a>
                        ) : 'N/A'}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <MapPin size={18} color="var(--primary)" />
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Address</span>
                      <div style={{ fontWeight: 600 }}>
                        {vendor.address ? `${vendor.address}, ${vendor.city}, ${vendor.state} - ${vendor.pincode}` : 'N/A'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="card-header">
                  <h3>Business Description & Products</h3>
                </div>
                <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.6 }}>
                  {vendor.businessDescription || 'No business description supplied.'}
                </p>
                {vendor.productsServices && vendor.productsServices.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {vendor.productsServices.map((prod, idx) => (
                      <span
                        key={idx}
                        style={{
                          padding: '0.35rem 0.75rem',
                          borderRadius: 'var(--radius-full)',
                          background: 'var(--primary-light)',
                          color: 'var(--primary)',
                          fontSize: '0.8125rem',
                          fontWeight: 600,
                        }}
                      >
                        {prod}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: COMPANY & BANK INFO */}
      {activeTab === 'company' && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card">
            <div className="card-header">
              <h3>Legal & Corporate Registration</h3>
            </div>
            <div className="form-grid-3">
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Company Name</span>
                <div style={{ fontWeight: 600 }}>{vendor.companyName}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Business Structure</span>
                <div style={{ fontWeight: 600 }}>{vendor.businessType}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Industry Category</span>
                <div style={{ fontWeight: 600 }}>{vendor.industry}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Registration / CIN Number</span>
                <div style={{ fontWeight: 600 }}>{vendor.registrationNumber || 'N/A'}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>GST Number</span>
                <div style={{ fontWeight: 600 }}>{vendor.gstNumber || 'N/A'}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>PAN Number</span>
                <div style={{ fontWeight: 600 }}>{vendor.panNumber || 'N/A'}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Year Established</span>
                <div style={{ fontWeight: 600 }}>{vendor.yearEstablished || 'N/A'}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Employee Headcount</span>
                <div style={{ fontWeight: 600 }}>{vendor.numberOfEmployees || 'N/A'}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Annual Turnover</span>
                <div style={{ fontWeight: 600 }}>{vendor.annualTurnover || 'N/A'}</div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3>Disbursement & Banking Coordinates</h3>
            </div>
            <div className="form-grid-2">
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Bank Name</span>
                <div style={{ fontWeight: 600 }}>{vendor.bankName || 'N/A'}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Account Beneficiary Name</span>
                <div style={{ fontWeight: 600 }}>{vendor.accountHolderName || 'N/A'}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Account Number</span>
                <div style={{ fontWeight: 600 }}>{vendor.accountNumber || 'N/A'}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>IFSC / SWIFT Code</span>
                <div style={{ fontWeight: 600 }}>{vendor.ifscCode || 'N/A'}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: DOCUMENTS */}
      {activeTab === 'documents' && (
        <div className="animate-fade-in">
          {documents.length === 0 ? (
            <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
              No compliance documents uploaded by this supplier yet.
            </div>
          ) : (
            <div className="uploaded-docs-list">
              {documents.map((doc) => (
                <div key={doc._id} className="uploaded-doc-item">
                  <div className="doc-file-info">
                    <div className="doc-file-icon">
                      <FileText size={20} />
                    </div>
                    <div className="doc-file-details">
                      <h5>{doc.documentName}</h5>
                      <span>
                        {doc.documentType} &bull; Uploaded on {new Date(doc.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <StatusBadge status={doc.status} size="sm" />

                    <a
                      href={doc.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline btn-sm"
                      style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                    >
                      <ExternalLink size={14} /> Preview
                    </a>

                    {doc.status === 'PENDING' && (
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleVerifyDoc(doc._id)}
                        >
                          Verify
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => setRejectModal({ isOpen: true, docId: doc._id, reason: '' })}
                        >
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: PERFORMANCE EVALUATIONS */}
      {activeTab === 'performance' && (
        <div className="animate-fade-in">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3>Performance Evaluation History</h3>
            <Button
              variant="primary"
              size="sm"
              icon={Award}
              onClick={() => navigate(`/evaluations/create?vendorId=${vendor._id}`)}
            >
              Add New Evaluation
            </Button>
          </div>

          {evaluations.length === 0 ? (
            <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
              No performance reviews recorded for this vendor yet.
            </div>
          ) : (
            evaluations.map((ev) => (
              <div key={ev._id} className="eval-history-item">
                <div className="eval-history-header">
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <h4 style={{ fontSize: '1.125rem' }}>Review Score: {ev.overallScore.toFixed(2)} / 5.0</h4>
                      <span className={`rating-tier-pill ${ev.ratingTier.toLowerCase()}`} style={{ fontSize: '0.75rem' }}>
                        {ev.ratingTier}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Evaluated on {new Date(ev.evaluationDate).toLocaleDateString()} by {ev.evaluatedBy?.name || 'Procurement Team'}
                    </span>
                  </div>
                </div>

                <div className="eval-history-scores">
                  <div className="eval-mini-score">
                    <span className="crit-label">1. Quality</span>
                    <span className="crit-val">{ev.criteria.quality}/5</span>
                  </div>
                  <div className="eval-mini-score">
                    <span className="crit-label">2. Delivery</span>
                    <span className="crit-val">{ev.criteria.delivery}/5</span>
                  </div>
                  <div className="eval-mini-score">
                    <span className="crit-label">3. Pricing</span>
                    <span className="crit-val">{ev.criteria.pricing}/5</span>
                  </div>
                  <div className="eval-mini-score">
                    <span className="crit-label">4. Communication</span>
                    <span className="crit-val">{ev.criteria.communication}/5</span>
                  </div>
                  <div className="eval-mini-score">
                    <span className="crit-label">5. Reliability</span>
                    <span className="crit-val">{ev.criteria.reliability}/5</span>
                  </div>
                  <div className="eval-mini-score">
                    <span className="crit-label">6. Compliance</span>
                    <span className="crit-val">{ev.criteria.compliance}/5</span>
                  </div>
                </div>

                {ev.comments && (
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontStyle: 'italic', background: 'var(--surface-alt)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)' }}>
                    &ldquo;{ev.comments}&rdquo;
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 5: PURCHASE ORDERS */}
      {activeTab === 'pos' && (
        <div className="animate-fade-in">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3>Issued Purchase Orders</h3>
            <Button
              variant="primary"
              size="sm"
              icon={PlusCircle}
              onClick={() => navigate(`/purchase-orders/create?vendorId=${vendor._id}`)}
            >
              Create New PO
            </Button>
          </div>

          {purchaseOrders.length === 0 ? (
            <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
              No purchase orders issued to this vendor yet.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>PO Number</th>
                    <th>PO Date</th>
                    <th>Delivery Date</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {purchaseOrders.map((po) => (
                    <tr key={po._id} onClick={() => navigate(`/purchase-orders/${po._id}`)} style={{ cursor: 'pointer' }}>
                      <td style={{ fontWeight: 700, color: 'var(--primary)' }}>{po.poNumber}</td>
                      <td>{new Date(po.poDate).toLocaleDateString()}</td>
                      <td>{new Date(po.expectedDeliveryDate).toLocaleDateString()}</td>
                      <td style={{ fontWeight: 700 }}>₹{po.grandTotal?.toLocaleString()}</td>
                      <td><StatusBadge status={po.status} size="sm" /></td>
                      <td style={{ textAlign: 'right' }}>
                        <Button variant="outline" size="sm" onClick={() => navigate(`/purchase-orders/${po._id}`)}>
                          View PO
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Reject Document Modal */}
      <Modal
        isOpen={rejectModal.isOpen}
        onClose={() => setRejectModal({ isOpen: false, docId: null, reason: '' })}
        title="Reject Compliance Document"
        size="sm"
      >
        <FormField label="Rejection Reason" required>
          <textarea
            className="form-textarea"
            rows="4"
            placeholder="Specify why this document could not be verified (e.g. illegible scan, expired validity)..."
            value={rejectModal.reason}
            onChange={(e) => setRejectModal({ ...rejectModal, reason: e.target.value })}
          ></textarea>
        </FormField>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
          <Button variant="outline" onClick={() => setRejectModal({ isOpen: false, docId: null, reason: '' })}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleRejectDoc}>
            Confirm Rejection
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default VendorDetails;
