import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { onboardingService } from '../../services/onboardingService';
import Button from '../../components/common/Button';
import StatusBadge from '../../components/common/StatusBadge';
import DataTable from '../../components/common/DataTable';
import {
  UserCheck,
  Search,
  Filter,
  Eye,
  FileCheck,
  CheckCircle,
  Clock,
  Building,
} from 'lucide-react';

const OnboardingRequests = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter !== 'ALL') params.status = statusFilter;
      if (search) params.search = search;

      const res = await onboardingService.getApplications(params);
      if (res.success) {
        setApplications(res.applications || []);
      }
    } catch (err) {
      console.error('Error fetching onboarding applications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [statusFilter]);

  const columns = [
    {
      header: 'Vendor ID',
      accessor: 'vendorId',
      width: '120px',
      render: (row) => (
        <span style={{ fontWeight: 700, color: 'var(--primary)', fontFamily: 'Outfit' }}>
          {row.vendorId || 'VND-APP'}
        </span>
      ),
    },
    {
      header: 'Company / Enterprise',
      accessor: 'companyName',
      render: (row) => (
        <div>
          <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{row.companyName}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{row.industry} &bull; {row.businessType}</div>
        </div>
      ),
    },
    {
      header: 'Contact Person',
      accessor: 'contactPerson',
      render: (row) => (
        <div>
          <div style={{ fontWeight: 500 }}>{row.contactPerson}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{row.email}</div>
        </div>
      ),
    },
    {
      header: 'Tax ID / GST',
      accessor: 'gstNumber',
      render: (row) => (
        <span style={{ fontSize: '0.8125rem', fontFamily: 'monospace' }}>
          {row.gstNumber || row.panNumber || 'Pending'}
        </span>
      ),
    },
    {
      header: 'Step Reached',
      accessor: 'onboardingStep',
      render: (row) => (
        <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
          Step {row.onboardingStep || 1} / 6
        </span>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => <StatusBadge status={row.status} size="sm" />,
    },
    {
      header: 'Submitted',
      accessor: 'updatedAt',
      render: (row) => (
        <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
          {new Date(row.updatedAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      header: 'Action',
      align: 'right',
      render: (row) => (
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="primary"
            size="sm"
            icon={FileCheck}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/onboarding-requests/${row._id}`);
            }}
          >
            Review Application
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="onboarding-requests-page">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Supplier Onboarding Submissions</h1>
          <p>Review and verify compliance documents and credentials submitted by suppliers</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {['ALL', 'PENDING', 'UNDER REVIEW', 'APPROVED', 'REJECTED'].map((st) => (
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
              placeholder="Search applications..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchApplications()}
            />
          </div>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={applications}
        loading={loading}
        emptyTitle="No onboarding applications found"
        emptyDescription="There are currently no supplier applications matching the selected criteria."
        onRowClick={(row) => navigate(`/onboarding-requests/${row._id}`)}
      />
    </div>
  );
};

export default OnboardingRequests;
