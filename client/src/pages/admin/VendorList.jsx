import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { vendorService } from '../../services/vendorService';
import Button from '../../components/common/Button';
import StatusBadge from '../../components/common/StatusBadge';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import FormField from '../../components/common/FormField';
import Input from '../../components/common/Input';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import {
  Users,
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Award,
  Power,
  Trash2,
  Star,
  Building,
  CheckCircle,
  XCircle,
} from 'lucide-react';

const VendorList = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [industryFilter, setIndustryFilter] = useState('ALL');
  const [ratingFilter, setRatingFilter] = useState('ALL');
  
  // Modals state
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [newVendor, setNewVendor] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    industry: 'Manufacturing',
    businessType: 'Private Limited',
    address: '',
    city: '',
    state: '',
    pincode: '',
    gstNumber: '',
    panNumber: '',
  });

  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    vendorId: null,
    vendorName: '',
    action: 'status', // status, delete
    newStatus: '',
    title: '',
    message: '',
  });

  const navigate = useNavigate();

  const fetchVendors = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (statusFilter !== 'ALL') params.status = statusFilter;
      if (industryFilter !== 'ALL') params.industry = industryFilter;
      if (ratingFilter !== 'ALL') params.ratingTier = ratingFilter;

      const res = await vendorService.getVendors(params);
      if (res.success) {
        setVendors(res.vendors || []);
      }
    } catch (error) {
      console.error('Error loading vendors:', error);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, industryFilter, ratingFilter]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchVendors();
    }, 250);
    return () => clearTimeout(delayDebounce);
  }, [fetchVendors]);

  const handleToggleStatus = (vendor) => {
    const nextStatus = vendor.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    setConfirmDialog({
      isOpen: true,
      vendorId: vendor._id,
      vendorName: vendor.companyName,
      action: 'status',
      newStatus: nextStatus,
      title: `${nextStatus === 'ACTIVE' ? 'Activate' : 'Suspend'} Vendor`,
      message: `Are you sure you want to change status of ${vendor.companyName} to ${nextStatus}?`,
    });
  };

  const handleConfirmAction = async () => {
    try {
      if (confirmDialog.action === 'status') {
        await vendorService.updateVendorStatus(confirmDialog.vendorId, {
          status: confirmDialog.newStatus,
        });
      } else if (confirmDialog.action === 'delete') {
        await vendorService.deleteVendor(confirmDialog.vendorId);
      }
      setConfirmDialog({ ...confirmDialog, isOpen: false });
      fetchVendors();
    } catch (err) {
      console.error('Action failed:', err);
    }
  };

  const handleCreateVendor = async (e) => {
    e.preventDefault();
    try {
      setCreateLoading(true);
      await vendorService.createVendor({
        ...newVendor,
        status: 'ACTIVE',
      });
      setCreateModalOpen(false);
      setNewVendor({
        companyName: '',
        contactPerson: '',
        email: '',
        phone: '',
        industry: 'Manufacturing',
        businessType: 'Private Limited',
        address: '',
        city: '',
        state: '',
        pincode: '',
        gstNumber: '',
        panNumber: '',
      });
      fetchVendors();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to create vendor');
    } finally {
      setCreateLoading(false);
    }
  };

  const columns = [
    {
      header: 'Vendor ID',
      accessor: 'vendorId',
      width: '120px',
      render: (row) => (
        <span style={{ fontWeight: 700, color: 'var(--primary)', fontFamily: 'Outfit' }}>
          {row.vendorId || 'VND-NEW'}
        </span>
      ),
    },
    {
      header: 'Company Name',
      accessor: 'companyName',
      render: (row) => (
        <div>
          <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{row.companyName}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{row.businessType}</div>
        </div>
      ),
    },
    {
      header: 'Industry',
      accessor: 'industry',
      render: (row) => (
        <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
          {row.industry}
        </span>
      ),
    },
    {
      header: 'Contact Person',
      accessor: 'contactPerson',
      render: (row) => (
        <div>
          <div style={{ fontWeight: 500 }}>{row.contactPerson}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{row.phone}</div>
        </div>
      ),
    },
    {
      header: 'Email',
      accessor: 'email',
      render: (row) => (
        <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
          {row.email}
        </span>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => <StatusBadge status={row.status} size="sm" />,
    },
    {
      header: 'Performance',
      accessor: 'performanceScore',
      render: (row) => (
        <div>
          {row.performanceScore > 0 ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 600 }}>
              <Star size={14} fill="#F59E0B" color="#F59E0B" />
              <span>{row.performanceScore.toFixed(1)}/5.0</span>
            </div>
          ) : (
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Unrated</span>
          )}
        </div>
      ),
    },
    {
      header: 'Registered',
      accessor: 'createdAt',
      render: (row) => (
        <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
          {new Date(row.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      header: 'Actions',
      align: 'right',
      render: (row) => (
        <div className="table-actions" style={{ justifyContent: 'flex-end' }}>
          <button
            className="action-btn"
            title="View Profile"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/vendors/${row._id}`);
            }}
          >
            <Eye size={15} />
          </button>
          <button
            className="action-btn"
            title="Evaluate Performance"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/evaluations/create?vendorId=${row._id}`);
            }}
          >
            <Award size={15} />
          </button>
          <button
            className="action-btn"
            title={row.status === 'ACTIVE' ? 'Suspend Vendor' : 'Activate Vendor'}
            onClick={(e) => {
              e.stopPropagation();
              handleToggleStatus(row);
            }}
          >
            <Power size={15} color={row.status === 'ACTIVE' ? 'var(--warning)' : 'var(--success)'} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="vendor-list-page">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Supplier & Vendor Directory</h1>
          <p>Comprehensive register of verified enterprise suppliers and partners</p>
        </div>
        <div className="page-actions">
          <Button
            variant="primary"
            icon={Plus}
            onClick={() => setCreateModalOpen(true)}
          >
            Add Direct Vendor
          </Button>
        </div>
      </div>

      {/* Search & Filters Toolbar */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem 1.5rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '0.75rem', flex: 1, minWidth: '280px' }}>
            <div style={{ position: 'relative', width: '100%', maxWidth: '340px' }}>
              <Search
                size={16}
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
              />
              <Input
                placeholder="Search company, ID, contact, email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ paddingLeft: '2.4rem' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <select
              className="form-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ width: '140px' }}
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="PENDING">Pending</option>
              <option value="UNDER REVIEW">Under Review</option>
              <option value="APPROVED">Approved</option>
              <option value="SUSPENDED">Suspended</option>
              <option value="REJECTED">Rejected</option>
            </select>

            <select
              className="form-select"
              value={industryFilter}
              onChange={(e) => setIndustryFilter(e.target.value)}
              style={{ width: '180px' }}
            >
              <option value="ALL">All Industries</option>
              <option value="Manufacturing">Manufacturing</option>
              <option value="Electronics & Hardware">Electronics & Hardware</option>
              <option value="Logistics & Supply Chain">Logistics & Supply Chain</option>
              <option value="Raw Materials">Raw Materials</option>
              <option value="Healthcare & Medical">Healthcare & Medical</option>
              <option value="IT & Software">IT & Software</option>
              <option value="Services & Consulting">Services & Consulting</option>
            </select>

            <select
              className="form-select"
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              style={{ width: '150px' }}
            >
              <option value="ALL">All Ratings</option>
              <option value="Excellent">Excellent (&gt;4.5)</option>
              <option value="Good">Good (3.5 - 4.4)</option>
              <option value="Average">Average (2.5 - 3.4)</option>
              <option value="Poor">Poor (&lt;2.5)</option>
              <option value="Unrated">Unrated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Vendors Data Table */}
      <DataTable
        columns={columns}
        data={vendors}
        loading={loading}
        emptyTitle="No vendors match your search"
        emptyDescription="Try adjusting your filters or search keywords."
        onRowClick={(row) => navigate(`/vendors/${row._id}`)}
      />

      {/* Quick Add Vendor Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Add Approved Supplier"
        size="lg"
      >
        <form onSubmit={handleCreateVendor}>
          <div className="form-grid-2">
            <FormField label="Company Name" required>
              <Input
                required
                value={newVendor.companyName}
                onChange={(e) => setNewVendor({ ...newVendor, companyName: e.target.value })}
                placeholder="e.g. Apex Industrial Systems Ltd."
              />
            </FormField>
            <FormField label="Contact Person" required>
              <Input
                required
                value={newVendor.contactPerson}
                onChange={(e) => setNewVendor({ ...newVendor, contactPerson: e.target.value })}
                placeholder="e.g. Rajesh Sharma"
              />
            </FormField>
          </div>

          <div className="form-grid-2">
            <FormField label="Official Email" required>
              <Input
                type="email"
                required
                value={newVendor.email}
                onChange={(e) => setNewVendor({ ...newVendor, email: e.target.value })}
                placeholder="contact@company.com"
              />
            </FormField>
            <FormField label="Phone Number" required>
              <Input
                required
                value={newVendor.phone}
                onChange={(e) => setNewVendor({ ...newVendor, phone: e.target.value })}
                placeholder="+91 98765 43210"
              />
            </FormField>
          </div>

          <div className="form-grid-2">
            <FormField label="Industry / Sector">
              <select
                className="form-select"
                value={newVendor.industry}
                onChange={(e) => setNewVendor({ ...newVendor, industry: e.target.value })}
              >
                <option value="Manufacturing">Manufacturing</option>
                <option value="Electronics & Hardware">Electronics & Hardware</option>
                <option value="Logistics & Supply Chain">Logistics & Supply Chain</option>
                <option value="Raw Materials">Raw Materials</option>
                <option value="Healthcare & Medical">Healthcare & Medical</option>
                <option value="IT & Software">IT & Software</option>
                <option value="Services & Consulting">Services & Consulting</option>
              </select>
            </FormField>
            <FormField label="Business Structure">
              <select
                className="form-select"
                value={newVendor.businessType}
                onChange={(e) => setNewVendor({ ...newVendor, businessType: e.target.value })}
              >
                <option value="Private Limited">Private Limited</option>
                <option value="Public Limited">Public Limited</option>
                <option value="Partnership">Partnership</option>
                <option value="LLP">LLP</option>
                <option value="Sole Proprietorship">Sole Proprietorship</option>
              </select>
            </FormField>
          </div>

          <div className="form-grid-2">
            <FormField label="GST Number">
              <Input
                value={newVendor.gstNumber}
                onChange={(e) => setNewVendor({ ...newVendor, gstNumber: e.target.value })}
                placeholder="29ABCDE1234F1Z5"
              />
            </FormField>
            <FormField label="PAN Number">
              <Input
                value={newVendor.panNumber}
                onChange={(e) => setNewVendor({ ...newVendor, panNumber: e.target.value })}
                placeholder="ABCDE1234F"
              />
            </FormField>
          </div>

          <div className="form-grid-3">
            <FormField label="City">
              <Input
                value={newVendor.city}
                onChange={(e) => setNewVendor({ ...newVendor, city: e.target.value })}
                placeholder="Bengaluru"
              />
            </FormField>
            <FormField label="State">
              <Input
                value={newVendor.state}
                onChange={(e) => setNewVendor({ ...newVendor, state: e.target.value })}
                placeholder="Karnataka"
              />
            </FormField>
            <FormField label="Pincode">
              <Input
                value={newVendor.pincode}
                onChange={(e) => setNewVendor({ ...newVendor, pincode: e.target.value })}
                placeholder="560100"
              />
            </FormField>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <Button variant="outline" onClick={() => setCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={createLoading}>
              Save & Activate Vendor
            </Button>
          </div>
        </form>
      </Modal>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
        onConfirm={handleConfirmAction}
        title={confirmDialog.title}
        message={confirmDialog.message}
        variant={confirmDialog.newStatus === 'SUSPENDED' || confirmDialog.action === 'delete' ? 'danger' : 'primary'}
      />
    </div>
  );
};

export default VendorList;
