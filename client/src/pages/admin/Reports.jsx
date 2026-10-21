import React, { useState, useEffect } from 'react';
import { dashboardService } from '../../services/dashboardService';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import {
  BarChart3,
  Printer,
  Download,
  DollarSign,
  Users,
  ShoppingCart,
  Award,
  TrendingUp,
  FileCheck,
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
  Legend,
  AreaChart,
  Area,
} from 'recharts';

const Reports = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReports = async () => {
      try {
        setLoading(true);
        const res = await dashboardService.getAdminStats();
        if (res.success) {
          setData(res);
        }
      } catch (err) {
        console.error('Error fetching reports data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadReports();
  }, []);

  if (loading) return <LoadingSpinner text="Generating executive procurement reports..." />;
  if (!data) return <div className="card">Unable to load report metrics.</div>;

  const { stats, charts } = data;

  return (
    <div className="reports-page">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Procurement & Supplier Reports</h1>
          <p>Strategic analytics, order volume trends, and vendor capability distributions</p>
        </div>
        <div className="page-actions">
          <Button variant="outline" icon={Printer} onClick={() => window.print()}>
            Print Executive Report
          </Button>
        </div>
      </div>

      {/* KPI Highlights Row */}
      <div className="reports-kpi-grid">
        <div className="stat-card">
          <div className="stat-info">
            <span className="stat-label">Total Spend Executed</span>
            <span className="stat-value">₹{Number(stats.totalPurchaseOrderValue).toLocaleString()}</span>
            <span className="stat-subtitle">Across all active & fulfilled orders</span>
          </div>
          <div className="stat-icon-wrapper purple">
            <DollarSign size={24} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <span className="stat-label">Verified Suppliers</span>
            <span className="stat-value">{stats.activeVendors}</span>
            <span className="stat-subtitle">Out of {stats.totalVendors} total registered</span>
          </div>
          <div className="stat-icon-wrapper emerald">
            <Users size={24} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <span className="stat-label">Pending Onboarding</span>
            <span className="stat-value">{stats.pendingOnboarding}</span>
            <span className="stat-subtitle">Applications under review</span>
          </div>
          <div className="stat-icon-wrapper amber">
            <FileCheck size={24} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <span className="stat-label">Active Purchase Orders</span>
            <span className="stat-value">{stats.activePurchaseOrders}</span>
            <span className="stat-subtitle">In fulfillment pipeline</span>
          </div>
          <div className="stat-icon-wrapper blue">
            <ShoppingCart size={24} />
          </div>
        </div>
      </div>

      {/* Reports Visuals Grid */}
      <div className="reports-charts-grid">
        {/* Monthly Spend Evolution */}
        <div className="card">
          <div className="card-header">
            <h3>Procurement Spend & Budget Trend (INR)</h3>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={charts.monthlySpendChart || []}>
                <defs>
                  <linearGradient id="repSpendGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stop-color="#7C3AED" stop-opacity={0.35} />
                    <stop offset="95%" stop-color="#7C3AED" stop-opacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} />
                <YAxis stroke="#94A3B8" fontSize={12} tickFormatter={(val) => `₹${(val / 100000).toFixed(0)}L`} />
                <Tooltip
                  formatter={(val) => [`₹${Number(val).toLocaleString()}`, 'Total Spend']}
                  contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #E2E8F0' }}
                />
                <Area type="monotone" dataKey="spend" stroke="#7C3AED" strokeWidth={3} fillOpacity={1} fill="url(#repSpendGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* PO Status Breakdown */}
        <div className="card">
          <div className="card-header">
            <h3>Purchase Order Volume by Status</h3>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.poStatusChart.filter((c) => c.value > 0)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} />
                <YAxis stroke="#94A3B8" fontSize={12} allowDecimals={false} />
                <Tooltip
                  formatter={(val) => [`${val} POs`, 'Count']}
                  contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #E2E8F0' }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {charts.poStatusChart.map((entry, index) => (
                    <Cell key={`rep-po-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Supplier Performance Distribution */}
        <div className="card">
          <div className="card-header">
            <h3>Supplier Performance Matrix Tiers</h3>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.vendorPerformanceChart} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" horizontal={false} />
                <XAxis type="number" stroke="#94A3B8" fontSize={12} allowDecimals={false} />
                <YAxis dataKey="name" type="category" stroke="#94A3B8" fontSize={11} width={130} />
                <Tooltip
                  formatter={(val) => [`${val} Suppliers`, 'Total']}
                  contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #E2E8F0' }}
                />
                <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                  {charts.vendorPerformanceChart.map((entry, index) => (
                    <Cell key={`rep-perf-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Vendor Status Distribution */}
        <div className="card">
          <div className="card-header">
            <h3>Supplier Lifecycle Distribution</h3>
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
                  outerRadius={95}
                  innerRadius={50}
                  paddingAngle={3}
                >
                  {charts.vendorStatusChart.map((entry, index) => (
                    <Cell key={`rep-pie-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val, name) => [`${val} Suppliers`, name]}
                  contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #E2E8F0' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
