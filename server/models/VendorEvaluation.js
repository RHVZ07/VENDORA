const mongoose = require('mongoose');

const vendorEvaluationSchema = new mongoose.Schema(
  {
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vendor',
      required: [true, 'Vendor reference is required'],
    },
    evaluatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Evaluator user is required'],
    },
    criteria: {
      quality: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
        default: 4,
      },
      delivery: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
        default: 4,
      },
      pricing: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
        default: 4,
      },
      communication: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
        default: 4,
      },
      reliability: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
        default: 4,
      },
      compliance: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
        default: 4,
      },
    },
    overallScore: {
      type: Number,
      min: 1,
      max: 5,
    },
    ratingTier: {
      type: String,
      enum: ['Excellent', 'Good', 'Average', 'Poor'],
      default: 'Good',
    },
    comments: {
      type: String,
      trim: true,
    },
    evaluationDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Auto calculate overall score and tier before saving
vendorEvaluationSchema.pre('save', function (next) {
  const c = this.criteria;
  const avg = (c.quality + c.delivery + c.pricing + c.communication + c.reliability + c.compliance) / 6;
  this.overallScore = Number(avg.toFixed(2));

  if (this.overallScore >= 4.5) {
    this.ratingTier = 'Excellent';
  } else if (this.overallScore >= 3.5) {
    this.ratingTier = 'Good';
  } else if (this.overallScore >= 2.5) {
    this.ratingTier = 'Average';
  } else {
    this.ratingTier = 'Poor';
  }

  next();
});

// Post-save hook to recalculate vendor's average performance score
vendorEvaluationSchema.post('save', async function () {
  try {
    const Vendor = mongoose.model('Vendor');
    const evaluations = await this.constructor.find({ vendor: this.vendor });
    if (evaluations.length > 0) {
      const sum = evaluations.reduce((acc, curr) => acc + curr.overallScore, 0);
      const avg = Number((sum / evaluations.length).toFixed(2));
      
      let tier = 'Unrated';
      if (avg >= 4.5) tier = 'Excellent';
      else if (avg >= 3.5) tier = 'Good';
      else if (avg >= 2.5) tier = 'Average';
      else tier = 'Poor';

      await Vendor.findByIdAndUpdate(this.vendor, {
        performanceScore: avg,
        ratingTier: tier,
        evaluationCount: evaluations.length,
      });
    }
  } catch (err) {
    console.error('Error updating vendor performance score:', err);
  }
});

module.exports = mongoose.model('VendorEvaluation', vendorEvaluationSchema);
