const Vendor = require('../models/Vendor');
const User = require('../models/User');
const Document = require('../models/Document');
const Notification = require('../models/Notification');

// @desc    Submit or update onboarding step
// @route   POST /api/onboarding/step
// @access  Private (Vendor)
const saveOnboardingStep = async (req, res) => {
  try {
    const { step, data, isFinalSubmission } = req.body;
    let vendor = await Vendor.findOne({ user: req.user._id });

    if (!vendor) {
      vendor = new Vendor({
        user: req.user._id,
        companyName: data.companyName || `${req.user.name}'s Enterprise`,
        contactPerson: req.user.name,
        email: req.user.email,
        phone: req.user.phone || '',
      });
    }

    // Merge incoming data into vendor
    Object.keys(data).forEach((key) => {
      vendor[key] = data[key];
    });

    if (step) {
      vendor.onboardingStep = Math.max(vendor.onboardingStep, Number(step));
    }

    if (isFinalSubmission) {
      vendor.onboardingCompleted = true;
      vendor.status = 'PENDING';
      vendor.onboardingStep = 6;

      // Notify Admins
      const admins = await User.find({ role: 'admin' });
      const notifications = admins.map((admin) => ({
        recipient: admin._id,
        title: 'New Supplier Onboarding Application',
        message: `${vendor.companyName} has submitted an onboarding application for review.`,
        type: 'info',
        link: `/onboarding-requests/${vendor._id}`,
      }));
      if (notifications.length > 0) {
        await Notification.insertMany(notifications);
      }

      // Notify Vendor
      await Notification.create({
        recipient: req.user._id,
        title: 'Application Submitted Successfully',
        message: 'Your supplier onboarding application has been submitted and is currently pending admin review.',
        type: 'success',
        link: '/dashboard',
      });
    }

    await vendor.save();

    res.json({
      success: true,
      message: isFinalSubmission
        ? 'Onboarding application submitted successfully'
        : 'Onboarding step saved',
      vendor,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all onboarding applications (Admin)
// @route   GET /api/onboarding
// @access  Private (Admin)
const getOnboardingApplications = async (req, res) => {
  try {
    const { status, search } = req.query;
    const query = {};

    if (status && status !== 'ALL') {
      query.status = status;
    } else {
      query.status = { $in: ['PENDING', 'UNDER REVIEW', 'REJECTED', 'APPROVED'] };
    }

    if (search) {
      query.$or = [
        { companyName: { $regex: search, $options: 'i' } },
        { vendorId: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { contactPerson: { $regex: search, $options: 'i' } },
      ];
    }

    const applications = await Vendor.find(query)
      .populate('user', 'name email phone')
      .sort({ updatedAt: -1 });

    res.json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single onboarding application details
// @route   GET /api/onboarding/:id
// @access  Private
const getOnboardingApplicationById = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('approvedBy', 'name email');

    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    // Role check
    if (req.user.role === 'vendor' && vendor.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this application' });
    }

    const documents = await Document.find({ vendor: vendor._id }).sort({ createdAt: -1 });

    res.json({
      success: true,
      application: vendor,
      documents,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Approve supplier onboarding application
// @route   PATCH /api/onboarding/:id/approve
// @access  Private (Admin)
const approveApplication = async (req, res) => {
  try {
    const { adminNotes } = req.body;
    const vendor = await Vendor.findById(req.params.id);

    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    vendor.status = 'ACTIVE';
    vendor.approvedBy = req.user._id;
    vendor.approvalDate = new Date();
    if (adminNotes) vendor.adminNotes = adminNotes;

    await vendor.save();

    // Mark pending documents as verified if needed
    await Document.updateMany(
      { vendor: vendor._id, status: 'PENDING' },
      { status: 'VERIFIED', verifiedBy: req.user._id, verifiedAt: new Date() }
    );

    // Notify vendor
    await Notification.create({
      recipient: vendor.user,
      title: 'Supplier Application Approved!',
      message: `Congratulations! Your supplier application for ${vendor.companyName} has been approved. You are now an ACTIVE vendor on VENDORA.`,
      type: 'success',
      link: '/dashboard',
    });

    res.json({
      success: true,
      message: 'Vendor application approved and activated successfully',
      vendor,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Reject supplier onboarding application
// @route   PATCH /api/onboarding/:id/reject
// @access  Private (Admin)
const rejectApplication = async (req, res) => {
  try {
    const { rejectionReason } = req.body;

    if (!rejectionReason) {
      return res.status(400).json({ success: false, message: 'Please provide a reason for rejection' });
    }

    const vendor = await Vendor.findById(req.params.id);
    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    vendor.status = 'REJECTED';
    vendor.rejectionReason = rejectionReason;
    await vendor.save();

    // Notify vendor
    await Notification.create({
      recipient: vendor.user,
      title: 'Supplier Application Status: Rejected',
      message: `Your supplier onboarding application was rejected. Reason: ${rejectionReason}`,
      type: 'danger',
      link: '/onboarding',
    });

    res.json({
      success: true,
      message: 'Application rejected',
      vendor,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Request changes on onboarding application
// @route   PATCH /api/onboarding/:id/request-changes
// @access  Private (Admin)
const requestChanges = async (req, res) => {
  try {
    const { requestedChanges } = req.body;

    if (!requestedChanges) {
      return res.status(400).json({ success: false, message: 'Please specify the changes required' });
    }

    const vendor = await Vendor.findById(req.params.id);
    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    vendor.status = 'UNDER REVIEW';
    vendor.requestedChanges = requestedChanges;
    await vendor.save();

    // Notify vendor
    await Notification.create({
      recipient: vendor.user,
      title: 'Action Required: Supplier Application Changes Requested',
      message: `The procurement team has requested modifications to your application: ${requestedChanges}`,
      type: 'warning',
      link: '/onboarding',
    });

    res.json({
      success: true,
      message: 'Changes requested from vendor',
      vendor,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  saveOnboardingStep,
  getOnboardingApplications,
  getOnboardingApplicationById,
  approveApplication,
  rejectApplication,
  requestChanges,
};
