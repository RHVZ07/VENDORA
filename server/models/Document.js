const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema(
  {
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vendor',
      required: [true, 'Vendor reference is required'],
    },
    documentType: {
      type: String,
      required: [true, 'Document type is required'],
      enum: [
        'GST Certificate',
        'PAN Card',
        'Business Registration Certificate',
        'Bank Proof',
        'Tax Clearance',
        'ISO Certification',
        'Other',
      ],
    },
    documentName: {
      type: String,
      required: [true, 'Document name is required'],
      trim: true,
    },
    fileName: {
      type: String,
      required: [true, 'File name is required'],
    },
    fileUrl: {
      type: String,
      required: [true, 'File URL is required'],
    },
    fileSize: {
      type: Number,
    },
    mimeType: {
      type: String,
    },
    status: {
      type: String,
      enum: ['PENDING', 'VERIFIED', 'REJECTED'],
      default: 'PENDING',
    },
    rejectionReason: {
      type: String,
      trim: true,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    verifiedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Document', documentSchema);
