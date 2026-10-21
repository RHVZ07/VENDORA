import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { vendorService } from '../../services/vendorService';
import { poService } from '../../services/poService';
import Button from '../../components/common/Button';
import FormField from '../../components/common/FormField';
import Input from '../../components/common/Input';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import {
  ShoppingCart,
  ArrowLeft,
  Plus,
  Trash2,
  CheckCircle2,
  Building,
  Calendar,
  CreditCard,
  MapPin,
  FileText,
} from 'lucide-react';

const POCreate = () => {
  const [searchParams] = useSearchParams();
  const preselectedVendorId = searchParams.get('vendorId');

  const [vendors, setVendors] = useState([]);
  const [loadingVendors, setLoadingVendors] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    vendor: preselectedVendorId || '',
    poDate: new Date().toISOString().split('T')[0],
    expectedDeliveryDate: '',
    paymentTerms: 'Net 30',
    shippingAddress: 'VENDORA Central Logistics & Warehouse Facility, Gate 4, Tech Corridor, Bengaluru 560100',
    notes: '',
    status: 'PENDING APPROVAL',
  });

  const [items, setItems] = useState([
    {
      product: '',
      description: '',
      quantity: 1,
      unitPrice: 0,
      taxPercent: 18,
    },
  ]);

  const navigate = useNavigate();

  useEffect(() => {
    const loadVendors = async () => {
      try {
        setLoadingVendors(true);
        const res = await vendorService.getVendors({ status: 'ACTIVE', limit: 100 });
        if (res.success) {
          setVendors(res.vendors || []);
          if (!formData.vendor && res.vendors.length > 0) {
            setFormData((prev) => ({ ...prev, vendor: res.vendors[0]._id }));
          }
        }
      } catch (err) {
        console.error('Error loading active vendors:', err);
      } finally {
        setLoadingVendors(false);
      }
    };

    loadVendors();
  }, []);

  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = field === 'quantity' || field === 'unitPrice' || field === 'taxPercent' ? Number(value) : value;
    setItems(updated);
  };

  const addItemRow = () => {
    setItems([
      ...items,
      {
        product: '',
        description: '',
        quantity: 1,
        unitPrice: 0,
        taxPercent: 18,
      },
    ]);
  };

  const removeItemRow = (index) => {
    if (items.length <= 1) {
      alert('Purchase Order must contain at least one line item');
      return;
    }
    setItems(items.filter((_, idx) => idx !== index));
  };

  // Calculations
  const calculatedSubtotal = items.reduce((sum, item) => {
    return sum + (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0);
  }, 0);

  const calculatedTaxTotal = items.reduce((sum, item) => {
    const itemSub = (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0);
    return sum + (itemSub * (Number(item.taxPercent) || 0)) / 100;
  }, 0);

  const calculatedGrandTotal = calculatedSubtotal + calculatedTaxTotal;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.vendor) {
      alert('Please select a supplier');
      return;
    }

    if (!formData.expectedDeliveryDate) {
      alert('Please provide an expected delivery date');
      return;
    }

    // Validate items
    for (let i = 0; i < items.length; i++) {
      if (!items[i].product.trim()) {
        alert(`Line item #${i + 1} requires a product/service title`);
        return;
      }
      if (items[i].quantity < 1) {
        alert(`Line item #${i + 1} quantity must be at least 1`);
        return;
      }
      if (items[i].unitPrice < 0) {
        alert(`Line item #${i + 1} unit price cannot be negative`);
        return;
      }
    }

    try {
      setSubmitting(true);
      const res = await poService.createPO({
        ...formData,
        items,
      });
      if (res.success) {
        navigate(`/purchase-orders/${res.purchaseOrder._id}`);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create purchase order');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingVendors) return <LoadingSpinner text="Loading supplier catalog..." />;

  return (
    <div className="po-create-page">
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
          marginBottom: '1rem',
          fontWeight: 600,
        }}
      >
        <ArrowLeft size={16} /> Back to Purchase Orders
      </button>

      <div className="page-header">
        <div className="page-title-group">
          <h1>Issue Purchase Order</h1>
          <p>Draft and dispatch a binding procurement purchase order to an active vendor</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Step 1: PO Header & Coordinates */}
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <div className="card-header">
            <h3>1. Supplier & Procurement Parameters</h3>
          </div>

          <div className="form-grid-3">
            <FormField label="Select Active Supplier" required>
              <select
                className="form-select"
                value={formData.vendor}
                onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                required
              >
                <option value="">-- Choose Verified Supplier --</option>
                {vendors.map((v) => (
                  <option key={v._id} value={v._id}>
                    {v.companyName} ({v.vendorId} - {v.industry})
                  </option>
                ))}
              </select>
            </FormField>

            <FormField label="PO Issuance Date" required>
              <Input
                type="date"
                required
                value={formData.poDate}
                onChange={(e) => setFormData({ ...formData, poDate: e.target.value })}
              />
            </FormField>

            <FormField label="Expected Delivery Date" required>
              <Input
                type="date"
                required
                value={formData.expectedDeliveryDate}
                onChange={(e) => setFormData({ ...formData, expectedDeliveryDate: e.target.value })}
              />
            </FormField>
          </div>

          <div className="form-grid-2">
            <FormField label="Payment Terms">
              <select
                className="form-select"
                value={formData.paymentTerms}
                onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
              >
                <option value="Immediate">Immediate on Delivery</option>
                <option value="Net 15">Net 15 Days</option>
                <option value="Net 30">Net 30 Days</option>
                <option value="Net 45">Net 45 Days</option>
                <option value="Net 60">Net 60 Days</option>
                <option value="Advance 50%">Advance 50% / Balance on Delivery</option>
              </select>
            </FormField>

            <FormField label="Initial Lifecycle Status">
              <select
                className="form-select"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="PENDING APPROVAL">Pending Approval (Procurement Signoff)</option>
                <option value="APPROVED">Approved (Direct to Supplier)</option>
                <option value="DRAFT">Draft</option>
              </select>
            </FormField>
          </div>

          <FormField label="Shipping & Delivery Destination Address" required>
            <Input
              required
              value={formData.shippingAddress}
              onChange={(e) => setFormData({ ...formData, shippingAddress: e.target.value })}
              placeholder="Full warehouse / facility address, gate number, contact point..."
            />
          </FormField>
        </div>

        {/* Step 2: Dynamic Line Items */}
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <div className="card-header">
            <div>
              <h3>2. Line Items & Deliverables</h3>
              <p>Specify materials, quantities, unit pricing, and applicable GST</p>
            </div>
            <Button
              type="button"
              variant="outline-primary"
              size="sm"
              icon={Plus}
              onClick={addItemRow}
            >
              Add Item
            </Button>
          </div>

          <div className="table-responsive">
            <table className="po-items-table">
              <thead>
                <tr>
                  <th style={{ width: '25%' }}>Product / Service</th>
                  <th style={{ width: '30%' }}>Description</th>
                  <th style={{ width: '12%' }}>Quantity</th>
                  <th style={{ width: '15%' }}>Unit Price (₹)</th>
                  <th style={{ width: '10%' }}>Tax (%)</th>
                  <th style={{ width: '8%', textAlign: 'center' }}>Remove</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => (
                  <tr key={idx}>
                    <td>
                      <Input
                        required
                        placeholder="e.g. Microcontroller ICs"
                        value={item.product}
                        onChange={(e) => handleItemChange(idx, 'product', e.target.value)}
                      />
                    </td>
                    <td>
                      <Input
                        placeholder="e.g. ARM Cortex-M4 32-bit (Pack of 500)"
                        value={item.description}
                        onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                      />
                    </td>
                    <td>
                      <Input
                        type="number"
                        min="1"
                        required
                        value={item.quantity}
                        onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                      />
                    </td>
                    <td>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        required
                        value={item.unitPrice}
                        onChange={(e) => handleItemChange(idx, 'unitPrice', e.target.value)}
                      />
                    </td>
                    <td>
                      <select
                        className="form-select"
                        value={item.taxPercent}
                        onChange={(e) => handleItemChange(idx, 'taxPercent', e.target.value)}
                      >
                        <option value="0">0%</option>
                        <option value="5">5%</option>
                        <option value="12">12%</option>
                        <option value="18">18%</option>
                        <option value="28">28%</option>
                      </select>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        type="button"
                        className="action-btn delete"
                        onClick={() => removeItemRow(idx)}
                        disabled={items.length <= 1}
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* PO Notes & Calculation Box */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '2rem', marginTop: '1.5rem' }}>
            <div style={{ flex: 1, minWidth: '300px' }}>
              <FormField label="Instructions & Procurement Notes">
                <textarea
                  className="form-textarea"
                  rows="4"
                  placeholder="Special packaging, batch test certificate requirements, gate entry instructions..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                ></textarea>
              </FormField>
            </div>

            <div className="po-financial-summary">
              <div className="summary-row">
                <span>Subtotal</span>
                <strong>₹{calculatedSubtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
              </div>
              <div className="summary-row">
                <span>Total GST / Tax</span>
                <strong>₹{calculatedTaxTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
              </div>
              <div className="summary-row grand-total">
                <span>Grand Total</span>
                <span>₹{calculatedGrandTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
          <Button variant="outline" onClick={() => navigate('/purchase-orders')}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={submitting} icon={CheckCircle2}>
            Generate & Dispatch Purchase Order
          </Button>
        </div>
      </form>
    </div>
  );
};

export default POCreate;
