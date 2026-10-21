const mongoose = require('mongoose');

const poItemSchema = new mongoose.Schema({
  product: {
    type: String,
    required: [true, 'Product / Service name is required'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [1, 'Quantity must be at least 1'],
  },
  unitPrice: {
    type: Number,
    required: [true, 'Unit price is required'],
    min: [0, 'Unit price cannot be negative'],
  },
  taxPercent: {
    type: Number,
    default: 18,
    min: 0,
  },
  subtotal: {
    type: Number,
    default: 0,
  },
  taxAmount: {
    type: Number,
    default: 0,
  },
  total: {
    type: Number,
    default: 0,
  },
});

const poStatusHistorySchema = new mongoose.Schema({
  status: {
    type: String,
    required: true,
  },
  changedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  changedAt: {
    type: Date,
    default: Date.now,
  },
  remarks: {
    type: String,
    trim: true,
  },
});

const purchaseOrderSchema = new mongoose.Schema(
  {
    poNumber: {
      type: String,
      unique: true,
      trim: true,
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vendor',
      required: [true, 'Vendor is required for Purchase Order'],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    poDate: {
      type: Date,
      default: Date.now,
    },
    expectedDeliveryDate: {
      type: Date,
      required: [true, 'Expected delivery date is required'],
    },
    paymentTerms: {
      type: String,
      default: 'Net 30',
      enum: ['Immediate', 'Net 15', 'Net 30', 'Net 45', 'Net 60', 'Advance 50%'],
    },
    shippingAddress: {
      type: String,
      required: [true, 'Shipping address is required'],
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },
    items: {
      type: [poItemSchema],
      validate: {
        validator: function (val) {
          return val && val.length > 0;
        },
        message: 'Purchase order must have at least one line item',
      },
    },
    subtotal: {
      type: Number,
      default: 0,
    },
    taxTotal: {
      type: Number,
      default: 0,
    },
    grandTotal: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: [
        'DRAFT',
        'PENDING APPROVAL',
        'APPROVED',
        'PROCESSING',
        'SHIPPED',
        'DELIVERED',
        'COMPLETED',
        'CANCELLED',
      ],
      default: 'DRAFT',
    },
    statusHistory: [poStatusHistorySchema],
  },
  {
    timestamps: true,
  }
);

// Calculation hook before save
purchaseOrderSchema.pre('save', async function (next) {
  let calculatedSubtotal = 0;
  let calculatedTaxTotal = 0;

  if (this.items && this.items.length > 0) {
    this.items.forEach((item) => {
      const itemSubtotal = Number((item.quantity * item.unitPrice).toFixed(2));
      const itemTax = Number(((itemSubtotal * (item.taxPercent || 0)) / 100).toFixed(2));
      const itemTotal = Number((itemSubtotal + itemTax).toFixed(2));

      item.subtotal = itemSubtotal;
      item.taxAmount = itemTax;
      item.total = itemTotal;

      calculatedSubtotal += itemSubtotal;
      calculatedTaxTotal += itemTax;
    });
  }

  this.subtotal = Number(calculatedSubtotal.toFixed(2));
  this.taxTotal = Number(calculatedTaxTotal.toFixed(2));
  this.grandTotal = Number((this.subtotal + this.taxTotal).toFixed(2));

  // Auto-generate PO Number if missing
  if (!this.poNumber) {
    const currentYear = new Date().getFullYear();
    const count = await mongoose.model('PurchaseOrder').countDocuments();
    this.poNumber = `PO-${currentYear}-${String(count + 1).padStart(4, '0')}`;
  }

  // If status history is empty, record initial creation
  if (!this.statusHistory || this.statusHistory.length === 0) {
    this.statusHistory = [
      {
        status: this.status,
        changedBy: this.createdBy,
        changedAt: new Date(),
        remarks: 'Purchase order created in system.',
      },
    ];
  }

  next();
});

module.exports = mongoose.model('PurchaseOrder', purchaseOrderSchema);
