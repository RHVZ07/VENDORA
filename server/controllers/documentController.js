const Document = require('../models/Document');
const Vendor = require('../models/Vendor');
const Notification = require('../models/Notification');
const fs = require('fs');
const path = require('path');

// @desc    Upload new document
// @route   POST /api/documents
// @access  Private
const uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a document file' });
    }

    const { documentType, documentName, vendorId } = req.body;

    let targetVendorId = vendorId;
    if (req.user.role === 'vendor') {
      const vendor = await Vendor.findOne({ user: req.user._id });
      if (!vendor) {
        return res.status(404).json({ success: false, message: 'Vendor profile not found' });
      }
      targetVendorId = vendor._id;
    }

    if (!targetVendorId) {
      return res.status(400).json({ success: false, message: 'Target vendor ID is required' });
    }

    const fileUrl = `/uploads/${req.file.filename}`;

    const document = await Document.create({
      vendor: targetVendorId,
      documentType: documentType || 'Other',
      documentName: documentName || req.file.originalname,
      fileName: req.file.filename,
      fileUrl,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      status: 'PENDING',
      uploadedBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: 'Document uploaded successfully',
      document,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all documents
// @route   GET /api/documents
// @access  Private
const getDocuments = async (req, res) => {
  try {
    const { vendorId, status, documentType } = req.query;
    const query = {};

    if (vendorId) query.vendor = vendorId;
    if (status && status !== 'ALL') query.status = status;
    if (documentType && documentType !== 'ALL') query.documentType = documentType;

    if (req.user.role === 'vendor') {
      const vendor = await Vendor.findOne({ user: req.user._id });
      if (!vendor) {
        return res.json({ success: true, count: 0, documents: [] });
      }
      query.vendor = vendor._id;
    }

    const documents = await Document.find(query)
      .populate('vendor', 'companyName vendorId email contactPerson')
      .populate('uploadedBy', 'name email')
      .populate('verifiedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: documents.length,
      documents,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Verify document (Admin)
// @route   PATCH /api/documents/:id/verify
// @access  Private (Admin)
const verifyDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id).populate('vendor');

    if (!document) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    document.status = 'VERIFIED';
    document.verifiedBy = req.user._id;
    document.verifiedAt = new Date();
    document.rejectionReason = undefined;

    await document.save();

    if (document.vendor?.user) {
      await Notification.create({
        recipient: document.vendor.user,
        title: 'Document Verified',
        message: `Your ${document.documentType} (${document.documentName}) has been verified and approved.`,
        type: 'success',
        link: '/documents',
      });
    }

    res.json({
      success: true,
      message: 'Document verified successfully',
      document,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Reject document (Admin)
// @route   PATCH /api/documents/:id/reject
// @access  Private (Admin)
const rejectDocument = async (req, res) => {
  try {
    const { rejectionReason } = req.body;
    const document = await Document.findById(req.params.id).populate('vendor');

    if (!document) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    document.status = 'REJECTED';
    document.rejectionReason = rejectionReason || 'Document could not be verified. Please upload a clear copy.';
    document.verifiedBy = req.user._id;
    document.verifiedAt = new Date();

    await document.save();

    if (document.vendor?.user) {
      await Notification.create({
        recipient: document.vendor.user,
        title: 'Document Rejected',
        message: `Your ${document.documentType} was rejected. Reason: ${document.rejectionReason}`,
        type: 'danger',
        link: '/documents',
      });
    }

    res.json({
      success: true,
      message: 'Document rejected',
      document,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete document
// @route   DELETE /api/documents/:id
// @access  Private
const deleteDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    // Attempt to remove physical file from disk
    const filePath = path.join(__dirname, '../uploads', document.fileName);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (e) {
        console.error('File unlink error:', e.message);
      }
    }

    await Document.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Document deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  uploadDocument,
  getDocuments,
  verifyDocument,
  rejectDocument,
  deleteDocument,
};
