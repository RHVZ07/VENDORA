import React, { useState, useEffect } from 'react';
import { documentService } from '../../services/documentService';
import Button from '../../components/common/Button';
import StatusBadge from '../../components/common/StatusBadge';
import FormField from '../../components/common/FormField';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import {
  FileText,
  Upload,
  ExternalLink,
  Trash2,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

const VendorDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadFile, setUploadFile] = useState(null);
  const [documentType, setDocumentType] = useState('GST Certificate');
  const [uploading, setUploading] = useState(false);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const res = await documentService.getDocuments();
      if (res.success) {
        setDocuments(res.documents || []);
      }
    } catch (err) {
      console.error('Error loading documents:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadFile) {
      alert('Please select a document file');
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('document', uploadFile);
      formData.append('documentType', documentType);
      formData.append('documentName', uploadFile.name);

      const res = await documentService.uploadDocument(formData);
      if (res.success) {
        setDocuments((prev) => [res.document, ...prev]);
        setUploadFile(null);
        const input = document.getElementById('vendor-doc-upload');
        if (input) input.value = '';
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      try {
        await documentService.deleteDocument(id);
        fetchDocuments();
      } catch (err) {
        alert(err.response?.data?.message || 'Delete failed');
      }
    }
  };

  if (loading) return <LoadingSpinner text="Retrieving compliance documents..." />;

  return (
    <div className="vendor-documents-page">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Compliance Documents Repository</h1>
          <p>Manage and upload statutory tax certificates, PAN, registration proofs, and ISO certifications</p>
        </div>
      </div>

      {/* Document Upload Form Card */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div className="card-header">
          <h3>Upload Compliance File</h3>
        </div>

        <form onSubmit={handleUpload}>
          <div className="form-grid-2" style={{ alignItems: 'flex-end' }}>
            <FormField label="Document Classification" required>
              <select
                className="form-select"
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value)}
              >
                <option value="GST Certificate">GST Certificate</option>
                <option value="PAN Card">Company PAN Card</option>
                <option value="Business Registration Certificate">Business Registration (Incorporation)</option>
                <option value="Bank Proof">Bank Statement / Cancelled Cheque</option>
                <option value="ISO Certification">ISO Quality Certification</option>
                <option value="Other">Other Document</option>
              </select>
            </FormField>

            <FormField label="Select File (PDF, PNG, JPG, DOC)" required>
              <input
                id="vendor-doc-upload"
                type="file"
                required
                className="form-input"
                onChange={(e) => setUploadFile(e.target.files[0])}
              />
            </FormField>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
            <Button
              type="submit"
              variant="primary"
              loading={uploading}
              icon={Upload}
            >
              Upload Document for Verification
            </Button>
          </div>
        </form>
      </div>

      {/* Documents List */}
      <div className="card">
        <div className="card-header">
          <h3>Uploaded Documents ({documents.length})</h3>
        </div>

        {documents.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
            No compliance files uploaded yet.
          </p>
        ) : (
          <div className="uploaded-docs-list" style={{ marginTop: '0' }}>
            {documents.map((doc) => (
              <div key={doc._id} className="uploaded-doc-item">
                <div className="doc-file-info">
                  <div className="doc-file-icon">
                    <FileText size={20} />
                  </div>
                  <div className="doc-file-details">
                    <h5>{doc.documentName}</h5>
                    <span>
                      {doc.documentType} &bull; Uploaded on {new Date(doc.createdAt).toLocaleDateString()}
                    </span>
                    {doc.rejectionReason && doc.status === 'REJECTED' && (
                      <p style={{ fontSize: '0.75rem', color: 'var(--danger)', marginTop: '0.2rem' }}>
                        <strong>Rejection Reason:</strong> {doc.rejectionReason}
                      </p>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <StatusBadge status={doc.status} size="sm" />

                  <a
                    href={doc.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline btn-sm"
                  >
                    <ExternalLink size={13} /> View
                  </a>

                  {doc.status !== 'VERIFIED' && (
                    <button
                      className="action-btn delete"
                      title="Remove Document"
                      onClick={() => handleDelete(doc._id)}
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorDocuments;
