import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import { Sparkles, Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
      }}
    >
      <div
        className="card"
        style={{
          maxWidth: '520px',
          textAlign: 'center',
          padding: '3.5rem 2.5rem',
          boxShadow: 'var(--shadow-xl)',
        }}
      >
        <div
          style={{
            fontSize: '4.5rem',
            fontWeight: 800,
            fontFamily: 'Outfit',
            background: 'var(--primary-gradient)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            lineHeight: 1,
            marginBottom: '1rem',
          }}
        >
          404
        </div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          Page Not Found
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          The procurement resource or dashboard page you requested does not exist or has been moved.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <Button variant="outline" icon={ArrowLeft} onClick={() => navigate(-1)}>
            Go Back
          </Button>
          <Button variant="primary" icon={Home} onClick={() => navigate('/')}>
            Return Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
