import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { dashboardService } from '../../services/dashboardService';
import StatCard from '../../components/common/StatCard';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import {
  Users,
  Clock,
  CheckCircle2,
  Award,
  ShoppingCart,
  DollarSign,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  PlusCircle,
  FileCheck,
  Star,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  AreaChart,
  Area,
} from 'recharts';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const res = await dashboardService.getAdminStats();
        if (res.success) {
          setData(res);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard metrics');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <LoadingSpinner text="Generating procurement dashboard analytics..." />;
  if (error) return <div className="card" style={{ color: 'var(--danger)', padding: '2rem' }}>{error}</div>;

  const { stats, charts, recentVendors, recentPurchaseOrders, pendingApprovals } = data;
  const pendingCount = (pendingApprovals.onboarding?.length || 0) + (pendingApprovals.purchaseOrders?.length || 0);

  return (
    <div className="admin-dashboard">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h1>Procurement Command Center</h1>
          <p>Real-time analytics on supplier onboarding, vendor scorecards, and purchase orders</p>
        </div>
        <div className="page-actions">
          <Button
            variant="outline"
            icon={FileCheck}
            onClick={() => navigate('/onboarding-requests')}
          >
            Review Applications ({stats.pendingOnboarding})
          </Button>
          <Button
            variant="primary"
            icon={PlusCircle}
            onClick={() => navigate('/purchase-orders/create')}
          >
            Create Purchase Order
          </Button>
        </div>
      </div>

      {/* Pending Approvals Alert Banner */}
      {pendingCount > 0 && (
        <div className="pending-approvals-banner">
          <div className="banner-content">
            <div className="banner-icon">
              <AlertCircle size={22} />
            </div>
            <div className="banner-text">
              <h4>{pendingCount} Pending Procurement Actions Require Your Review</h4>
              <p>
                {pendingApprovals.onboarding?.length || 0} supplier onboarding applications and{' '}
                {pendingApprovals.purchaseOrders?.length || 0} purchase orders are awaiting signoff.
              </p>
            </div>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/onboarding-requests')}
          >
            Action Now
          </Button>
        </div>
      )}

      {/* 6 Statistics Cards Grid */}
      <div className="dashboard-stats-grid">
        <StatCard
          title="Total Vendors"
          value={stats.totalVendors}
          subtitle="Registered suppliers"
          icon={Users}
          color="purple"
        />
        <StatCard
          title="Pending Onboarding"
          value={stats.pendingOnboarding}
          subtitle="Awaiting verification"
          icon={Clock}
          color="amber"
        />
        <StatCard
          title="Active Vendors"
          value={stats.activeVendors}
          subtitle="Approved & verified"
          icon={CheckCircle2}
          color="emerald"
        />
        <StatCard
          title="Pending Evaluations"
          value={stats.pendingEvaluations}
          subtitle="Unrated active suppliers"
          icon={Award}
          color="pink"
        />
        <StatCard
          title="Active Purchase Orders"
          value={stats.activePurchaseOrders}
          subtitle="In fulfillment pipeline"
          icon={ShoppingCart}
          color="blue"
        />
        <StatCard
          title="Total PO Value"
          value={`₹${(stats.totalPurchaseOrderValue / 100000).toFixed(1)}L`}
          subtitle="Cumulated procurement"
          icon={DollarSign}
          color="purple"
        />
      </div>

      {/* Charts Grid */}
      <div className="dashboard-charts-grid">
        {/* Monthly Spend Chart */}
        <div className="card chart-card-col-8">
          <div className="card-header">
            <div>
              <h3>Monthly Procurement Spend Trend</h3>
              <p>Total value of purchase orders processed over recent periods</p>
            </div>
          </div>
          <div className="chart-container">
            {charts.monthlySpendChart && charts.monthlySpendChart.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={charts.monthlySpendChart}>
                  <defs>
                    <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stop-color="#7C3AED" stop-opacity={0.35} />
                      <stop offset="95%" stop-color="#7C3AED" stop-opacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} />
                  <YAxis
                    stroke="#94A3B8"
                    fontSize={12}
                    tickFormatter={(val) => `₹${val >= 100000 ? (val / 100000).toFixed(0) + 'L' : val}`}
                  />
                  <Tooltip
                    formatter={(val) => [`₹${Number(val).toLocaleString()}`, 'Spend Value']}
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '8px',
                      border: '1px solid #E2E8F0',
                      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="spend"
                    stroke="#7C3AED"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#spendGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: '#94A3B8' }}>
                No spend data recorded yet
              </div>
            )}
          </div>
        </div>

        {/* Vendor Status Distribution */}
        <div className="card chart-card-col-4">
          <div className="card-header">
            <div>
              <h3>Vendor Status Distribution</h3>
              <p>Breakdown across lifecycle stages</p>
            </div>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={charts.vendorStatusChart.filter((c) => c.value > 0)}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={95}
                  paddingAngle={4}
                >
                  {charts.vendorStatusChart.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val, name) => [`${val} Vendors`, name]}
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '8px',
                    border: '1px solid #E2E8F0',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center', marginTop: '0.5rem' }}>
            {charts.vendorStatusChart.filter((c) => c.value > 0).map((item) => (
              <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: item.color }}></span>
                <span>{item.name}: <strong>{item.value}</strong></span>
              </div>
            ))}
          </div>
        </div>

        {/* Vendor Performance Distribution */}
        <div className="card chart-card-col-6">
          <div className="card-header">
            <div>
              <h3>Supplier Performance Ratings</h3>
              <p>Active vendors grouped by evaluation score tier</p>
            </div>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.vendorPerformanceChart} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" horizontal={false} />
                <XAxis type="number" stroke="#94A3B8" fontSize={12} allowDecimals={false} />
                <YAxis dataKey="name" type="category" stroke="#94A3B8" fontSize={11} width={130} />
                <Tooltip
                  formatter={(val) => [`${val} Vendors`, 'Count']}
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '8px',
                    border: '1px solid #E2E8F0',
                  }}
                />
                <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                  {charts.vendorPerformanceChart.map((entry, index) => (
                    <Cell key={`perf-cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* PO Status Lifecycle Breakdown */}
        <div className="card chart-card-col-6">
          <div className="card-header">
            <div>
              <h3>Purchase Order Fulfillment Status</h3>
              <p>Active purchase orders by execution stage</p>
            </div>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.poStatusChart.filter((p) => p.value > 0)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} />
                <YAxis stroke="#94A3B8" fontSize={12} allowDecimals={false} />
                <Tooltip
                  formatter={(val) => [`${val} Orders`, 'Volume']}
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '8px',
                    border: '1px solid #E2E8F0',
                  }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {charts.poStatusChart.map((entry, index) => (
                    <Cell key={`po-cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Tables Section: Recent Vendors & Recent POs */}
      <div className="dashboard-charts-grid">
        {/* Recent Vendors */}
        <div className="card chart-card-col-6">
          <div className="card-header">
            <div>
              <h3>Recent Vendor Registrations</h3>
              <p>Latest suppliers added to VENDORA</p>
            </div>
            <Link to="/vendors" style={{ fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Vendor</th>
                  <th>Industry</th>
                  <th>Status</th>
                  <th>Rating</th>
                </tr>
              </thead>
              <tbody>
                {recentVendors.map((v) => (
                  <tr key={v._id} onClick={() => navigate(`/vendors/${v._id}`)} style={{ cursor: 'pointer' }}>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{v.companyName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{v.vendorId} &bull; {v.contactPerson}</div>
                    </td>
                    <td style={{ fontSize: '0.8125rem' }}>{v.industry}</td>
                    <td>
                      <StatusBadge status={v.status} size="sm" />
                    </td>
                    <td>
                      {v.performanceScore > 0 ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.8125rem' }}>
                          <Star size={13} fill="#F59E0B" color="#F59E0B" />
                          {v.performanceScore.toFixed(1)}
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Unrated</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Purchase Orders */}
        <div className="card chart-card-col-6">
          <div className="card-header">
            <div>
              <h3>Recent Purchase Orders</h3>
              <p>Latest procurement orders created</p>
            </div>
            <Link to="/purchase-orders" style={{ fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>PO Number</th>
                  <th>Vendor</th>
                  <th>Grand Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentPurchaseOrders.map((po) => (
                  <tr key={po._id} onClick={() => navigate(`/purchase-orders/${po._id}`)} style={{ cursor: 'pointer' }}>
                    <td style={{ fontWeight: 700, color: 'var(--primary)' }}>
                      {po.poNumber}
                    </td>
                    <td>
                      <div style={{ fontWeight: 500 }}>{po.vendor?.companyName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{po.vendor?.vendorId}</div>
                    </td>
                    <td style={{ fontWeight: 700 }}>
                      ₹{po.grandTotal?.toLocaleString()}
                    </td>
                    <td>
                      <StatusBadge status={po.status} size="sm" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
