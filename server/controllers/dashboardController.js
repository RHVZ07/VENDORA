const Vendor = require('../models/Vendor');
const PurchaseOrder = require('../models/PurchaseOrder');
const VendorEvaluation = require('../models/VendorEvaluation');
const Document = require('../models/Document');
const Notification = require('../models/Notification');
const User = require('../models/User');

// @desc    Get Admin Dashboard statistics and chart analytics
// @route   GET /api/dashboard/stats
// @access  Private (Admin)
const getAdminDashboardStats = async (req, res) => {
  try {
    const totalVendors = await Vendor.countDocuments();
    const pendingOnboarding = await Vendor.countDocuments({
      status: { $in: ['PENDING', 'UNDER REVIEW'] },
    });
    const activeVendors = await Vendor.countDocuments({ status: 'ACTIVE' });
    
    // Vendors with no evaluations yet or evaluations older than 30 days
    const evaluatedVendorIds = await VendorEvaluation.distinct('vendor');
    const pendingEvaluations = await Vendor.countDocuments({
      status: 'ACTIVE',
      _id: { $nin: evaluatedVendorIds },
    });

    const activePOs = await PurchaseOrder.countDocuments({
      status: { $in: ['APPROVED', 'PROCESSING', 'SHIPPED', 'DELIVERED'] },
    });

    const allCompletedAndActivePOs = await PurchaseOrder.find({
      status: { $nin: ['DRAFT', 'CANCELLED'] },
    });
    const totalPOValue = allCompletedAndActivePOs.reduce(
      (sum, po) => sum + (po.grandTotal || 0),
      0
    );

    // Vendor Status Chart Breakdown
    const statusCounts = await Vendor.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);
    const vendorStatusChart = [
      { name: 'Active', value: 0, color: '#10B981' },
      { name: 'Pending', value: 0, color: '#F59E0B' },
      { name: 'Under Review', value: 0, color: '#8B5CF6' },
      { name: 'Approved', value: 0, color: '#3B82F6' },
      { name: 'Suspended', value: 0, color: '#6B7280' },
      { name: 'Rejected', value: 0, color: '#EF4444' },
    ];
    statusCounts.forEach((item) => {
      const target = vendorStatusChart.find(
        (c) => c.name.toUpperCase() === item._id.replace('_', ' ')
      );
      if (target) target.value = item.count;
    });

    // Purchase Order Status Breakdown
    const poStatusCounts = await PurchaseOrder.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 }, totalAmount: { $sum: '$grandTotal' } } },
    ]);
    const poStatusChart = [
      { name: 'Draft', value: 0, color: '#94A3B8' },
      { name: 'Pending Approval', value: 0, color: '#F59E0B' },
      { name: 'Approved', value: 0, color: '#8B5CF6' },
      { name: 'Processing', value: 0, color: '#3B82F6' },
      { name: 'Shipped', value: 0, color: '#EC4899' },
      { name: 'Delivered', value: 0, color: '#06B6D4' },
      { name: 'Completed', value: 0, color: '#10B981' },
      { name: 'Cancelled', value: 0, color: '#EF4444' },
    ];
    poStatusCounts.forEach((item) => {
      const match = poStatusChart.find(
        (c) => c.name.toUpperCase() === item._id.toUpperCase()
      );
      if (match) match.value = item.count;
    });

    // Vendor Performance Distribution
    const performanceCounts = await Vendor.aggregate([
      { $match: { status: 'ACTIVE' } },
      { $group: { _id: '$ratingTier', count: { $sum: 1 } } },
    ]);
    const vendorPerformanceChart = [
      { name: 'Excellent (4.5-5.0)', count: 0, fill: '#10B981' },
      { name: 'Good (3.5-4.4)', count: 0, fill: '#7C3AED' },
      { name: 'Average (2.5-3.4)', count: 0, fill: '#F59E0B' },
      { name: 'Poor (<2.5)', count: 0, fill: '#EF4444' },
      { name: 'Unrated', count: 0, fill: '#94A3B8' },
    ];
    performanceCounts.forEach((p) => {
      const tier = p._id || 'Unrated';
      const item = vendorPerformanceChart.find((chart) => chart.name.startsWith(tier));
      if (item) item.count = p.count;
    });

    // Monthly Spend Chart (last 6 months)
    const monthlySpend = await PurchaseOrder.aggregate([
      {
        $match: {
          status: { $nin: ['DRAFT', 'CANCELLED'] },
        },
      },
      {
        $group: {
          _id: {
            month: { $month: '$createdAt' },
            year: { $year: '$createdAt' },
          },
          spend: { $sum: '$grandTotal' },
          orders: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlySpendChart = monthlySpend.map((m) => ({
      month: `${monthNames[m._id.month - 1]} ${m._id.year}`,
      spend: m.spend,
      orders: m.orders,
    }));

    // Recent Vendor Registrations
    const recentVendors = await Vendor.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('companyName vendorId industry status contactPerson email createdAt performanceScore ratingTier');

    // Recent Purchase Orders
    const recentPurchaseOrders = await PurchaseOrder.find()
      .populate('vendor', 'companyName vendorId')
      .sort({ createdAt: -1 })
      .limit(5);

    // Pending Approvals (both onboarding & POs pending approval)
    const pendingOnboardingList = await Vendor.find({
      status: { $in: ['PENDING', 'UNDER REVIEW'] },
    })
      .sort({ createdAt: -1 })
      .limit(5);

    const pendingPOsList = await PurchaseOrder.find({ status: 'PENDING APPROVAL' })
      .populate('vendor', 'companyName vendorId')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      stats: {
        totalVendors,
        pendingOnboarding,
        activeVendors,
        pendingEvaluations,
        activePurchaseOrders: activePOs,
        totalPurchaseOrderValue: totalPOValue,
      },
      charts: {
        vendorStatusChart,
        poStatusChart,
        vendorPerformanceChart,
        monthlySpendChart,
      },
      recentVendors,
      recentPurchaseOrders,
      pendingApprovals: {
        onboarding: pendingOnboardingList,
        purchaseOrders: pendingPOsList,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Vendor Dashboard statistics
// @route   GET /api/dashboard/vendor-stats
// @access  Private (Vendor)
const getVendorDashboardStats = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ user: req.user._id });

    if (!vendor) {
      return res.json({
        success: true,
        stats: {
          applicationStatus: 'NOT_STARTED',
          profileCompletion: 0,
          performanceScore: 0,
          ratingTier: 'Unrated',
          activePurchaseOrders: 0,
          completedPurchaseOrders: 0,
          totalSpendEarned: 0,
        },
        vendor: null,
        recentPOs: [],
        documents: [],
        evaluations: [],
      });
    }

    // Calculate Profile Completion %
    let filledFields = 0;
    const keyFields = [
      vendor.companyName,
      vendor.businessType,
      vendor.industry,
      vendor.registrationNumber,
      vendor.gstNumber,
      vendor.panNumber,
      vendor.contactPerson,
      vendor.email,
      vendor.phone,
      vendor.address,
      vendor.city,
      vendor.state,
      vendor.pincode,
      vendor.bankName,
      vendor.accountHolderName,
      vendor.accountNumber,
      vendor.ifscCode,
    ];
    keyFields.forEach((val) => {
      if (val && String(val).trim().length > 0) filledFields++;
    });
    const profileCompletion = Math.round((filledFields / keyFields.length) * 100);

    const activePOsCount = await PurchaseOrder.countDocuments({
      vendor: vendor._id,
      status: { $in: ['APPROVED', 'PROCESSING', 'SHIPPED', 'DELIVERED'] },
    });

    const completedPOsCount = await PurchaseOrder.countDocuments({
      vendor: vendor._id,
      status: 'COMPLETED',
    });

    const allVendorPOs = await PurchaseOrder.find({ vendor: vendor._id });
    const totalEarned = allVendorPOs
      .filter((po) => po.status === 'COMPLETED' || po.status === 'DELIVERED')
      .reduce((sum, po) => sum + (po.grandTotal || 0), 0);

    const recentPOs = await PurchaseOrder.find({ vendor: vendor._id })
      .sort({ createdAt: -1 })
      .limit(5);

    const documents = await Document.find({ vendor: vendor._id }).sort({ createdAt: -1 });
    const evaluations = await VendorEvaluation.find({ vendor: vendor._id })
      .populate('evaluatedBy', 'name')
      .sort({ evaluationDate: -1 });

    res.json({
      success: true,
      stats: {
        applicationStatus: vendor.status,
        profileCompletion,
        performanceScore: vendor.performanceScore || 0,
        ratingTier: vendor.ratingTier || 'Unrated',
        evaluationCount: vendor.evaluationCount || 0,
        activePurchaseOrders: activePOsCount,
        completedPurchaseOrders: completedPOsCount,
        totalEarned,
      },
      vendor,
      recentPOs,
      documents,
      evaluations,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAdminDashboardStats,
  getVendorDashboardStats,
};
