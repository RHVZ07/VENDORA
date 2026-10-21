const express = require('express');
const router = express.Router();
const {
  getAdminDashboardStats,
  getVendorDashboardStats,
} = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/stats', protect, authorize('admin'), getAdminDashboardStats);
router.get('/vendor-stats', protect, authorize('vendor'), getVendorDashboardStats);

module.exports = router;
