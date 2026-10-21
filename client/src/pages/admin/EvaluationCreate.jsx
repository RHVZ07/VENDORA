import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { vendorService } from '../../services/vendorService';
import { evaluationService } from '../../services/evaluationService';
import Button from '../../components/common/Button';
import FormField from '../../components/common/FormField';
import StarRating from '../../components/common/StarRating';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import {
  Award,
  ArrowLeft,
  CheckCircle2,
  Building,
  Star,
  Sparkles,
} from 'lucide-react';

const CRITERIA_CONFIG = [
  {
    key: 'quality',
    title: '1. Product / Service Quality',
    desc: 'Material standards, defect ratios, compliance with specs, and build precision.',
  },
  {
    key: 'delivery',
    title: '2. Delivery Performance',
    desc: 'On-time delivery rate, lead time adherence, and shipment condition upon arrival.',
  },
  {
    key: 'pricing',
    title: '3. Pricing Competitiveness',
    desc: 'Cost transparency, competitive quotation against market benchmark, and discount terms.',
  },
  {
    key: 'communication',
    title: '4. Communication & Responsiveness',
    desc: 'Speed of answering queries, transparency in delays, and proactive status updates.',
  },
  {
    key: 'reliability',
    title: '5. Operational Reliability',
    desc: 'Consistency in fulfilling bulk volumes, disaster recovery, and capacity scalability.',
  },
  {
    key: 'compliance',
    title: '6. Regulatory & Legal Compliance',
    desc: 'Adherence to statutory filings, GST, environmental, labor, and ISO standards.',
  },
];

const EvaluationCreate = () => {
  const [searchParams] = useSearchParams();
  const preselectedVendorId = searchParams.get('vendorId');

  const [vendors, setVendors] = useState([]);
  const [selectedVendorId, setSelectedVendorId] = useState(preselectedVendorId || '');
  const [loadingVendors, setLoadingVendors] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [criteria, setCriteria] = useState({
    quality: 4,
    delivery: 4,
    pricing: 4,
    communication: 4,
    reliability: 4,
    compliance: 4,
  });
  const [comments, setComments] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const loadVendors = async () => {
      try {
        setLoadingVendors(true);
        const res = await vendorService.getVendors({ status: 'ACTIVE', limit: 100 });
        if (res.success) {
          setVendors(res.vendors || []);
          if (!selectedVendorId && res.vendors.length > 0) {
            setSelectedVendorId(res.vendors[0]._id);
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

  const handleCriterionChange = (key, value) => {
    setCriteria((prev) => ({
      ...prev,
      [key]: Number(value),
    }));
  };

  // Compute live overall score
  const computedAverage = (
    (criteria.quality +
      criteria.delivery +
      criteria.pricing +
      criteria.communication +
      criteria.reliability +
      criteria.compliance) /
    6
  ).toFixed(2);

  const getTier = (score) => {
    if (score >= 4.5) return { name: 'Excellent', color: 'var(--success)' };
    if (score >= 3.5) return { name: 'Good', color: 'var(--primary)' };
    if (score >= 2.5) return { name: 'Average', color: 'var(--warning)' };
    return { name: 'Poor', color: 'var(--danger)' };
  };

  const currentTier = getTier(Number(computedAverage));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedVendorId) {
      alert('Please select a vendor to evaluate');
      return;
    }

    try {
      setSubmitting(true);
      await evaluationService.createEvaluation({
        vendorId: selectedVendorId,
        criteria,
        comments,
      });
      navigate('/evaluations');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit evaluation');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingVendors) return <LoadingSpinner text="Loading active suppliers for evaluation..." />;

  return (
    <div className="evaluation-create-page">
      <button
        onClick={() => navigate('/evaluations')}
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
        <ArrowLeft size={16} /> Back to Evaluations
      </button>

      <div className="page-header">
        <div className="page-title-group">
          <h1>Record Supplier Performance Evaluation</h1>
          <p>Score the vendor across 6 standardized procurement factors (1 - 5 scale)</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="dashboard-charts-grid">
          {/* Left Column: Form & Criteria Sliders */}
          <div className="card chart-card-col-8">
            <div className="card-header">
              <h3>Evaluation Matrix (6 Criteria)</h3>
            </div>

            {/* Vendor Selector */}
            <FormField label="Select Vendor to Evaluate" required>
              <select
                className="form-select"
                value={selectedVendorId}
                onChange={(e) => setSelectedVendorId(e.target.value)}
                required
              >
                <option value="">-- Select Active Vendor --</option>
                {vendors.map((v) => (
                  <option key={v._id} value={v._id}>
                    {v.companyName} ({v.vendorId} - {v.industry})
                  </option>
                ))}
              </select>
            </FormField>

            {/* 6 Criteria Sliders */}
            <div style={{ marginTop: '1.5rem' }}>
              {CRITERIA_CONFIG.map((item) => (
                <div key={item.key} className="eval-slider-row">
                  <div className="eval-slider-info">
                    <h4>{item.title}</h4>
                    <p>{item.desc}</p>
                  </div>

                  <div className="eval-slider-control">
                    <input
                      type="range"
                      min="1"
                      max="5"
                      step="1"
                      value={criteria[item.key]}
                      onChange={(e) => handleCriterionChange(item.key, e.target.value)}
                      className="eval-range-input"
                    />
                    <div className="eval-score-badge">
                      {criteria[item.key]} ★
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Qualitative Feedback */}
            <div style={{ marginTop: '1.5rem' }}>
              <FormField label="Procurement Review Notes & Qualitative Feedback">
                <textarea
                  className="form-textarea"
                  rows="4"
                  placeholder="Describe specific achievements, quality audits, delivery track record, or areas needing improvement..."
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                ></textarea>
              </FormField>
            </div>
          </div>

          {/* Right Column: Live Computed Scorecard */}
          <div className="chart-card-col-4" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="overall-score-spotlight" style={{ padding: '2.5rem 1.75rem' }}>
              <span style={{ fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#DDD6FE', fontWeight: 700 }}>
                Live Computed Overall Score
              </span>

              <div className="score-circle-badge" style={{ width: '140px', height: '140px' }}>
                <span className="score-num">{computedAverage}</span>
                <span className="score-total">out of 5.0</span>
              </div>

              <div
                className="rating-tier-pill"
                style={{
                  backgroundColor: currentTier.color,
                  color: '#FFFFFF',
                  fontSize: '0.9375rem',
                  padding: '0.4rem 1.25rem',
                }}
              >
                {currentTier.name} Tier
              </div>

              <p style={{ fontSize: '0.8125rem', color: '#CBD5E1', marginTop: '1.25rem', textAlign: 'center' }}>
                Automatic average across all 6 weighted categories. Updates the vendor profile upon submission.
              </p>
            </div>

            <div className="card">
              <Button
                type="submit"
                variant="primary"
                style={{ width: '100%', padding: '0.85rem' }}
                loading={submitting}
                icon={CheckCircle2}
              >
                Submit Performance Audit
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EvaluationCreate;
