const VendorEvaluation = require('../models/VendorEvaluation');
const Vendor = require('../models/Vendor');
const Notification = require('../models/Notification');

// @desc    Get all vendor evaluations
// @route   GET /api/evaluations
// @access  Private
const getEvaluations = async (req, res) => {
  try {
    const { vendorId, ratingTier, search } = req.query;
    const query = {};

    if (vendorId) {
      query.vendor = vendorId;
    }

    if (ratingTier && ratingTier !== 'ALL') {
      query.ratingTier = ratingTier;
    }

    // If user is vendor, restrict to their own evaluations
    if (req.user.role === 'vendor') {
      const vendorDoc = await Vendor.findOne({ user: req.user._id });
      if (!vendorDoc) {
        return res.json({ success: true, evaluations: [] });
      }
      query.vendor = vendorDoc._id;
    }

    let evaluations = await VendorEvaluation.find(query)
      .populate('vendor', 'companyName vendorId industry contactPerson email performanceScore ratingTier')
      .populate('evaluatedBy', 'name email')
      .sort({ evaluationDate: -1 });

    if (search) {
      const searchLower = search.toLowerCase();
      evaluations = evaluations.filter(
        (ev) =>
          ev.vendor?.companyName?.toLowerCase().includes(searchLower) ||
          ev.vendor?.vendorId?.toLowerCase().includes(searchLower)
      );
    }

    res.json({
      success: true,
      count: evaluations.length,
      evaluations,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single evaluation by ID
// @route   GET /api/evaluations/:id
// @access  Private
const getEvaluationById = async (req, res) => {
  try {
    const evaluation = await VendorEvaluation.findById(req.params.id)
      .populate('vendor', 'companyName vendorId industry contactPerson email user performanceScore ratingTier')
      .populate('evaluatedBy', 'name email');

    if (!evaluation) {
      return res.status(404).json({ success: false, message: 'Evaluation not found' });
    }

    if (
      req.user.role === 'vendor' &&
      evaluation.vendor?.user?.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this evaluation' });
    }

    res.json({
      success: true,
      evaluation,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new vendor performance evaluation
// @route   POST /api/evaluations
// @access  Private (Admin)
const createEvaluation = async (req, res) => {
  try {
    const { vendorId, criteria, comments, evaluationDate } = req.body;

    if (!vendorId || !criteria) {
      return res.status(400).json({ success: false, message: 'Vendor and evaluation criteria are required' });
    }

    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor not found' });
    }

    const evaluation = new VendorEvaluation({
      vendor: vendorId,
      evaluatedBy: req.user._id,
      criteria: {
        quality: Number(criteria.quality) || 4,
        delivery: Number(criteria.delivery) || 4,
        pricing: Number(criteria.pricing) || 4,
        communication: Number(criteria.communication) || 4,
        reliability: Number(criteria.reliability) || 4,
        compliance: Number(criteria.compliance) || 4,
      },
      comments,
      evaluationDate: evaluationDate || new Date(),
    });

    await evaluation.save();

    // Notify vendor
    await Notification.create({
      recipient: vendor.user,
      title: 'New Performance Evaluation Submitted',
      message: `A new performance review has been recorded for ${vendor.companyName} with an overall score of ${evaluation.overallScore}/5.0 (${evaluation.ratingTier}).`,
      type: 'info',
      link: '/performance',
    });

    const populatedEvaluation = await VendorEvaluation.findById(evaluation._id)
      .populate('vendor', 'companyName vendorId performanceScore ratingTier')
      .populate('evaluatedBy', 'name email');

    res.status(201).json({
      success: true,
      message: 'Evaluation created successfully',
      evaluation: populatedEvaluation,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update vendor evaluation
// @route   PUT /api/evaluations/:id
// @access  Private (Admin)
const updateEvaluation = async (req, res) => {
  try {
    const { criteria, comments } = req.body;
    const evaluation = await VendorEvaluation.findById(req.params.id);

    if (!evaluation) {
      return res.status(404).json({ success: false, message: 'Evaluation not found' });
    }

    if (criteria) {
      evaluation.criteria = {
        quality: Number(criteria.quality) || evaluation.criteria.quality,
        delivery: Number(criteria.delivery) || evaluation.criteria.delivery,
        pricing: Number(criteria.pricing) || evaluation.criteria.pricing,
        communication: Number(criteria.communication) || evaluation.criteria.communication,
        reliability: Number(criteria.reliability) || evaluation.criteria.reliability,
        compliance: Number(criteria.compliance) || evaluation.criteria.compliance,
      };
    }

    if (comments !== undefined) {
      evaluation.comments = comments;
    }

    await evaluation.save();

    const updated = await VendorEvaluation.findById(evaluation._id)
      .populate('vendor', 'companyName vendorId')
      .populate('evaluatedBy', 'name email');

    res.json({
      success: true,
      message: 'Evaluation updated successfully',
      evaluation: updated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getEvaluations,
  getEvaluationById,
  createEvaluation,
  updateEvaluation,
};
