import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { poService } from '../../services/poService';
import Button from '../../components/common/Button';
import StatusBadge from '../../components/common/StatusBadge';
import DataTable from '../../components/common/DataTable';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import {
  ShoppingCart,
  Plus,
  Search,
  Filter,
  Eye,
  Trash2,
  Calendar,
  Building,
} from 'lucide-react';

const POList = () => {
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, id: null });

  const navigate = useNavigate();

  const fetchPOs = async () => {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter !== 'ALL') params.status = statusFilter;
      if (search) params.search = search;

      const res = await poService.getPurchaseOrders(params);
      if (res.success) {
        setPurchaseOrders(res.purchaseOrders || []);
      }
    } catch (err) {
      console.error('Error fetching purchase orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPOs();
  }, [statusFilter]);

  const handleDeletePO = async () => {
    try {
      await poService.deletePO(deleteConfirm.id);
      setDeleteConfirm({ isOpen: false, id: null });
      fetchPOs();
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  const columns = [
    {
      header: 'PO Number',
      accessor: 'poNumber',
      width: '140px',
      render: (row) => (
        <span style={{ fontWeight: 700, color: 'var(--primary)', fontFamily: 'Outfit' }}>
          {row.poNumber}
        </span>
      ),
    },
    {
      header: 'Vendor / Supplier',
      accessor: 'vendor',
      render: (row) => (
        <div>
          <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{row.vendor?.companyName}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{row.vendor?.vendorId}</div>
        </div>
      ),
    },
    {
      header: 'PO Date',
      accessor: 'poDate',
      render: (row) => (
        <span style={{ fontSize: '0.8125rem' }}>
          {new Date(row.poDate).toLocaleDateString()}
        </span>
      ),
    },
    {
      header: 'Expected Delivery',
      accessor: 'expectedDeliveryDate',
      render: (row) => (
        <span style={{ fontSize: '0.8125rem' }}>
          {new Date(row.expectedDeliveryDate).toLocaleDateString()}
        </span>
      ),
    },
    {
      header: 'Grand Total',
      accessor: 'grandTotal',
      render: (row) => (
        <span style={{ fontWeight: 800, fontFamily: 'Outfit', color: 'var(--text-primary)' }}>
          ₹{row.grandTotal?.toLocaleString()}
        </span>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => <StatusBadge status={row.status} size="sm" />,
    },
    {
      header: 'Actions',
      align: 'right',
      render: (row) => (
        <div className="table-actions" style={{ justifyContent: 'flex-end' }}>
          <button
            className="action-btn"
            title="View PO Details"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/purchase-orders/${row._id}`);
            }}
          >
            <Eye size={15} />
          </button>
          {(row.status === 'DRAFT' || row.status === 'CANCELLED') && (
            <button
              className="action-btn delete"
              title="Delete Draft"
              onClick={(e) => {
                e.stopPropagation();
                setDeleteConfirm({ isOpen: true, id: row._id });
              }}
            >
              <Trash2 size={15} />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="po-list-page">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Purchase Orders</h1>
          <p>Orchestrate procurement orders, fulfillment statuses, and milestone tracking</p>
        </div>
        <div className="page-actions">
          <Button
            variant="primary"
            icon={Plus}
            onClick={() => navigate('/purchase-orders/create')}
          >
            Create Purchase Order
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {['ALL', 'PENDING APPROVAL', 'APPROVED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'COMPLETED', 'DRAFT', 'CANCELLED'].map((st) => (
              <button
                key={st}
                type="button"
                className={`btn ${statusFilter === st ? 'btn-primary' : 'btn-outline'} btn-sm`}
                onClick={() => setStatusFilter(st)}
              >
                {st}
              </button>
            ))}
          </div>

          <div style={{ width: '280px' }}>
            <input
              type="text"
              className="form-input"
              placeholder="Search PO Number, address..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchPOs()}
            />
          </div>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={purchaseOrders}
        loading={loading}
        emptyTitle="No purchase orders found"
        emptyDescription="There are no purchase orders matching your filters."
        onRowClick={(row) => navigate(`/purchase-orders/${row._id}`)}
      />

      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, id: null })}
        onConfirm={handleDeletePO}
        title="Delete Purchase Order"
        message="Are you sure you want to delete this purchase order? This action cannot be undone."
      />
    </div>
  );
};

export default POList;
