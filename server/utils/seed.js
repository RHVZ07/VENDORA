const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config({ path: path.join(__dirname, '../.env') });

const User = require('../models/User');
const Vendor = require('../models/Vendor');
const VendorEvaluation = require('../models/VendorEvaluation');
const PurchaseOrder = require('../models/PurchaseOrder');
const Document = require('../models/Document');
const Notification = require('../models/Notification');

// Sample file generation for demonstration
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Create sample dummy document files if missing
['sample_gst_certificate.pdf', 'sample_pan_card.pdf', 'sample_iso_cert.pdf', 'sample_bank_statement.pdf'].forEach((f) => {
  const p = path.join(uploadsDir, f);
  if (!fs.existsSync(p)) {
    fs.writeFileSync(p, `%PDF-1.4 sample content for ${f}`);
  }
});

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/vendora';
    await mongoose.connect(mongoUri);
    console.log('[Seed] Connected to MongoDB database...');

    // Clear existing collections
    await User.deleteMany({});
    await Vendor.deleteMany({});
    await VendorEvaluation.deleteMany({});
    await PurchaseOrder.deleteMany({});
    await Document.deleteMany({});
    await Notification.deleteMany({});

    console.log('[Seed] Cleared existing data.');

    // 1. Create Users
    const adminUser = await User.create({
      name: 'Eleanor Vance (Procurement Lead)',
      email: 'admin@vendora.com',
      password: 'Admin@123',
      role: 'admin',
      phone: '+91 98765 43210',
    });

    const vendorUser1 = await User.create({
      name: 'Vikram Mehta',
      email: 'vendor@vendora.com',
      password: 'Vendor@123',
      role: 'vendor',
      phone: '+91 91234 56780',
    });

    const vendorUser2 = await User.create({
      name: 'Sarah Jenkins',
      email: 'supplier@vendora.com',
      password: 'Supplier@123',
      role: 'vendor',
      phone: '+91 98450 11223',
    });

    const vendorUser3 = await User.create({
      name: 'Rajesh Sharma',
      email: 'rajesh@quantumsteel.com',
      password: 'Vendor@123',
      role: 'vendor',
      phone: '+91 97110 33445',
    });

    const vendorUser4 = await User.create({
      name: 'Ananya Roy',
      email: 'ananya@biomedsupply.in',
      password: 'Vendor@123',
      role: 'vendor',
      phone: '+91 96540 88990',
    });

    const vendorUser5 = await User.create({
      name: 'David Chen',
      email: 'david@zenithlogistics.com',
      password: 'Vendor@123',
      role: 'vendor',
      phone: '+91 98220 55667',
    });

    // 2. Create Vendors
    const vendor1 = await Vendor.create({
      vendorId: 'VND-0001',
      user: vendorUser1._id,
      companyName: 'Apex Microelectronics & Hardware Ltd.',
      businessType: 'Private Limited',
      industry: 'Electronics & Hardware',
      registrationNumber: 'U72200KA2018PTC112345',
      gstNumber: '29ABCDE1234F1Z5',
      panNumber: 'ABCDE1234F',
      yearEstablished: 2018,
      numberOfEmployees: '100-250',
      contactPerson: 'Vikram Mehta',
      email: 'vendor@vendora.com',
      phone: '+91 91234 56780',
      alternatePhone: '+91 80 4123 9900',
      website: 'https://apexmicro.example.com',
      address: 'Plot 42, Electronic City Phase 1, Hosur Road',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560100',
      country: 'India',
      productsServices: ['Microcontrollers', 'Industrial Sensors', 'PCB Assemblies', 'Embedded IoT Modules'],
      businessDescription: 'Tier-1 manufacturer and supplier of precision electronics and embedded modules for industrial automation.',
      yearsOfExperience: 8,
      annualTurnover: '₹25 Cr - ₹50 Cr',
      bankName: 'HDFC Bank',
      accountHolderName: 'Apex Microelectronics Ltd',
      accountNumber: '50200045891234',
      ifscCode: 'HDFC0001234',
      status: 'ACTIVE',
      onboardingStep: 6,
      onboardingCompleted: true,
      performanceScore: 4.6,
      ratingTier: 'Excellent',
      evaluationCount: 2,
      approvalDate: new Date('2026-01-15'),
      approvedBy: adminUser._id,
      adminNotes: 'High reliability supplier for semiconductor and PCB requirements.',
    });
    vendorUser1.vendorProfile = vendor1._id;
    await vendorUser1.save();

    const vendor2 = await Vendor.create({
      vendorId: 'VND-0002',
      user: vendorUser2._id,
      companyName: 'LogiGlobal Freight Solutions LLP',
      businessType: 'LLP',
      industry: 'Logistics & Supply Chain',
      registrationNumber: 'AAA-9988-2020',
      gstNumber: '27AAACL9988A1Z2',
      panNumber: 'AAACL9988A',
      yearEstablished: 2020,
      numberOfEmployees: '50-100',
      contactPerson: 'Sarah Jenkins',
      email: 'supplier@vendora.com',
      phone: '+91 98450 11223',
      website: 'https://logiglobal.example.com',
      address: 'Warehouse Complex B, Sector 18, JNPT Port Area',
      city: 'Navi Mumbai',
      state: 'Maharashtra',
      pincode: '400705',
      country: 'India',
      productsServices: ['Cold Chain Logistics', 'Express Cargo Delivery', 'Warehousing & 3PL', 'Customs Clearance'],
      businessDescription: 'End-to-end multimodal logistics provider offering real-time tracking, temperature-controlled transport, and customs management.',
      yearsOfExperience: 6,
      annualTurnover: '₹15 Cr - ₹25 Cr',
      bankName: 'ICICI Bank',
      accountHolderName: 'LogiGlobal Freight LLP',
      accountNumber: '001105009988',
      ifscCode: 'ICIC0000011',
      status: 'ACTIVE',
      onboardingStep: 6,
      onboardingCompleted: true,
      performanceScore: 4.1,
      ratingTier: 'Good',
      evaluationCount: 1,
      approvalDate: new Date('2026-02-01'),
      approvedBy: adminUser._id,
    });
    vendorUser2.vendorProfile = vendor2._id;
    await vendorUser2.save();

    const vendor3 = await Vendor.create({
      vendorId: 'VND-0003',
      user: vendorUser3._id,
      companyName: 'Quantum Alloy & Steel Fabricators',
      businessType: 'Private Limited',
      industry: 'Raw Materials',
      registrationNumber: 'U27100MH2015PTC889900',
      gstNumber: '27XYZAB9900K1Z9',
      panNumber: 'XYZAB9900K',
      yearEstablished: 2015,
      numberOfEmployees: '250+',
      contactPerson: 'Rajesh Sharma',
      email: 'rajesh@quantumsteel.com',
      phone: '+91 97110 33445',
      website: 'https://quantumsteel.example.com',
      address: 'Industrial Area Phase II, Chakan',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '410501',
      country: 'India',
      productsServices: ['Cold-Rolled Steel Coils', 'Alloy Sheets', 'Structural Steel Beams', 'CNC Custom Machining'],
      businessDescription: 'ISO 9001 certified metallurgical manufacturing unit providing high-tensile alloys and custom structural steel.',
      yearsOfExperience: 11,
      annualTurnover: '₹75 Cr - ₹100 Cr',
      bankName: 'State Bank of India',
      accountHolderName: 'Quantum Alloy & Steel Fab Ltd',
      accountNumber: '381900112233',
      ifscCode: 'SBIN0004567',
      status: 'ACTIVE',
      onboardingStep: 6,
      onboardingCompleted: true,
      performanceScore: 4.4,
      ratingTier: 'Good',
      evaluationCount: 1,
      approvalDate: new Date('2026-01-20'),
      approvedBy: adminUser._id,
    });
    vendorUser3.vendorProfile = vendor3._id;
    await vendorUser3.save();

    const vendor4 = await Vendor.create({
      vendorId: 'VND-0004',
      user: vendorUser4._id,
      companyName: 'BioMed Diagnostics & Lab Consumables',
      businessType: 'Sole Proprietorship',
      industry: 'Healthcare & Medical',
      registrationNumber: 'DL-MED-2022-7711',
      gstNumber: '07AAAPB7711Q1Z4',
      panNumber: 'AAAPB7711Q',
      yearEstablished: 2022,
      numberOfEmployees: '20-50',
      contactPerson: 'Ananya Roy',
      email: 'ananya@biomedsupply.in',
      phone: '+91 96540 88990',
      website: 'https://biomedsupply.in',
      address: 'Okhla Industrial Area, Phase 3',
      city: 'New Delhi',
      state: 'Delhi',
      pincode: '110020',
      country: 'India',
      productsServices: ['Reagents', 'Sterile PPE & Gloves', 'Centrifuge Tubes', 'Diagnostic Assay Kits'],
      businessDescription: 'Distributor of clinical diagnostic equipment and lab consumables compliant with CE and ISO standards.',
      yearsOfExperience: 4,
      annualTurnover: '₹5 Cr - ₹10 Cr',
      bankName: 'Axis Bank',
      accountHolderName: 'BioMed Diagnostics',
      accountNumber: '918020033445566',
      ifscCode: 'UTIB0000889',
      status: 'PENDING',
      onboardingStep: 6,
      onboardingCompleted: true,
      performanceScore: 0,
      ratingTier: 'Unrated',
      evaluationCount: 0,
    });
    vendorUser4.vendorProfile = vendor4._id;
    await vendorUser4.save();

    const vendor5 = await Vendor.create({
      vendorId: 'VND-0005',
      user: vendorUser5._id,
      companyName: 'CloudMatrix IT & Cloud Infrastructure',
      businessType: 'Private Limited',
      industry: 'IT & Software',
      registrationNumber: 'U72900TS2021PTC156789',
      gstNumber: '36AABCC1567F1Z1',
      panNumber: 'AABCC1567F',
      yearEstablished: 2021,
      numberOfEmployees: '100-250',
      contactPerson: 'David Chen',
      email: 'david@zenithlogistics.com',
      phone: '+91 98220 55667',
      website: 'https://cloudmatrix.example.com',
      address: 'HITEC City, Madhapur',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500081',
      country: 'India',
      productsServices: ['Cloud Hosting Services', 'Cybersecurity Audits', 'Managed IT Support', 'DevOps Consulting'],
      businessDescription: 'Enterprise cloud systems integrator and IT managed services partner.',
      yearsOfExperience: 5,
      annualTurnover: '₹20 Cr - ₹40 Cr',
      bankName: 'Kotak Mahindra Bank',
      accountHolderName: 'CloudMatrix Solutions Pvt Ltd',
      accountNumber: '241199887766',
      ifscCode: 'KKBK0000223',
      status: 'UNDER REVIEW',
      onboardingStep: 6,
      onboardingCompleted: true,
      requestedChanges: 'Please re-upload a clearer scan of the GST Registration Certificate showing Annexure A.',
      performanceScore: 0,
      ratingTier: 'Unrated',
      evaluationCount: 0,
    });
    vendorUser5.vendorProfile = vendor5._id;
    await vendorUser5.save();

    // 3. Create Documents
    await Document.create([
      {
        vendor: vendor1._id,
        documentType: 'GST Certificate',
        documentName: 'GST_Registration_Certificate_Apex.pdf',
        fileName: 'sample_gst_certificate.pdf',
        fileUrl: '/uploads/sample_gst_certificate.pdf',
        fileSize: 245000,
        mimeType: 'application/pdf',
        status: 'VERIFIED',
        uploadedBy: vendorUser1._id,
        verifiedBy: adminUser._id,
        verifiedAt: new Date('2026-01-14'),
      },
      {
        vendor: vendor1._id,
        documentType: 'PAN Card',
        documentName: 'Company_PAN_Card_Apex.pdf',
        fileName: 'sample_pan_card.pdf',
        fileUrl: '/uploads/sample_pan_card.pdf',
        fileSize: 180000,
        mimeType: 'application/pdf',
        status: 'VERIFIED',
        uploadedBy: vendorUser1._id,
        verifiedBy: adminUser._id,
        verifiedAt: new Date('2026-01-14'),
      },
      {
        vendor: vendor1._id,
        documentType: 'ISO Certification',
        documentName: 'ISO_9001_Quality_Cert.pdf',
        fileName: 'sample_iso_cert.pdf',
        fileUrl: '/uploads/sample_iso_cert.pdf',
        fileSize: 520000,
        mimeType: 'application/pdf',
        status: 'VERIFIED',
        uploadedBy: vendorUser1._id,
        verifiedBy: adminUser._id,
        verifiedAt: new Date('2026-01-14'),
      },
      {
        vendor: vendor2._id,
        documentType: 'GST Certificate',
        documentName: 'GST_Registration_LogiGlobal.pdf',
        fileName: 'sample_gst_certificate.pdf',
        fileUrl: '/uploads/sample_gst_certificate.pdf',
        fileSize: 220000,
        mimeType: 'application/pdf',
        status: 'VERIFIED',
        uploadedBy: vendorUser2._id,
        verifiedBy: adminUser._id,
        verifiedAt: new Date('2026-01-30'),
      },
      {
        vendor: vendor4._id,
        documentType: 'GST Certificate',
        documentName: 'BioMed_GST_Doc.pdf',
        fileName: 'sample_gst_certificate.pdf',
        fileUrl: '/uploads/sample_gst_certificate.pdf',
        fileSize: 310000,
        mimeType: 'application/pdf',
        status: 'PENDING',
        uploadedBy: vendorUser4._id,
      },
      {
        vendor: vendor5._id,
        documentType: 'GST Certificate',
        documentName: 'CloudMatrix_GST_Scan.pdf',
        fileName: 'sample_gst_certificate.pdf',
        fileUrl: '/uploads/sample_gst_certificate.pdf',
        fileSize: 195000,
        mimeType: 'application/pdf',
        status: 'REJECTED',
        rejectionReason: 'Document illegible. Annexure page missing.',
        uploadedBy: vendorUser5._id,
        verifiedBy: adminUser._id,
        verifiedAt: new Date('2026-02-10'),
      },
    ]);

    // 4. Create Vendor Evaluations
    await VendorEvaluation.create([
      {
        vendor: vendor1._id,
        evaluatedBy: adminUser._id,
        criteria: {
          quality: 5,
          delivery: 5,
          pricing: 4,
          communication: 5,
          reliability: 5,
          compliance: 5,
        },
        overallScore: 4.83,
        ratingTier: 'Excellent',
        comments: 'Outstanding precision in PCB manufacturing with zero defect batches. Deliveries were consistently on or ahead of scheduled dates.',
        evaluationDate: new Date('2026-02-15'),
      },
      {
        vendor: vendor1._id,
        evaluatedBy: adminUser._id,
        criteria: {
          quality: 4,
          delivery: 4,
          pricing: 4,
          communication: 5,
          reliability: 4,
          compliance: 5,
        },
        overallScore: 4.33,
        ratingTier: 'Good',
        comments: 'Reliable supplier with transparent tracking and prompt support during hardware prototyping.',
        evaluationDate: new Date('2026-01-28'),
      },
      {
        vendor: vendor2._id,
        evaluatedBy: adminUser._id,
        criteria: {
          quality: 4,
          delivery: 4,
          pricing: 4,
          communication: 4,
          reliability: 4,
          compliance: 5,
        },
        overallScore: 4.17,
        ratingTier: 'Good',
        comments: 'Prompt freight services and proactive milestone notifications throughout shipment transit.',
        evaluationDate: new Date('2026-02-20'),
      },
      {
        vendor: vendor3._id,
        evaluatedBy: adminUser._id,
        criteria: {
          quality: 5,
          delivery: 4,
          pricing: 4,
          communication: 4,
          reliability: 5,
          compliance: 4,
        },
        overallScore: 4.33,
        ratingTier: 'Good',
        comments: 'High quality metallurgical testing certificates provided for each batch of alloy beams.',
        evaluationDate: new Date('2026-02-05'),
      },
    ]);

    // 5. Create Purchase Orders
    await PurchaseOrder.create([
      {
        poNumber: 'PO-2026-0001',
        vendor: vendor1._id,
        createdBy: adminUser._id,
        poDate: new Date('2026-02-01'),
        expectedDeliveryDate: new Date('2026-03-10'),
        paymentTerms: 'Net 30',
        shippingAddress: 'VENDORA Central Warehousing Facility, Gate 4, Tech Park, Bengaluru 560100',
        notes: 'Include test certificates for all STM32 microcontrollers.',
        status: 'SHIPPED',
        items: [
          {
            product: 'STM32 Microcontroller ICs',
            description: 'ARM Cortex-M4 32-bit MCU (Pack of 500)',
            quantity: 10,
            unitPrice: 45000,
            taxPercent: 18,
            subtotal: 450000,
            taxAmount: 81000,
            total: 531000,
          },
          {
            product: 'Multilayer PCB Panels',
            description: '4-layer FR4 industrial grade printed circuit boards',
            quantity: 50,
            unitPrice: 3200,
            taxPercent: 18,
            subtotal: 160000,
            taxAmount: 28800,
            total: 188800,
          },
        ],
        subtotal: 610000,
        taxTotal: 109800,
        grandTotal: 719800,
        statusHistory: [
          { status: 'DRAFT', changedBy: adminUser._id, changedAt: new Date('2026-02-01'), remarks: 'PO created' },
          { status: 'APPROVED', changedBy: adminUser._id, changedAt: new Date('2026-02-02'), remarks: 'Approved by Head of Procurement' },
          { status: 'PROCESSING', changedBy: vendorUser1._id, changedAt: new Date('2026-02-05'), remarks: 'Assembly line allocation completed' },
          { status: 'SHIPPED', changedBy: vendorUser1._id, changedAt: new Date('2026-02-18'), remarks: 'Dispatched via BlueDart Express AWB#99881122' },
        ],
      },
      {
        poNumber: 'PO-2026-0002',
        vendor: vendor1._id,
        createdBy: adminUser._id,
        poDate: new Date('2026-01-10'),
        expectedDeliveryDate: new Date('2026-01-25'),
        paymentTerms: 'Net 15',
        shippingAddress: 'VENDORA Advanced R&D Unit, Whitefield, Bengaluru',
        notes: 'Prototype run batch. Strict tolerance required.',
        status: 'COMPLETED',
        items: [
          {
            product: 'IoT Sensor Gateway Assemblies',
            description: 'Custom BLE/Zigbee sensor nodes',
            quantity: 25,
            unitPrice: 8500,
            taxPercent: 18,
            subtotal: 212500,
            taxAmount: 38250,
            total: 250750,
          },
        ],
        subtotal: 212500,
        taxTotal: 38250,
        grandTotal: 250750,
        statusHistory: [
          { status: 'DRAFT', changedBy: adminUser._id, changedAt: new Date('2026-01-10'), remarks: 'PO drafted' },
          { status: 'APPROVED', changedBy: adminUser._id, changedAt: new Date('2026-01-11'), remarks: 'Budget approved' },
          { status: 'PROCESSING', changedBy: vendorUser1._id, changedAt: new Date('2026-01-12'), remarks: 'Production started' },
          { status: 'SHIPPED', changedBy: vendorUser1._id, changedAt: new Date('2026-01-20'), remarks: 'Dispatched' },
          { status: 'DELIVERED', changedBy: vendorUser1._id, changedAt: new Date('2026-01-23'), remarks: 'Delivered at dock' },
          { status: 'COMPLETED', changedBy: adminUser._id, changedAt: new Date('2026-01-25'), remarks: 'Quality inspection passed and payment initiated' },
        ],
      },
      {
        poNumber: 'PO-2026-0003',
        vendor: vendor2._id,
        createdBy: adminUser._id,
        poDate: new Date('2026-02-12'),
        expectedDeliveryDate: new Date('2026-03-05'),
        paymentTerms: 'Net 30',
        shippingAddress: 'VENDORA Logistics Hub, JNPT Terminal, Navi Mumbai',
        notes: 'Cold storage temperature must be logged every 2 hours.',
        status: 'PROCESSING',
        items: [
          {
            product: 'Refrigerated Freight Transit (Q1 Contract)',
            description: 'Temperature-controlled cargo transit across 4 western zone corridors',
            quantity: 1,
            unitPrice: 380000,
            taxPercent: 18,
            subtotal: 380000,
            taxAmount: 68400,
            total: 448400,
          },
        ],
        subtotal: 380000,
        taxTotal: 68400,
        grandTotal: 448400,
        statusHistory: [
          { status: 'DRAFT', changedBy: adminUser._id, changedAt: new Date('2026-02-12'), remarks: 'Contract PO created' },
          { status: 'APPROVED', changedBy: adminUser._id, changedAt: new Date('2026-02-13'), remarks: 'Approved' },
          { status: 'PROCESSING', changedBy: vendorUser2._id, changedAt: new Date('2026-02-16'), remarks: 'Fleet assigned' },
        ],
      },
      {
        poNumber: 'PO-2026-0004',
        vendor: vendor3._id,
        createdBy: adminUser._id,
        poDate: new Date('2026-02-20'),
        expectedDeliveryDate: new Date('2026-03-25'),
        paymentTerms: 'Advance 50%',
        shippingAddress: 'VENDORA Manufacturing Plant #2, Industrial Estate, Pune',
        notes: 'Mill test certificates (MTC) required upon delivery.',
        status: 'PENDING APPROVAL',
        items: [
          {
            product: 'Cold-Rolled Steel Coils (Grade 304)',
            description: '2.5mm thickness CR coils, 1250mm width',
            quantity: 20,
            unitPrice: 65000,
            taxPercent: 18,
            subtotal: 1300000,
            taxAmount: 234000,
            total: 1534000,
          },
        ],
        subtotal: 1300000,
        taxTotal: 234000,
        grandTotal: 1534000,
        statusHistory: [
          { status: 'PENDING APPROVAL', changedBy: adminUser._id, changedAt: new Date('2026-02-20'), remarks: 'Awaiting finance director signoff' },
        ],
      },
    ]);

    // 6. Create Notifications
    await Notification.create([
      {
        recipient: adminUser._id,
        title: 'New Supplier Onboarding Application',
        message: 'BioMed Diagnostics & Lab Consumables submitted onboarding application for verification.',
        type: 'info',
        link: `/onboarding-requests/${vendor4._id}`,
        isRead: false,
      },
      {
        recipient: adminUser._id,
        title: 'Purchase Order Delivered',
        message: 'Apex Microelectronics marked PO-2026-0001 as SHIPPED with Tracking #99881122.',
        type: 'success',
        link: '/purchase-orders',
        isRead: false,
      },
      {
        recipient: vendorUser1._id,
        title: 'Purchase Order Approved',
        message: 'Purchase Order PO-2026-0001 has been approved and moved to fulfillment.',
        type: 'success',
        link: '/purchase-orders',
        isRead: true,
      },
      {
        recipient: vendorUser1._id,
        title: 'Performance Evaluation Score Updated',
        message: 'Your overall vendor score is 4.6/5.0 (Rating: Excellent). Great job!',
        type: 'info',
        link: '/performance',
        isRead: false,
      },
      {
        recipient: vendorUser5._id,
        title: 'Action Required: Document Resubmission',
        message: 'Please re-upload a clearer scan of your GST Registration Certificate.',
        type: 'warning',
        link: '/documents',
        isRead: false,
      },
    ]);

    console.log('[Seed] Database seeded successfully with realistic data!');
    console.log('----------------------------------------------------');
    console.log('DEMO ACCOUNTS:');
    console.log('ADMIN:  admin@vendora.com  / Admin@123');
    console.log('VENDOR: vendor@vendora.com / Vendor@123');
    console.log('----------------------------------------------------');

    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error);
    process.exit(1);
  }
};

seedDatabase();
