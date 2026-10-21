import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { vendorService } from '../../services/vendorService';
import { onboardingService } from '../../services/onboardingService';
import { documentService } from '../../services/documentService';
import Button from '../../components/common/Button';
import FormField from '../../components/common/FormField';
import Input from '../../components/common/Input';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import {
  Building,
  User,
  MapPin,
  Briefcase,
  CreditCard,
  FileText,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Upload,
  ExternalLink,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

const STEPS = [
  { step: 1, title: 'Company Info', icon: Building },
  { step: 2, title: 'Contact Info', icon: User },
  { step: 3, title: 'Address', icon: MapPin },
  { step: 4, title: 'Business Details', icon: Briefcase },
  { step: 5, title: 'Bank Coordinates', icon: CreditCard },
  { step: 6, title: 'Compliance Docs', icon: FileText },
];

const VendorOnboardingWizard = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [vendorData, setVendorData] = useState({
    // Step 1
    companyName: '',
    businessType: 'Private Limited',
    industry: 'Manufacturing',
    registrationNumber: '',
    gstNumber: '',
    panNumber: '',
    yearEstablished: new Date().getFullYear() - 5,
    numberOfEmployees: '100-250',
    // Step 2
    contactPerson: '',
    email: '',
    phone: '',
    alternatePhone: '',
    website: '',
    // Step 3
    address: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
    // Step 4
    productsServicesInput: '',
    productsServices: [],
    businessDescription: '',
    yearsOfExperience: 5,
    annualTurnover: '₹10 Cr - ₹25 Cr',
    // Step 5
    bankName: '',
    accountHolderName: '',
    accountNumber: '',
    ifscCode: '',
  });

  const [documents, setDocuments] = useState([]);
  const [uploadDocType, setUploadDocType] = useState('GST Certificate');
  const [uploadFile, setUploadFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const loadCurrentProfile = async () => {
      try {
        setLoading(true);
        const res = await vendorService.getMyProfile();
        if (res.success && res.vendor) {
          const v = res.vendor;
          setVendorData({
            companyName: v.companyName || '',
            businessType: v.businessType || 'Private Limited',
            industry: v.industry || 'Manufacturing',
            registrationNumber: v.registrationNumber || '',
            gstNumber: v.gstNumber || '',
            panNumber: v.panNumber || '',
            yearEstablished: v.yearEstablished || 2020,
            numberOfEmployees: v.numberOfEmployees || '50-100',
            contactPerson: v.contactPerson || '',
            email: v.email || '',
            phone: v.phone || '',
            alternatePhone: v.alternatePhone || '',
            website: v.website || '',
            address: v.address || '',
            city: v.city || '',
            state: v.state || '',
            pincode: v.pincode || '',
            country: v.country || 'India',
            productsServicesInput: (v.productsServices || []).join(', '),
            productsServices: v.productsServices || [],
            businessDescription: v.businessDescription || '',
            yearsOfExperience: v.yearsOfExperience || 3,
            annualTurnover: v.annualTurnover || '₹5 Cr - ₹10 Cr',
            bankName: v.bankName || '',
            accountHolderName: v.accountHolderName || '',
            accountNumber: v.accountNumber || '',
            ifscCode: v.ifscCode || '',
          });
          setDocuments(res.documents || []);
          if (v.onboardingStep && v.onboardingStep <= 6) {
            setCurrentStep(v.onboardingStep);
          }
        }
      } catch (err) {
        console.error('Error fetching vendor profile:', err);
      } finally {
        setLoading(false);
      }
    };

    loadCurrentProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVendorData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveStep = async (isFinal = false) => {
    try {
      setSaving(true);
      // Process productsServices array
      const productsArray = vendorData.productsServicesInput
        ? vendorData.productsServicesInput.split(',').map((p) => p.trim()).filter(Boolean)
        : vendorData.productsServices;

      const payload = {
        step: currentStep,
        data: {
          ...vendorData,
          productsServices: productsArray,
        },
        isFinalSubmission: isFinal,
      };

      await onboardingService.saveStep(payload);

      if (isFinal) {
        setSubmissionSuccess(true);
      } else {
        setCurrentStep((prev) => Math.min(6, prev + 1));
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save step');
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!uploadFile) {
      alert('Please select a document file');
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('document', uploadFile);
      formData.append('documentType', uploadDocType);
      formData.append('documentName', uploadFile.name);

      const res = await documentService.uploadDocument(formData);
      if (res.success) {
        setDocuments((prev) => [res.document, ...prev]);
        setUploadFile(null);
        // Reset file input
        const fileInput = document.getElementById('doc-file-input');
        if (fileInput) fileInput.value = '';
      }
    } catch (err) {
      alert(err.response?.data?.message || 'File upload failed');
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading onboarding portal..." />;

  if (submissionSuccess) {
    return (
      <div className="card" style={{ maxWidth: '650px', margin: '3rem auto', textAlign: 'center', padding: '3.5rem 2.5rem' }}>
        <div
          style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            background: 'var(--success-light)',
            color: 'var(--success)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem auto',
          }}
        >
          <CheckCircle2 size={40} />
        </div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.75rem' }}>
          Onboarding Application Submitted!
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '2rem' }}>
          Your supplier onboarding application and compliance documents have been transmitted to the procurement team for formal review. You will receive real-time notifications on approval status.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <Button variant="primary" onClick={() => navigate('/vendor/dashboard')}>
            Go to Supplier Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="vendor-onboarding-wizard">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Supplier Onboarding Portal</h1>
          <p>Complete the 6-step compliance wizard to become a verified supplier on VENDORA</p>
        </div>
      </div>

      {/* Stepper Progress Bar Header */}
      <div className="stepper-header">
        <div className="stepper-connector">
          <div
            className="stepper-connector-fill"
            style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
          ></div>
        </div>

        {STEPS.map((s) => {
          const Icon = s.icon;
          const isCompleted = s.step < currentStep;
          const isActive = s.step === currentStep;

          return (
            <div
              key={s.step}
              className={`step-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
              onClick={() => setCurrentStep(s.step)}
            >
              <div className="step-circle">
                {isCompleted ? <CheckCircle2 size={20} /> : <Icon size={18} />}
              </div>
              <span className="step-title">
                {s.step}. {s.title}
              </span>
            </div>
          );
        })}
      </div>

      {/* Wizard Form Container */}
      <div className="wizard-card">
        {/* STEP 1: COMPANY INFORMATION */}
        {currentStep === 1 && (
          <div className="animate-fade-in">
            <div className="wizard-section-header">
              <h2>Step 1: Legal Company Information</h2>
              <p>Provide registered enterprise credentials and statutory identifiers</p>
            </div>

            <div className="form-grid-2">
              <FormField label="Legal Company Name" required>
                <Input
                  required
                  name="companyName"
                  value={vendorData.companyName}
                  onChange={handleChange}
                  placeholder="e.g. Apex Hardware & Components Ltd."
                />
              </FormField>

              <FormField label="Business Structure">
                <select
                  className="form-select"
                  name="businessType"
                  value={vendorData.businessType}
                  onChange={handleChange}
                >
                  <option value="Private Limited">Private Limited (Pvt Ltd)</option>
                  <option value="Public Limited">Public Limited</option>
                  <option value="LLP">Limited Liability Partnership (LLP)</option>
                  <option value="Partnership">Partnership</option>
                  <option value="Sole Proprietorship">Sole Proprietorship</option>
                </select>
              </FormField>
            </div>

            <div className="form-grid-3">
              <FormField label="Primary Industry Sector">
                <select
                  className="form-select"
                  name="industry"
                  value={vendorData.industry}
                  onChange={handleChange}
                >
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Electronics & Hardware">Electronics & Hardware</option>
                  <option value="Logistics & Supply Chain">Logistics & Supply Chain</option>
                  <option value="Raw Materials">Raw Materials</option>
                  <option value="Healthcare & Medical">Healthcare & Medical</option>
                  <option value="IT & Software">IT & Software</option>
                  <option value="Services & Consulting">Services & Consulting</option>
                </select>
              </FormField>

              <FormField label="Company Registration Number / CIN">
                <Input
                  name="registrationNumber"
                  value={vendorData.registrationNumber}
                  onChange={handleChange}
                  placeholder="e.g. U72200KA2018PTC112345"
                />
              </FormField>

              <FormField label="GST Identification Number (GSTIN)">
                <Input
                  name="gstNumber"
                  value={vendorData.gstNumber}
                  onChange={handleChange}
                  placeholder="29ABCDE1234F1Z5"
                />
              </FormField>
            </div>

            <div className="form-grid-3">
              <FormField label="PAN Number">
                <Input
                  name="panNumber"
                  value={vendorData.panNumber}
                  onChange={handleChange}
                  placeholder="ABCDE1234F"
                />
              </FormField>

              <FormField label="Year Established">
                <Input
                  type="number"
                  name="yearEstablished"
                  value={vendorData.yearEstablished}
                  onChange={handleChange}
                  placeholder="2018"
                />
              </FormField>

              <FormField label="Employee Strength">
                <select
                  className="form-select"
                  name="numberOfEmployees"
                  value={vendorData.numberOfEmployees}
                  onChange={handleChange}
                >
                  <option value="1-20">1 - 20 Employees</option>
                  <option value="20-50">20 - 50 Employees</option>
                  <option value="50-100">50 - 100 Employees</option>
                  <option value="100-250">100 - 250 Employees</option>
                  <option value="250+">250+ Employees</option>
                </select>
              </FormField>
            </div>
          </div>
        )}

        {/* STEP 2: CONTACT INFORMATION */}
        {currentStep === 2 && (
          <div className="animate-fade-in">
            <div className="wizard-section-header">
              <h2>Step 2: Key Contact Information</h2>
              <p>Specify the procurement liaison and authorized company representative</p>
            </div>

            <div className="form-grid-2">
              <FormField label="Authorized Contact Person" required>
                <Input
                  required
                  name="contactPerson"
                  value={vendorData.contactPerson}
                  onChange={handleChange}
                  placeholder="e.g. Vikram Mehta"
                />
              </FormField>

              <FormField label="Official Work Email" required>
                <Input
                  type="email"
                  required
                  name="email"
                  value={vendorData.email}
                  onChange={handleChange}
                  placeholder="name@company.com"
                />
              </FormField>
            </div>

            <div className="form-grid-3">
              <FormField label="Primary Contact Phone" required>
                <Input
                  required
                  name="phone"
                  value={vendorData.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                />
              </FormField>

              <FormField label="Alternate / Landline Phone">
                <Input
                  name="alternatePhone"
                  value={vendorData.alternatePhone}
                  onChange={handleChange}
                  placeholder="+91 80 4123 9900"
                />
              </FormField>

              <FormField label="Official Website">
                <Input
                  name="website"
                  value={vendorData.website}
                  onChange={handleChange}
                  placeholder="https://company.com"
                />
              </FormField>
            </div>
          </div>
        )}

        {/* STEP 3: ADDRESS */}
        {currentStep === 3 && (
          <div className="animate-fade-in">
            <div className="wizard-section-header">
              <h2>Step 3: Registered Facility & Address</h2>
              <p>Registered manufacturing, warehouse, or corporate office location</p>
            </div>

            <FormField label="Street Address / Facility Plot" required>
              <Input
                required
                name="address"
                value={vendorData.address}
                onChange={handleChange}
                placeholder="Plot 42, Electronic City Phase 1, Industrial Area"
              />
            </FormField>

            <div className="form-grid-3">
              <FormField label="City" required>
                <Input
                  required
                  name="city"
                  value={vendorData.city}
                  onChange={handleChange}
                  placeholder="Bengaluru"
                />
              </FormField>

              <FormField label="State" required>
                <Input
                  required
                  name="state"
                  value={vendorData.state}
                  onChange={handleChange}
                  placeholder="Karnataka"
                />
              </FormField>

              <FormField label="Pincode / Postal Code" required>
                <Input
                  required
                  name="pincode"
                  value={vendorData.pincode}
                  onChange={handleChange}
                  placeholder="560100"
                />
              </FormField>
            </div>

            <FormField label="Country">
              <Input
                name="country"
                value={vendorData.country}
                onChange={handleChange}
                placeholder="India"
              />
            </FormField>
          </div>
        )}

        {/* STEP 4: BUSINESS INFORMATION */}
        {currentStep === 4 && (
          <div className="animate-fade-in">
            <div className="wizard-section-header">
              <h2>Step 4: Business Offerings & Capacity</h2>
              <p>Specify supplied products/services, domain experience, and revenue scale</p>
            </div>

            <FormField
              label="Products / Services Offered (Comma Separated)"
              hint="e.g. Microcontrollers, Industrial Sensors, Multilayer PCB Panels"
            >
              <Input
                name="productsServicesInput"
                value={vendorData.productsServicesInput}
                onChange={handleChange}
                placeholder="Microcontrollers, Sensors, PCB Assemblies, IoT Modules"
              />
            </FormField>

            <FormField label="Executive Business Description">
              <textarea
                className="form-textarea"
                rows="4"
                name="businessDescription"
                value={vendorData.businessDescription}
                onChange={handleChange}
                placeholder="Detail manufacturing capabilities, cleanroom facilities, certifications, and production capacities..."
              ></textarea>
            </FormField>

            <div className="form-grid-2">
              <FormField label="Years of Operating Experience">
                <Input
                  type="number"
                  min="0"
                  name="yearsOfExperience"
                  value={vendorData.yearsOfExperience}
                  onChange={handleChange}
                />
              </FormField>

              <FormField label="Annual Turnover Scale">
                <select
                  className="form-select"
                  name="annualTurnover"
                  value={vendorData.annualTurnover}
                  onChange={handleChange}
                >
                  <option value="Under ₹1 Cr">Under ₹1 Crore</option>
                  <option value="₹1 Cr - ₹5 Cr">₹1 Crore - ₹5 Crores</option>
                  <option value="₹5 Cr - ₹15 Cr">₹5 Crores - ₹15 Crores</option>
                  <option value="₹15 Cr - ₹50 Cr">₹15 Crores - ₹50 Crores</option>
                  <option value="₹50 Cr - ₹100 Cr">₹50 Crores - ₹100 Crores</option>
                  <option value="₹100 Cr+">₹100 Crores+</option>
                </select>
              </FormField>
            </div>
          </div>
        )}

        {/* STEP 5: BANK INFORMATION */}
        {currentStep === 5 && (
          <div className="animate-fade-in">
            <div className="wizard-section-header">
              <h2>Step 5: Banking Coordinates for Disbursement</h2>
              <p>Bank details for purchase order invoice payouts and settlement</p>
            </div>

            <div className="form-grid-2">
              <FormField label="Bank Name" required>
                <Input
                  required
                  name="bankName"
                  value={vendorData.bankName}
                  onChange={handleChange}
                  placeholder="e.g. HDFC Bank Ltd"
                />
              </FormField>

              <FormField label="Account Beneficiary Name" required>
                <Input
                  required
                  name="accountHolderName"
                  value={vendorData.accountHolderName}
                  onChange={handleChange}
                  placeholder="e.g. Apex Microelectronics Ltd"
                />
              </FormField>
            </div>

            <div className="form-grid-2">
              <FormField label="Account Number" required>
                <Input
                  required
                  name="accountNumber"
                  value={vendorData.accountNumber}
                  onChange={handleChange}
                  placeholder="50200045891234"
                />
              </FormField>

              <FormField label="IFSC Code" required>
                <Input
                  required
                  name="ifscCode"
                  value={vendorData.ifscCode}
                  onChange={handleChange}
                  placeholder="HDFC0001234"
                />
              </FormField>
            </div>
          </div>
        )}

        {/* STEP 6: DOCUMENTS */}
        {currentStep === 6 && (
          <div className="animate-fade-in">
            <div className="wizard-section-header">
              <h2>Step 6: Compliance Documentation Upload</h2>
              <p>Upload official copies of GST Certificate, PAN Card, Business Registration, and Bank Proof</p>
            </div>

            {/* Document Upload Box */}
            <form onSubmit={handleFileUpload} style={{ marginBottom: '2rem' }}>
              <div className="card" style={{ background: 'var(--surface-alt)' }}>
                <div className="form-grid-2" style={{ alignItems: 'flex-end' }}>
                  <FormField label="Select Document Type">
                    <select
                      className="form-select"
                      value={uploadDocType}
                      onChange={(e) => setUploadDocType(e.target.value)}
                    >
                      <option value="GST Certificate">GST Certificate</option>
                      <option value="PAN Card">Company PAN Card</option>
                      <option value="Business Registration Certificate">Business Registration (Incorporation)</option>
                      <option value="Bank Proof">Cancelled Cheque / Bank Statement</option>
                      <option value="ISO Certification">ISO Certification</option>
                      <option value="Other">Other Document</option>
                    </select>
                  </FormField>

                  <FormField label="Choose File (PDF, PNG, JPG)">
                    <input
                      id="doc-file-input"
                      type="file"
                      className="form-input"
                      onChange={(e) => setUploadFile(e.target.files[0])}
                    />
                  </FormField>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    loading={uploading}
                    icon={Upload}
                  >
                    Upload Document
                  </Button>
                </div>
              </div>
            </form>

            {/* Uploaded Documents List */}
            <div className="uploaded-docs-list">
              <h4>Uploaded Verification Documents ({documents.length})</h4>
              {documents.length === 0 ? (
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                  No documents uploaded yet. Upload at least GST & PAN certificates before final submission.
                </p>
              ) : (
                documents.map((doc) => (
                  <div key={doc._id} className="uploaded-doc-item">
                    <div className="doc-file-info">
                      <div className="doc-file-icon">
                        <FileText size={20} />
                      </div>
                      <div className="doc-file-details">
                        <h5>{doc.documentName}</h5>
                        <span>{doc.documentType}</span>
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
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Wizard Footer Navigation */}
        <div className="wizard-footer-actions">
          <div>
            {currentStep > 1 && (
              <Button
                variant="outline"
                icon={ArrowLeft}
                onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
              >
                Previous Step
              </Button>
            )}
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            {currentStep < 6 ? (
              <Button
                variant="primary"
                icon={ArrowRight}
                iconPosition="right"
                loading={saving}
                onClick={() => handleSaveStep(false)}
              >
                Save & Proceed to Step {currentStep + 1}
              </Button>
            ) : (
              <Button
                variant="primary"
                icon={CheckCircle2}
                loading={saving}
                onClick={() => handleSaveStep(true)}
              >
                Submit Application for Admin Verification
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorOnboardingWizard;
