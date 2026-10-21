import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { dashboardService } from '../../services/dashboardService';
import StatCard from '../../components/common/StatCard';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import {
  Building,
  ShieldCheck,
  Award,
  ShoppingCart,
  DollarSign,
  FileText,
  ArrowRight,
  CheckCircle2,
  Clock,
  AlertCircle,
  Star,
  Upload,
} from 'lucide-react';

const VendorDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVendorStats = async () => {
      try {
        setLoading(true);
        const res = await dashboardService.getVendorStats();
        if (res.success) {
          setData(res);
        }
      } catch (err) {
        console.error('Error fetching vendor dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchVendorStats();
  }, []);

  if (loading) return <LoadingSpinner text="Loading supplier portal dashboard..." />;

  const { stats, vendor, recentPOs = [], documents = [], evaluations = [] } = data || {};

  return (
    <div className="vendor-dashboard">
      {/* Welcome Banner */}
      <div className="vendor-welcome-banner">
        <div className="vendor-banner-top">
          <div className="vendor-banner-title">
            <h1>Welcome, {vendor?.companyName || 'Supplier Partner'}</h1>
            <p>Vendor ID: <strong>{vendor?.vendorId || 'Pending Assignment'}</strong> &bull; {vendor?.industry || 'Commercial Supplier'}</p>
          </div>
          <div>
            <StatusBadge status={stats?.applicationStatus || 'PENDING'} />
          </div>
        </div>

        {/* Profile Completion Bar */}
        <div className="profile-progress-box">
          <div className="progress-header">
            <span>Supplier Onboarding & Compliance Profile</span>
            <span>{stats?.profileCompletion || 0}% Completed</span>
          </div>
          <div className="progress-bar-bg">
            <div
              className="progress-bar-fill"
              style={{ width: `${stats?.profileCompletion || 0}%` }}
            ></div>
          </div>
          {stats?.profileCompletion < 100 && (
            <div style={{ marginTop: '0.75rem', display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="secondary"
                size="sm"
                icon={ShieldCheck}
                onClick={() => navigate('/onboarding')}
              >
                Complete Onboarding Application
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Application Status Banner Alert if needed */}
      {stats?.applicationStatus === 'PENDING' && (
        <div className="pending-approvals-banner" style={{ background: '#EFF6FF', borderColor: '#3B82F6', color: '#1E40AF' }}>
          <div className="banner-content">
            <div className="banner-icon" style={{ background: '#3B82F6' }}>
              <Clock size={20} />
            </div>
            <div className="banner-text">
              <h4 style={{ color: '#1E3A8A' }}>Onboarding Application Under Procurement Verification</h4>
              <p style={{ color: '#1E40AF' }}>Your credentials and tax documentation are currently being evaluated by the procurement administration.</p>
            </div>
          </div>
          <Button variant="primary" size="sm" onClick={() => navigate('/onboarding')}>
            View Submission
          </Button>
        </div>
      )}

      {stats?.applicationStatus === 'UNDER REVIEW' && (
        <div className="pending-approvals-banner">
          <div className="banner-content">
            <div className="banner-icon">
              <AlertCircle size={20} />
            </div>
            <div className="banner-text">
              <h4>Action Required: Changes Requested by Procurement Team</h4>
              <p>{vendor?.requestedChanges || 'Please check your application documents and resubmit updates.'}</p>
            </div>
          </div>
          <Button variant="primary" size="sm" onClick={() => navigate('/onboarding')}>
            Update Details
          </Button>
        </div>
      )}

      {/* KPI Stats Grid */}
      <div className="dashboard-stats-grid">
        <StatCard
          title="Performance Rating"
          value={stats?.performanceScore ? `${stats.performanceScore.toFixed(1)}/5.0` : 'Unrated'}
          subtitle={stats?.ratingTier ? `${stats.ratingTier} Tier Supplier` : 'Pending evaluation'}
          icon={Award}
          color="purple"
        />

        <StatCard
          title="Active Purchase Orders"
          value={stats?.activePurchaseOrders || 0}
          subtitle="Orders in execution"
          icon={ShoppingCart}
          color="blue"
        />

        <StatCard
          title="Completed Orders"
          value={stats?.completedPurchaseOrders || 0}
          subtitle="Fulfilled & delivered"
          icon={CheckCircle2}
          color="emerald"
        />

        <StatCard
          title="Revenue Earned"
          value={`₹${((stats?.totalEarned || 0) / 100000).toFixed(1)}L`}
          subtitle="Cumulated completed POs"
          icon={DollarSign}
          color="pink"
        />
      </div>

      {/* Main Grid: Recent POs & Performance Widget */}
      <div className="dashboard-charts-grid">
        {/* Recent Purchase Orders Table */}
        <div className="card chart-card-col-8">
          <div className="card-header">
            <div>
              <h3>Assigned Purchase Orders</h3>
              <p>Procurement orders issued to your enterprise</p>
            </div>
            <Link to="/purchase-orders" style={{ fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              View All <ArrowRight size={14} />
            </Link>
          </div>

          {recentPOs.length === 0 ? (
            <div style={{ padding: '2.5rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              No purchase orders issued yet. Complete onboarding to receive orders.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>PO Number</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {recentPOs.map((po) => (
                    <tr key={po._id} onClick={() => navigate(`/purchase-orders/${po._id}`)} style={{ cursor: 'pointer' }}>
                      <td style={{ fontWeight: 700, color: 'var(--primary)' }}>{po.poNumber}</td>
                      <td>{new Date(po.poDate).toLocaleDateString()}</td>
                      <td style={{ fontWeight: 700 }}>₹{po.grandTotal?.toLocaleString()}</td>
                      <td><StatusBadge status={po.status} size="sm" /></td>
                      <td style={{ textAlign: 'right' }}>
                        <Button variant="outline" size="sm" onClick={() => navigate(`/purchase-orders/${po._id}`)}>
                          Track Order
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right Column: Performance Scorecard & Quick Links */}
        <div className="chart-card-col-4" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Performance Spotlight */}
          <div className="overall-score-spotlight" style={{ padding: '2rem 1.5rem' }}>
            <span style={{ fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#DDD6FE', fontWeight: 700 }}>
              Performance Rating
            </span>

            <div className="score-circle-badge" style={{ width: '120px', height: '120px', margin: '1rem 0' }}>
              <span className="score-num">{stats?.performanceScore ? stats.performanceScore.toFixed(1) : '0.0'}</span>
              <span className="score-total">out of 5.0</span>
            </div>

            <div className={`rating-tier-pill ${(stats?.ratingTier || 'Unrated').toLowerCase()}`} style={{ fontSize: '0.8125rem' }}>
              {stats?.ratingTier || 'Unrated'}
            </div>

            <div style={{ marginTop: '1.25rem' }}>
              <Link to="/performance" style={{ color: '#F5D0FE', fontSize: '0.8125rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                View 6-Factor Criteria Matrix <ArrowRight size={13} />
              </Link>
            </div>
          </div>

          {/* Quick Action Card */}
          <div className="card">
            <div className="card-header" style={{ marginBottom: '1rem', paddingBottom: '0.5rem' }}>
              <h3>Quick Actions</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <Button
                variant="outline"
                icon={FileText}
                style={{ justifyContent: 'flex-start' }}
                onClick={() => navigate('/documents')}
              >
                Upload Compliance Documents
              </Button>
              <Button
                variant="outline"
                icon={Building}
                style={{ justifyContent: 'flex-start' }}
                onClick={() => navigate('/vendor/profile')}
              >
                Update Company Profile
              </Button>
              <Button
                variant="outline"
                icon={ShoppingCart}
                style={{ justifyContent: 'flex-start' }}
                onClick={() => navigate('/purchase-orders')}
              >
                Check Active Shipments
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;
