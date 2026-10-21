const PurchaseOrder = require('../models/PurchaseOrder');
const Vendor = require('../models/Vendor');
const User = require('../models/User');
const Notification = require('../models/Notification');

// @desc    Get all purchase orders (with filters and search)
// @route   GET /api/purchase-orders
// @access  Private
const getPurchaseOrders = async (req, res) => {
  try {
    const { status, vendorId, search, page = 1, limit = 20 } = req.query;
    const query = {};

    if (status && status !== 'ALL') {
      query.status = status;
    }

    if (vendorId) {
      query.vendor = vendorId;
    }

    // Role check: If vendor, only see own purchase orders
    if (req.user.role === 'vendor') {
      const vendorDoc = await Vendor.findOne({ user: req.user._id });
      if (!vendorDoc) {
        return res.json({ success: true, count: 0, total: 0, purchaseOrders: [] });
      }
      query.vendor = vendorDoc._id;
    }

    if (search) {
      query.$or = [
        { poNumber: { $regex: search, $options: 'i' } },
        { shippingAddress: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await PurchaseOrder.countDocuments(query);

    let purchaseOrders = await PurchaseOrder.find(query)
      .populate('vendor', 'companyName vendorId contactPerson email phone')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    // Calculate aggregated stats
    const totalValue = purchaseOrders.reduce((sum, po) => sum + (po.grandTotal || 0), 0);

    res.json({
      success: true,
      count: purchaseOrders.length,
      total,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      totalValue,
      purchaseOrders,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single purchase order by ID
// @route   GET /api/purchase-orders/:id
// @access  Private
const getPOById = async (req, res) => {
  try {
    const po = await PurchaseOrder.findById(req.params.id)
      .populate('vendor')
      .populate('createdBy', 'name email')
      .populate('statusHistory.changedBy', 'name email role');

    if (!po) {
      return res.status(404).json({ success: false, message: 'Purchase Order not found' });
    }

    // Authorization check for vendor
    if (req.user.role === 'vendor') {
      const vendorDoc = await Vendor.findOne({ user: req.user._id });
      if (!vendorDoc || po.vendor._id.toString() !== vendorDoc._id.toString()) {
        return res.status(403).json({ success: false, message: 'Not authorized to view this purchase order' });
      }
    }

    res.json({
      success: true,
      purchaseOrder: po,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new purchase order
// @route   POST /api/purchase-orders
// @access  Private (Admin)
const createPO = async (req, res) => {
  try {
    const {
      vendor,
      poDate,
      expectedDeliveryDate,
      paymentTerms,
      shippingAddress,
      notes,
      items,
      status = 'PENDING APPROVAL',
    } = req.body;

    if (!vendor || !items || items.length === 0 || !expectedDeliveryDate || !shippingAddress) {
      return res.status(400).json({
        success: false,
        message: 'Vendor, expected delivery date, shipping address, and at least one line item are required',
      });
    }

    const vendorDoc = await Vendor.findById(vendor);
    if (!vendorDoc) {
      return res.status(404).json({ success: false, message: 'Vendor not found' });
    }

    const newPO = new PurchaseOrder({
      vendor,
      createdBy: req.user._id,
      poDate: poDate || new Date(),
      expectedDeliveryDate,
      paymentTerms: paymentTerms || 'Net 30',
      shippingAddress,
      notes,
      items,
      status,
      statusHistory: [
        {
          status,
          changedBy: req.user._id,
          changedAt: new Date(),
          remarks: 'Purchase Order created by Procurement Team',
        },
      ],
    });

    await newPO.save();

    // Create notification for vendor
    await Notification.create({
      recipient: vendorDoc.user,
      title: `New Purchase Order: ${newPO.poNumber}`,
      message: `A new purchase order ${newPO.poNumber} with total value ₹${newPO.grandTotal.toLocaleString()} has been created.`,
      type: 'info',
      link: `/purchase-orders/${newPO._id}`,
    });

    const populatedPO = await PurchaseOrder.findById(newPO._id)
      .populate('vendor', 'companyName vendorId contactPerson email')
      .populate('createdBy', 'name email');

    res.status(201).json({
      success: true,
      message: 'Purchase order created successfully',
      purchaseOrder: populatedPO,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update purchase order details
// @route   PUT /api/purchase-orders/:id
// @access  Private (Admin)
const updatePO = async (req, res) => {
  try {
    const po = await PurchaseOrder.findById(req.params.id);

    if (!po) {
      return res.status(404).json({ success: false, message: 'Purchase order not found' });
    }

    if (po.status === 'COMPLETED' || po.status === 'CANCELLED') {
      return res.status(400).json({
        success: false,
        message: `Cannot edit purchase order in ${po.status} status`,
      });
    }

    const { expectedDeliveryDate, paymentTerms, shippingAddress, notes, items } = req.body;

    if (expectedDeliveryDate) po.expectedDeliveryDate = expectedDeliveryDate;
    if (paymentTerms) po.paymentTerms = paymentTerms;
    if (shippingAddress) po.shippingAddress = shippingAddress;
    if (notes !== undefined) po.notes = notes;
    if (items && items.length > 0) po.items = items;

    await po.save();

    const updated = await PurchaseOrder.findById(po._id)
      .populate('vendor', 'companyName vendorId contactPerson email')
      .populate('createdBy', 'name email');

    res.json({
      success: true,
      message: 'Purchase order updated successfully',
      purchaseOrder: updated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update purchase order status lifecycle
// @route   PATCH /api/purchase-orders/:id/status
// @access  Private
const updatePOStatus = async (req, res) => {
  try {
    const { status, remarks } = req.body;
    const validStatuses = [
      'DRAFT',
      'PENDING APPROVAL',
      'APPROVED',
      'PROCESSING',
      'SHIPPED',
      'DELIVERED',
      'COMPLETED',
      'CANCELLED',
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: `Invalid status: ${status}` });
    }

    const po = await PurchaseOrder.findById(req.params.id).populate('vendor');

    if (!po) {
      return res.status(404).json({ success: false, message: 'Purchase order not found' });
    }

    // Role check: Vendor can only update processing, shipped or delivered in appropriate workflows
    if (req.user.role === 'vendor') {
      const allowedVendorTransitions = ['PROCESSING', 'SHIPPED', 'DELIVERED'];
      if (!allowedVendorTransitions.includes(status)) {
        return res.status(403).json({
          success: false,
          message: 'Vendors can only update fulfillment statuses (PROCESSING, SHIPPED, DELIVERED)',
        });
      }
    }

    po.status = status;
    po.statusHistory.push({
      status,
      changedBy: req.user._id,
      changedAt: new Date(),
      remarks: remarks || `Status transitioned to ${status}`,
    });

    await po.save();

    // Notify appropriate parties
    if (req.user.role === 'admin') {
      await Notification.create({
        recipient: po.vendor.user,
        title: `PO Status Update: ${po.poNumber}`,
        message: `Purchase order ${po.poNumber} status has been updated to ${status}.${remarks ? ' (' + remarks + ')' : ''}`,
        type: status === 'APPROVED' || status === 'COMPLETED' ? 'success' : 'info',
        link: `/purchase-orders/${po._id}`,
      });
    } else {
      const admins = await User.find({ role: 'admin' });
      const notifications = admins.map((admin) => ({
        recipient: admin._id,
        title: `Vendor Updated PO: ${po.poNumber}`,
        message: `${po.vendor.companyName} marked purchase order ${po.poNumber} as ${status}.`,
        type: 'info',
        link: `/purchase-orders/${po._id}`,
      }));
      if (notifications.length > 0) {
        await Notification.insertMany(notifications);
      }
    }

    const populated = await PurchaseOrder.findById(po._id)
      .populate('vendor')
      .populate('createdBy', 'name email')
      .populate('statusHistory.changedBy', 'name email role');

    res.json({
      success: true,
      message: `Purchase order status updated to ${status}`,
      purchaseOrder: populated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete draft purchase order
// @route   DELETE /api/purchase-orders/:id
// @access  Private (Admin)
const deletePO = async (req, res) => {
  try {
    const po = await PurchaseOrder.findById(req.params.id);

    if (!po) {
      return res.status(404).json({ success: false, message: 'Purchase order not found' });
    }

    if (po.status !== 'DRAFT' && po.status !== 'CANCELLED') {
      return res.status(400).json({
        success: false,
        message: 'Only DRAFT or CANCELLED purchase orders can be deleted',
      });
    }

    await PurchaseOrder.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Purchase order deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getPurchaseOrders,
  getPOById,
  createPO,
  updatePO,
  updatePOStatus,
  deletePO,
};
