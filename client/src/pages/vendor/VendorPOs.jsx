import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { poService } from '../../services/poService';
import Button from '../../components/common/Button';
import StatusBadge from '../../components/common/StatusBadge';
import DataTable from '../../components/common/DataTable';
import {
  ShoppingCart,
  Search,
  Eye,
  Calendar,
} from 'lucide-react';

const VendorPOs = () => {
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');
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

  const columns = [
    {
      header: 'PO Number',
      accessor: 'poNumber',
      render: (row) => (
        <span style={{ fontWeight: 700, color: 'var(--primary)', fontFamily: 'Outfit' }}>
          {row.poNumber}
        </span>
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
      header: 'Order Value',
      accessor: 'grandTotal',
      render: (row) => (
        <span style={{ fontWeight: 800, fontFamily: 'Outfit' }}>
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
      header: 'Action',
      align: 'right',
      render: (row) => (
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="outline"
            size="sm"
            icon={Eye}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/purchase-orders/${row._id}`);
            }}
          >
            Track & Fulfill
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="vendor-pos-page">
      <div className="page-header">
        <div className="page-title-group">
          <h1>My Purchase Orders</h1>
          <p>Track assigned procurement orders, update manufacturing status, and log shipments</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {['ALL', 'APPROVED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'COMPLETED'].map((st) => (
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
              placeholder="Search PO Number..."
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
        emptyDescription="You do not have any purchase orders under this filter."
        onRowClick={(row) => navigate(`/purchase-orders/${row._id}`)}
      />
    </div>
  );
};

export default VendorPOs;
