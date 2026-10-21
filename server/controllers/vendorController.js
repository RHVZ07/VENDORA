const Vendor = require('../models/Vendor');
const User = require('../models/User');
const Document = require('../models/Document');
const VendorEvaluation = require('../models/VendorEvaluation');
const PurchaseOrder = require('../models/PurchaseOrder');
const Notification = require('../models/Notification');

// @desc    Get all vendors with search, filter, and pagination
// @route   GET /api/vendors
// @access  Private (Admin)
const getVendors = async (req, res) => {
  try {
    const {
      search,
      status,
      industry,
      ratingTier,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 10,
    } = req.query;

    const query = {};

    // Search by name, vendorId, email, contactPerson
    if (search) {
      query.$or = [
        { companyName: { $regex: search, $options: 'i' } },
        { vendorId: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { contactPerson: { $regex: search, $options: 'i' } },
      ];
    }

    // Filter by status
    if (status && status !== 'ALL') {
      query.status = status;
    }

    // Filter by industry
    if (industry && industry !== 'ALL') {
      query.industry = industry;
    }

    // Filter by ratingTier
    if (ratingTier && ratingTier !== 'ALL') {
      query.ratingTier = ratingTier;
    }

    const sortOption = {};
    sortOption[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const skip = (Number(page) - 1) * Number(limit);
    const totalVendors = await Vendor.countDocuments(query);

    const vendors = await Vendor.find(query)
      .populate('user', 'name email phone isActive')
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));

    res.json({
      success: true,
      count: vendors.length,
      total: totalVendors,
      totalPages: Math.ceil(totalVendors / Number(limit)),
      currentPage: Number(page),
      vendors,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get vendor by ID with populated relations
// @route   GET /api/vendors/:id
// @access  Private
const getVendorById = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id)
      .populate('user', 'name email phone isActive')
      .populate('approvedBy', 'name email');

    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor not found' });
    }

    // If role is vendor, ensure they only view their own profile
    if (req.user.role === 'vendor' && vendor.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this vendor profile' });
    }

    // Fetch related records
    const documents = await Document.find({ vendor: vendor._id }).sort({ createdAt: -1 });
    const evaluations = await VendorEvaluation.find({ vendor: vendor._id })
      .populate('evaluatedBy', 'name email')
      .sort({ evaluationDate: -1 });
    const purchaseOrders = await PurchaseOrder.find({ vendor: vendor._id }).sort({ poDate: -1 });

    res.json({
      success: true,
      vendor,
      documents,
      evaluations,
      purchaseOrders,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get logged in vendor's own profile
// @route   GET /api/vendors/profile/me
// @access  Private (Vendor)
const getMyVendorProfile = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ user: req.user._id })
      .populate('user', 'name email phone')
      .populate('approvedBy', 'name email');

    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor profile not found' });
    }

    const documents = await Document.find({ vendor: vendor._id }).sort({ createdAt: -1 });
    const evaluations = await VendorEvaluation.find({ vendor: vendor._id })
      .populate('evaluatedBy', 'name')
      .sort({ evaluationDate: -1 });
    const purchaseOrders = await PurchaseOrder.find({ vendor: vendor._id }).sort({ poDate: -1 });

    res.json({
      success: true,
      vendor,
      documents,
      evaluations,
      purchaseOrders,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new vendor (Admin)
// @route   POST /api/vendors
// @access  Private (Admin)
const createVendor = async (req, res) => {
  try {
    const {
      companyName,
      contactPerson,
      email,
      phone,
      businessType,
      industry,
      registrationNumber,
      gstNumber,
      panNumber,
      yearEstablished,
      numberOfEmployees,
      address,
      city,
      state,
      pincode,
      country,
      productsServices,
      businessDescription,
      bankName,
      accountHolderName,
      accountNumber,
      ifscCode,
      status = 'ACTIVE',
    } = req.body;

    // Check if user exists or create one
    let vendorUser = await User.findOne({ email: email.toLowerCase() });
    if (!vendorUser) {
      vendorUser = await User.create({
        name: contactPerson,
        email: email.toLowerCase(),
        password: 'Vendor@123Default', // default temporary password
        role: 'vendor',
        phone,
      });
    }

    const vendor = await Vendor.create({
      user: vendorUser._id,
      companyName,
      contactPerson,
      email: email.toLowerCase(),
      phone,
      businessType,
      industry,
      registrationNumber,
      gstNumber,
      panNumber,
      yearEstablished,
      numberOfEmployees,
      address,
      city,
      state,
      pincode,
      country,
      productsServices: Array.isArray(productsServices) ? productsServices : (productsServices ? [productsServices] : []),
      businessDescription,
      bankName,
      accountHolderName,
      accountNumber,
      ifscCode,
      status,
      onboardingCompleted: true,
      onboardingStep: 6,
    });

    vendorUser.vendorProfile = vendor._id;
    await vendorUser.save();

    res.status(201).json({
      success: true,
      message: 'Vendor created successfully',
      vendor,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update vendor (Admin or authorized fields)
// @route   PUT /api/vendors/:id
// @access  Private
const updateVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);

    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor not found' });
    }

    // Role check: vendor can only update their own profile, and cannot update restricted fields
    if (req.user.role === 'vendor') {
      if (vendor.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: 'Not authorized to modify this vendor' });
      }

      // Prevent vendor from changing status or performance
      delete req.body.status;
      delete req.body.performanceScore;
      delete req.body.ratingTier;
      delete req.body.approvalDate;
      delete req.body.approvedBy;
    }

    const updatedVendor = await Vendor.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      message: 'Vendor profile updated successfully',
      vendor: updatedVendor,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update vendor status (Admin action: Activate, Suspend, Approve, Reject)
// @route   PATCH /api/vendors/:id/status
// @access  Private (Admin)
const updateVendorStatus = async (req, res) => {
  try {
    const { status, adminNotes, rejectionReason, requestedChanges } = req.body;
    const vendor = await Vendor.findById(req.params.id);

    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor not found' });
    }

    vendor.status = status;
    if (adminNotes) vendor.adminNotes = adminNotes;
    if (rejectionReason) vendor.rejectionReason = rejectionReason;
    if (requestedChanges) vendor.requestedChanges = requestedChanges;

    if (status === 'APPROVED' || status === 'ACTIVE') {
      vendor.approvedBy = req.user._id;
      vendor.approvalDate = new Date();
    }

    await vendor.save();

    // Create notification for vendor
    await Notification.create({
      recipient: vendor.user,
      title: `Vendor Status Updated: ${status}`,
      message: `Your vendor account status has been changed to ${status}.${adminNotes ? ' Note: ' + adminNotes : ''}`,
      type: status === 'ACTIVE' || status === 'APPROVED' ? 'success' : 'warning',
      link: '/dashboard',
    });

    res.json({
      success: true,
      message: `Vendor status successfully updated to ${status}`,
      vendor,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete vendor
// @route   DELETE /api/vendors/:id
// @access  Private (Admin)
const deleteVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);

    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor not found' });
    }

    // Clean up related documents, evaluations, purchase orders
    await Document.deleteMany({ vendor: vendor._id });
    await VendorEvaluation.deleteMany({ vendor: vendor._id });
    await PurchaseOrder.deleteMany({ vendor: vendor._id });
    await Vendor.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Vendor and associated records removed successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getVendors,
  getVendorById,
  getMyVendorProfile,
  createVendor,
  updateVendor,
  updateVendorStatus,
  deleteVendor,
};
