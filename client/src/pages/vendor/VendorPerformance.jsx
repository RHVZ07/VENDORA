import React, { useState, useEffect } from 'react';
import { vendorService } from '../../services/vendorService';
import CriteriaMeter from '../../components/evaluations/CriteriaMeter';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import {
  Award,
  Star,
  CheckCircle2,
  Calendar,
  MessageSquare,
  ShieldCheck,
} from 'lucide-react';

const VendorPerformance = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPerformance = async () => {
      try {
        setLoading(true);
        const res = await vendorService.getMyProfile();
        if (res.success) {
          setProfileData(res);
        }
      } catch (err) {
        console.error('Error loading performance:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPerformance();
  }, []);

  if (loading) return <LoadingSpinner text="Retrieving performance audit scorecards..." />;

  const { vendor, evaluations = [] } = profileData || {};

  // Compute latest criterion values from latest evaluation or default 4.0
  const latestEvaluation = evaluations.length > 0 ? evaluations[0] : null;
  const c = latestEvaluation?.criteria || {
    quality: vendor?.performanceScore || 4.0,
    delivery: vendor?.performanceScore || 4.0,
    pricing: vendor?.performanceScore || 4.0,
    communication: vendor?.performanceScore || 4.0,
    reliability: vendor?.performanceScore || 4.0,
    compliance: vendor?.performanceScore || 4.0,
  };

  return (
    <div className="vendor-performance-page">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Supplier Performance Evaluation</h1>
          <p>Transparent benchmark across 6 core procurement factors evaluated by enterprise buyers</p>
        </div>
      </div>

      <div className="evaluations-overview-grid">
        {/* Overall Spotlight Card */}
        <div className="overall-score-spotlight">
          <span style={{ fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#DDD6FE', fontWeight: 700 }}>
            Overall Supplier Scorecard
          </span>

          <div className="score-circle-badge">
            <span className="score-num">{vendor?.performanceScore ? vendor.performanceScore.toFixed(1) : '0.0'}</span>
            <span className="score-total">out of 5.0</span>
          </div>

          <div className={`rating-tier-pill ${(vendor?.ratingTier || 'Unrated').toLowerCase()}`}>
            {vendor?.ratingTier || 'Unrated'} Tier
          </div>

          <p style={{ fontSize: '0.8125rem', color: '#CBD5E1', marginTop: '1.25rem', textAlign: 'center' }}>
            Aggregated across {evaluations.length} performance audits conducted by the procurement team
          </p>
        </div>

        {/* 6 Criteria Breakdown Grid */}
        <div className="card">
          <div className="card-header">
            <h3>6-Factor Capability Matrix</h3>
          </div>

          <div className="criteria-list-grid">
            <CriteriaMeter label="1. Product / Service Quality" score={c.quality} />
            <CriteriaMeter label="2. Delivery Performance" score={c.delivery} />
            <CriteriaMeter label="3. Pricing Competitiveness" score={c.pricing} />
            <CriteriaMeter label="4. Communication & Support" score={c.communication} />
            <CriteriaMeter label="5. Operational Reliability" score={c.reliability} />
            <CriteriaMeter label="6. Statutory Compliance" score={c.compliance} />
          </div>
        </div>
      </div>

      {/* Review History */}
      <div className="card" style={{ marginTop: '1.5rem' }}>
        <div className="card-header">
          <h3>Procurement Audit Reviews ({evaluations.length})</h3>
        </div>

        {evaluations.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
            No formal performance reviews logged yet. Reviews occur after initial purchase orders are fulfilled.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {evaluations.map((ev) => (
              <div key={ev._id} className="eval-history-item">
                <div className="eval-history-header">
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <h4 style={{ fontSize: '1.1rem' }}>Score: {ev.overallScore?.toFixed(2)} / 5.0</h4>
                      <span className={`rating-tier-pill ${ev.ratingTier?.toLowerCase()}`} style={{ fontSize: '0.75rem' }}>
                        {ev.ratingTier}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Evaluated on {new Date(ev.evaluationDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {ev.comments && (
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', background: 'var(--surface-alt)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', fontStyle: 'italic', marginTop: '0.75rem' }}>
                    &ldquo;{ev.comments}&rdquo;
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorPerformance;
