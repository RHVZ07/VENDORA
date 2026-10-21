import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { evaluationService } from '../../services/evaluationService';
import Button from '../../components/common/Button';
import DataTable from '../../components/common/DataTable';
import {
  Award,
  Plus,
  Star,
  Search,
  Filter,
  Building,
  CheckCircle2,
} from 'lucide-react';

const EvaluationList = () => {
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ratingTierFilter, setRatingTierFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const fetchEvaluations = async () => {
    try {
      setLoading(true);
      const params = {};
      if (ratingTierFilter !== 'ALL') params.ratingTier = ratingTierFilter;
      if (search) params.search = search;

      const res = await evaluationService.getEvaluations(params);
      if (res.success) {
        setEvaluations(res.evaluations || []);
      }
    } catch (err) {
      console.error('Error fetching evaluations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvaluations();
  }, [ratingTierFilter]);

  const columns = [
    {
      header: 'Vendor',
      accessor: 'vendor',
      render: (row) => (
        <div>
          <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
            {row.vendor?.companyName}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {row.vendor?.vendorId} &bull; {row.vendor?.industry}
          </div>
        </div>
      ),
    },
    {
      header: 'Overall Score',
      accessor: 'overallScore',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Star size={16} fill="#F59E0B" color="#F59E0B" />
          <span style={{ fontWeight: 800, fontSize: '1rem', fontFamily: 'Outfit' }}>
            {row.overallScore.toFixed(2)}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>/ 5.0</span>
        </div>
      ),
    },
    {
      header: 'Rating Tier',
      accessor: 'ratingTier',
      render: (row) => (
        <span className={`rating-tier-pill ${row.ratingTier.toLowerCase()}`} style={{ fontSize: '0.75rem' }}>
          {row.ratingTier}
        </span>
      ),
    },
    {
      header: 'Criteria Breakdown',
      render: (row) => (
        <div style={{ display: 'flex', gap: '0.35rem', fontSize: '0.75rem' }}>
          <span title="Quality">Q: <strong>{row.criteria?.quality}</strong></span> &bull;
          <span title="Delivery">D: <strong>{row.criteria?.delivery}</strong></span> &bull;
          <span title="Pricing">P: <strong>{row.criteria?.pricing}</strong></span> &bull;
          <span title="Communication">C: <strong>{row.criteria?.communication}</strong></span> &bull;
          <span title="Reliability">R: <strong>{row.criteria?.reliability}</strong></span> &bull;
          <span title="Compliance">Comp: <strong>{row.criteria?.compliance}</strong></span>
        </div>
      ),
    },
    {
      header: 'Evaluated By',
      accessor: 'evaluatedBy',
      render: (row) => (
        <span style={{ fontSize: '0.8125rem' }}>
          {row.evaluatedBy?.name || 'Procurement Team'}
        </span>
      ),
    },
    {
      header: 'Review Date',
      accessor: 'evaluationDate',
      render: (row) => (
        <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
          {new Date(row.evaluationDate).toLocaleDateString()}
        </span>
      ),
    },
  ];

  return (
    <div className="evaluations-list-page">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Vendor Performance Evaluations</h1>
          <p>Scorecards, multi-criteria audits, and supplier quality metrics</p>
        </div>
        <div className="page-actions">
          <Button
            variant="primary"
            icon={Plus}
            onClick={() => navigate('/evaluations/create')}
          >
            New Evaluation
          </Button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {['ALL', 'Excellent', 'Good', 'Average', 'Poor'].map((tier) => (
              <button
                key={tier}
                type="button"
                className={`btn ${ratingTierFilter === tier ? 'btn-primary' : 'btn-outline'} btn-sm`}
                onClick={() => setRatingTierFilter(tier)}
              >
                {tier}
              </button>
            ))}
          </div>

          <div style={{ width: '280px' }}>
            <input
              type="text"
              className="form-input"
              placeholder="Search vendor reviews..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchEvaluations()}
            />
          </div>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={evaluations}
        loading={loading}
        emptyTitle="No evaluations found"
        emptyDescription="No vendor performance reviews match the current filter criteria."
      />
    </div>
  );
};

export default EvaluationList;
