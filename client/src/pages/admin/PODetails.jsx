import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { poService } from '../../services/poService';
import Button from '../../components/common/Button';
import StatusBadge from '../../components/common/StatusBadge';
import POTimeline from '../../components/purchaseOrders/POTimeline';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Modal from '../../components/common/Modal';
import FormField from '../../components/common/FormField';
import {
  ShoppingCart,
  ArrowLeft,
  Printer,
  Edit,
  CheckCircle2,
  Truck,
  PackageCheck,
  CheckCheck,
  XCircle,
  Building,
  Calendar,
  CreditCard,
  MapPin,
  Clock,
  Sparkles,
  User,
} from 'lucide-react';

const PODetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [po, setPo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Status Change Modal
  const [statusModal, setStatusModal] = useState({
    isOpen: false,
    nextStatus: '',
    remarks: '',
    loading: false,
  });

  const fetchPO = async () => {
    try {
      setLoading(true);
      const res = await poService.getPOById(id);
      if (res.success) {
        setPo(res.purchaseOrder);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load purchase order');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPO();
  }, [id]);

  const handleUpdateStatus = async () => {
    try {
      setStatusModal((prev) => ({ ...prev, loading: true }));
      await poService.updatePOStatus(id, statusModal.nextStatus, statusModal.remarks);
      setStatusModal({ isOpen: false, nextStatus: '', remarks: '', loading: false });
      fetchPO();
    } catch (err) {
      alert(err.response?.data?.message || 'Status update failed');
      setStatusModal((prev) => ({ ...prev, loading: false }));
    }
  };

  const openStatusModal = (nextStatus) => {
    setStatusModal({
      isOpen: true,
      nextStatus,
      remarks: '',
      loading: false,
    });
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <LoadingSpinner text="Retrieving purchase order details..." />;
  if (error || !po) return <div className="card" style={{ color: 'var(--danger)', padding: '2rem' }}>{error || 'Purchase Order not found'}</div>;

  return (
    <div className="po-details-page">
      {/* Back button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <button
          onClick={() => navigate('/purchase-orders')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          <ArrowLeft size={16} /> Back to Purchase Orders
        </button>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Button variant="outline" icon={Printer} onClick={handlePrint}>
            Print Invoice View
          </Button>
        </div>
      </div>

      {/* Visual Timeline Stepper */}
      <POTimeline currentStatus={po.status} statusHistory={po.statusHistory || []} />

      {/* Status Action Banner for Admin */}
      <div className="card" style={{ marginBottom: '1.75rem', padding: '1.25rem 1.75rem', background: 'var(--surface-alt)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Current Status:
            </span>
            <StatusBadge status={po.status} />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {po.status === 'PENDING APPROVAL' && (
              <Button
                variant="primary"
                size="sm"
                icon={CheckCircle2}
                onClick={() => openStatusModal('APPROVED')}
              >
                Approve PO
              </Button>
            )}

            {po.status === 'APPROVED' && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => openStatusModal('PROCESSING')}
              >
                Mark Processing
              </Button>
            )}

            {po.status === 'PROCESSING' && (
              <Button
                variant="primary"
                size="sm"
                icon={Truck}
                onClick={() => openStatusModal('SHIPPED')}
              >
                Mark Shipped
              </Button>
            )}

            {po.status === 'SHIPPED' && (
              <Button
                variant="primary"
                size="sm"
                icon={PackageCheck}
                onClick={() => openStatusModal('DELIVERED')}
              >
                Mark Delivered
              </Button>
            )}

            {po.status === 'DELIVERED' && (
              <Button
                variant="primary"
                size="sm"
                icon={CheckCheck}
                onClick={() => openStatusModal('COMPLETED')}
              >
                Complete & Close PO
              </Button>
            )}

            {po.status !== 'COMPLETED' && po.status !== 'CANCELLED' && (
              <Button
                variant="danger"
                size="sm"
                icon={XCircle}
                onClick={() => openStatusModal('CANCELLED')}
              >
                Cancel PO
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Printable Invoice & Order Card */}
      <div className="invoice-card">
        {/* Invoice Header */}
        <div className="invoice-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <div className="brand-icon-wrapper" style={{ width: '32px', height: '32px' }}>
                <Sparkles size={16} />
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>VENDORA PROCUREMENT</h2>
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              Enterprise Vendor & Supply Chain Logistics
            </p>
          </div>

          <div style={{ textAlign: 'right' }}>
            <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'Outfit' }}>
              {po.poNumber}
            </h1>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
              <strong>Issued Date:</strong> {new Date(po.poDate).toLocaleDateString()}
            </div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
              <strong>Expected Delivery:</strong> {new Date(po.expectedDeliveryDate).toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Parties Grid (Buyer & Vendor) */}
        <div className="invoice-parties-grid">
          <div className="party-box">
            <h4>Vendor / Supplier Details</h4>
            <div className="party-name">{po.vendor?.companyName}</div>
            <p>
              {po.vendor?.address ? `${po.vendor.address}, ${po.vendor.city}` : ''}
              <br />
              <strong>Contact:</strong> {po.vendor?.contactPerson} ({po.vendor?.phone})
              <br />
              <strong>Email:</strong> {po.vendor?.email}
              <br />
              <strong>GSTIN:</strong> {po.vendor?.gstNumber || 'N/A'}
            </p>
          </div>

          <div className="party-box">
            <h4>Shipping Destination</h4>
            <div className="party-name">VENDORA Receiving Facility</div>
            <p>
              {po.shippingAddress}
              <br />
              <strong>Payment Terms:</strong> {po.paymentTerms}
              <br />
              <strong>Created By:</strong> {po.createdBy?.name} ({po.createdBy?.email})
            </p>
          </div>
        </div>

        {/* Line Items Table */}
        <div className="table-responsive" style={{ marginBottom: '2rem' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: '5%' }}>#</th>
                <th style={{ width: '35%' }}>Product / Service Item</th>
                <th style={{ width: '12%', textAlign: 'center' }}>Qty</th>
                <th style={{ width: '15%', textAlign: 'right' }}>Unit Price (₹)</th>
                <th style={{ width: '15%', textAlign: 'right' }}>Tax (GST)</th>
                <th style={{ width: '18%', textAlign: 'right' }}>Total (₹)</th>
              </tr>
            </thead>
            <tbody>
              {po.items?.map((item, idx) => (
                <tr key={idx}>
                  <td style={{ color: 'var(--text-muted)' }}>{idx + 1}</td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{item.product}</div>
                    {item.description && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {item.description}
                      </div>
                    )}
                  </td>
                  <td style={{ textAlign: 'center', fontWeight: 600 }}>{item.quantity}</td>
                  <td style={{ textAlign: 'right' }}>₹{item.unitPrice?.toLocaleString()}</td>
                  <td style={{ textAlign: 'right' }}>
                    ₹{item.taxAmount?.toLocaleString()} <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>({item.taxPercent}%)</span>
                  </td>
                  <td style={{ textAlign: 'right', fontWeight: 700 }}>
                    ₹{item.total?.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bottom Details & Totals Summary */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '2rem' }}>
          <div style={{ flex: 1, minWidth: '280px' }}>
            {po.notes && (
              <div style={{ background: 'var(--surface-alt)', padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
                <h4 style={{ fontSize: '0.8125rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                  Procurement Notes
                </h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{po.notes}</p>
              </div>
            )}

            {/* Status Transition Audit History */}
            <div className="party-box">
              <h4>Status Audit Trail</h4>
              <div className="audit-history-list">
                {po.statusHistory?.map((hist, i) => (
                  <div key={i} className="audit-history-item">
                    <div className="audit-bullet"></div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.8125rem' }}>
                        {hist.status} &bull; <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>{new Date(hist.changedAt).toLocaleString()}</span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        {hist.remarks || 'Status updated'} by {hist.changedBy?.name || 'System'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="po-financial-summary">
            <div className="summary-row">
              <span>Subtotal</span>
              <strong>₹{po.subtotal?.toLocaleString()}</strong>
            </div>
            <div className="summary-row">
              <span>Total Tax (GST)</span>
              <strong>₹{po.taxTotal?.toLocaleString()}</strong>
            </div>
            <div className="summary-row grand-total">
              <span>Grand Total</span>
              <span>₹{po.grandTotal?.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Status Change Modal */}
      <Modal
        isOpen={statusModal.isOpen}
        onClose={() => setStatusModal({ ...statusModal, isOpen: false })}
        title={`Transition Status to ${statusModal.nextStatus}`}
        size="md"
      >
        <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
          You are updating purchase order <strong>{po.poNumber}</strong> status to{' '}
          <strong style={{ color: 'var(--primary)' }}>{statusModal.nextStatus}</strong>.
        </p>

        <FormField label="Status Change Remarks (Optional)">
          <textarea
            className="form-textarea"
            rows="3"
            placeholder="Add tracking number, delivery docket #, inspection notes, or approval remarks..."
            value={statusModal.remarks}
            onChange={(e) => setStatusModal({ ...statusModal, remarks: e.target.value })}
          ></textarea>
        </FormField>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
          <Button variant="outline" onClick={() => setStatusModal({ ...statusModal, isOpen: false })}>
            Cancel
          </Button>
          <Button
            variant={statusModal.nextStatus === 'CANCELLED' ? 'danger' : 'primary'}
            loading={statusModal.loading}
            onClick={handleUpdateStatus}
          >
            Confirm Status Update
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default PODetails;
