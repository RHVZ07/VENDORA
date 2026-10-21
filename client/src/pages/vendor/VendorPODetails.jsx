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
  Truck,
  PackageCheck,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';

const VendorPODetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [po, setPo] = useState(null);
  const [loading, setLoading] = useState(true);
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
      console.error('Error loading PO:', err);
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
      alert(err.response?.data?.message || 'Update failed');
      setStatusModal((prev) => ({ ...prev, loading: false }));
    }
  };

  if (loading) return <LoadingSpinner text="Retrieving purchase order details..." />;
  if (!po) return <div className="card">Purchase Order not found</div>;

  return (
    <div className="vendor-po-details-page">
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
          <ArrowLeft size={16} /> Back to My Orders
        </button>

        <Button variant="outline" icon={Printer} onClick={() => window.print()}>
          Print PO View
        </Button>
      </div>

      <POTimeline currentStatus={po.status} statusHistory={po.statusHistory || []} />

      {/* Vendor Fulfillment Controls */}
      <div className="card" style={{ marginBottom: '1.75rem', padding: '1.25rem 1.75rem', background: 'var(--surface-alt)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Fulfillment Status:
            </span>
            <StatusBadge status={po.status} />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {po.status === 'APPROVED' && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => setStatusModal({ isOpen: true, nextStatus: 'PROCESSING', remarks: 'Production and assembly started' })}
              >
                Acknowledge & Start Processing
              </Button>
            )}

            {po.status === 'PROCESSING' && (
              <Button
                variant="primary"
                size="sm"
                icon={Truck}
                onClick={() => setStatusModal({ isOpen: true, nextStatus: 'SHIPPED', remarks: 'Dispatched with logistics carrier' })}
              >
                Mark Order as Shipped
              </Button>
            )}

            {po.status === 'SHIPPED' && (
              <Button
                variant="primary"
                size="sm"
                icon={PackageCheck}
                onClick={() => setStatusModal({ isOpen: true, nextStatus: 'DELIVERED', remarks: 'Shipment delivered at receiving dock' })}
              >
                Confirm Delivery
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Invoice Card */}
      <div className="invoice-card">
        <div className="invoice-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <div className="brand-icon-wrapper" style={{ width: '32px', height: '32px' }}>
                <Sparkles size={16} />
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>VENDORA PROCUREMENT</h2>
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              Purchase Order Docket & Shipping Manifest
            </p>
          </div>

          <div style={{ textAlign: 'right' }}>
            <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'Outfit' }}>
              {po.poNumber}
            </h1>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
              <strong>Date:</strong> {new Date(po.poDate).toLocaleDateString()}
            </div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
              <strong>Required Delivery:</strong> {new Date(po.expectedDeliveryDate).toLocaleDateString()}
            </div>
          </div>
        </div>

        <div className="invoice-parties-grid">
          <div className="party-box">
            <h4>Supplier Details</h4>
            <div className="party-name">{po.vendor?.companyName}</div>
            <p>
              {po.vendor?.address}
              <br />
              <strong>Contact:</strong> {po.vendor?.contactPerson}
              <br />
              <strong>Email:</strong> {po.vendor?.email}
            </p>
          </div>

          <div className="party-box">
            <h4>Shipping Destination</h4>
            <div className="party-name">VENDORA Receiving Facility</div>
            <p>
              {po.shippingAddress}
              <br />
              <strong>Payment Terms:</strong> {po.paymentTerms}
            </p>
          </div>
        </div>

        {/* Line items */}
        <div className="table-responsive" style={{ marginBottom: '2rem' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Deliverable Description</th>
                <th style={{ textAlign: 'center' }}>Qty</th>
                <th style={{ textAlign: 'right' }}>Unit Price (₹)</th>
                <th style={{ textAlign: 'right' }}>Tax (GST)</th>
                <th style={{ textAlign: 'right' }}>Total (₹)</th>
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
                  <td style={{ textAlign: 'right' }}>₹{item.taxAmount?.toLocaleString()}</td>
                  <td style={{ textAlign: 'right', fontWeight: 700 }}>₹{item.total?.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <div className="po-financial-summary">
            <div className="summary-row">
              <span>Subtotal</span>
              <strong>₹{po.subtotal?.toLocaleString()}</strong>
            </div>
            <div className="summary-row">
              <span>Tax (GST)</span>
              <strong>₹{po.taxTotal?.toLocaleString()}</strong>
            </div>
            <div className="summary-row grand-total">
              <span>Grand Total</span>
              <span>₹{po.grandTotal?.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Status Modal */}
      <Modal
        isOpen={statusModal.isOpen}
        onClose={() => setStatusModal({ ...statusModal, isOpen: false })}
        title={`Update Fulfillment to ${statusModal.nextStatus}`}
        size="md"
      >
        <FormField label="Fulfillment Remarks / AWB Tracking #">
          <textarea
            className="form-textarea"
            rows="3"
            value={statusModal.remarks}
            onChange={(e) => setStatusModal({ ...statusModal, remarks: e.target.value })}
            placeholder="Add tracking carrier number, dispatch details..."
          ></textarea>
        </FormField>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
          <Button variant="outline" onClick={() => setStatusModal({ ...statusModal, isOpen: false })}>
            Cancel
          </Button>
          <Button variant="primary" loading={statusModal.loading} onClick={handleUpdateStatus}>
            Confirm Status Update
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default VendorPODetails;
