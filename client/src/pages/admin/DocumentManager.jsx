import React, { useState, useEffect } from 'react';
import { documentService } from '../../services/documentService';
import Button from '../../components/common/Button';
import StatusBadge from '../../components/common/StatusBadge';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import FormField from '../../components/common/FormField';
import {
  FileText,
  Search,
  Filter,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
} from 'lucide-react';

const DocumentManager = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');

  const [rejectModal, setRejectModal] = useState({
    isOpen: false,
    docId: null,
    reason: '',
  });

  const fetchDocs = async () => {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter !== 'ALL') params.status = statusFilter;
      if (typeFilter !== 'ALL') params.documentType = typeFilter;

      const res = await documentService.getDocuments(params);
      if (res.success) {
        setDocuments(res.documents || []);
      }
    } catch (err) {
      console.error('Error fetching documents:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, [statusFilter, typeFilter]);

  const handleVerify = async (id) => {
    try {
      await documentService.verifyDocument(id);
      fetchDocs();
    } catch (err) {
      alert(err.response?.data?.message || 'Verification failed');
    }
  };

  const handleReject = async () => {
    try {
      await documentService.rejectDocument(rejectModal.docId, rejectModal.reason);
      setRejectModal({ isOpen: false, docId: null, reason: '' });
      fetchDocs();
    } catch (err) {
      alert(err.response?.data?.message || 'Rejection failed');
    }
  };

  const columns = [
    {
      header: 'Document Name',
      accessor: 'documentName',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className="doc-file-icon" style={{ width: '32px', height: '32px' }}>
            <FileText size={16} />
          </div>
          <div>
            <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{row.documentName}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{row.mimeType || 'application/pdf'}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'Supplier / Vendor',
      accessor: 'vendor',
      render: (row) => (
        <div>
          <div style={{ fontWeight: 500 }}>{row.vendor?.companyName}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{row.vendor?.vendorId}</div>
        </div>
      ),
    },
    {
      header: 'Document Type',
      accessor: 'documentType',
      render: (row) => (
        <span style={{ fontSize: '0.8125rem', fontWeight: 500 }}>
          {row.documentType}
        </span>
      ),
    },
    {
      header: 'Uploaded Date',
      accessor: 'createdAt',
      render: (row) => (
        <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
          {new Date(row.createdAt).toLocaleDateString()}
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
        <div className="table-actions" style={{ justifyContent: 'flex-end', gap: '0.5rem' }}>
          <a
            href={row.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
          >
            <ExternalLink size={13} /> View
          </a>
          {row.status === 'PENDING' && (
            <>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleVerify(row._id)}
              >
                Verify
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => setRejectModal({ isOpen: true, docId: row._id, reason: '' })}
              >
                Reject
              </Button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="document-manager-page">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Compliance & Verification Documents</h1>
          <p>Repository of supplier GST certificates, PAN cards, ISO certifications, and bank proofs</p>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {['ALL', 'PENDING', 'VERIFIED', 'REJECTED'].map((st) => (
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

          <div style={{ width: '220px' }}>
            <select
              className="form-select"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="ALL">All Document Types</option>
              <option value="GST Certificate">GST Certificate</option>
              <option value="PAN Card">PAN Card</option>
              <option value="Business Registration Certificate">Business Registration</option>
              <option value="Bank Proof">Bank Proof</option>
              <option value="ISO Certification">ISO Certification</option>
            </select>
          </div>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={documents}
        loading={loading}
        emptyTitle="No documents found"
        emptyDescription="There are no compliance documents matching the filter criteria."
      />

      {/* Reject Modal */}
      <Modal
        isOpen={rejectModal.isOpen}
        onClose={() => setRejectModal({ isOpen: false, docId: null, reason: '' })}
        title="Reject Document"
        size="sm"
      >
        <FormField label="Rejection Reason" required>
          <textarea
            className="form-textarea"
            rows="4"
            placeholder="Explain why this document could not be verified..."
            value={rejectModal.reason}
            onChange={(e) => setRejectModal({ ...rejectModal, reason: e.target.value })}
          ></textarea>
        </FormField>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
          <Button variant="outline" onClick={() => setRejectModal({ isOpen: false, docId: null, reason: '' })}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleReject}>
            Confirm Rejection
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default DocumentManager;
