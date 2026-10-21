const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema(
  {
    vendorId: {
      type: String,
      unique: true,
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // Step 1: Company Information
    companyName: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    businessType: {
      type: String,
      default: 'Private Limited',
      trim: true,
    },
    industry: {
      type: String,
      default: 'Manufacturing',
      trim: true,
    },
    registrationNumber: {
      type: String,
      trim: true,
    },
    gstNumber: {
      type: String,
      trim: true,
    },
    panNumber: {
      type: String,
      trim: true,
    },
    yearEstablished: {
      type: Number,
    },
    numberOfEmployees: {
      type: String,
      default: '1-50',
    },

    // Step 2: Contact Information
    contactPerson: {
      type: String,
      required: [true, 'Contact person name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Contact email is required'],
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Contact phone number is required'],
      trim: true,
    },
    alternatePhone: {
      type: String,
      trim: true,
    },
    website: {
      type: String,
      trim: true,
    },

    // Step 3: Address Information
    address: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    state: {
      type: String,
      trim: true,
    },
    pincode: {
      type: String,
      trim: true,
    },
    country: {
      type: String,
      default: 'India',
      trim: true,
    },

    // Step 4: Business Information
    productsServices: {
      type: [String],
      default: [],
    },
    businessDescription: {
      type: String,
      trim: true,
    },
    yearsOfExperience: {
      type: Number,
      default: 1,
    },
    annualTurnover: {
      type: String,
      trim: true,
    },

    // Step 5: Bank Information
    bankName: {
      type: String,
      trim: true,
    },
    accountHolderName: {
      type: String,
      trim: true,
    },
    accountNumber: {
      type: String,
      trim: true,
    },
    ifscCode: {
      type: String,
      trim: true,
    },

    // Status and Workflow
    status: {
      type: String,
      enum: ['PENDING', 'UNDER REVIEW', 'APPROVED', 'REJECTED', 'ACTIVE', 'SUSPENDED'],
      default: 'PENDING',
    },
    onboardingStep: {
      type: Number,
      default: 1,
      min: 1,
      max: 6,
    },
    onboardingCompleted: {
      type: Boolean,
      default: false,
    },
    performanceScore: {
      type: Number,
      default: 0.0,
      min: 0,
      max: 5,
    },
    ratingTier: {
      type: String,
      enum: ['Unrated', 'Excellent', 'Good', 'Average', 'Poor'],
      default: 'Unrated',
    },
    evaluationCount: {
      type: Number,
      default: 0,
    },

    // Review Details
    approvalDate: {
      type: Date,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    rejectionReason: {
      type: String,
      trim: true,
    },
    requestedChanges: {
      type: String,
      trim: true,
    },
    adminNotes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual relationships
vendorSchema.virtual('documents', {
  ref: 'Document',
  localField: '_id',
  foreignField: 'vendor',
});

vendorSchema.virtual('evaluations', {
  ref: 'VendorEvaluation',
  localField: '_id',
  foreignField: 'vendor',
});

vendorSchema.virtual('purchaseOrders', {
  ref: 'PurchaseOrder',
  localField: '_id',
  foreignField: 'vendor',
});

// Auto-generate vendorId if not provided
vendorSchema.pre('save', async function (next) {
  if (!this.vendorId) {
    const count = await mongoose.model('Vendor').countDocuments();
    this.vendorId = `VND-${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Vendor', vendorSchema);
