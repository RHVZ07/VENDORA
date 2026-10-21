const express = require('express');
const router = express.Router();
const {
  getVendors,
  getVendorById,
  getMyVendorProfile,
  createVendor,
  updateVendor,
  updateVendorStatus,
  deleteVendor,
} = require('../controllers/vendorController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/profile/me', protect, authorize('vendor'), getMyVendorProfile);
router.get('/', protect, authorize('admin'), getVendors);
router.get('/:id', protect, getVendorById);
router.post('/', protect, authorize('admin'), createVendor);
router.put('/:id', protect, updateVendor);
router.patch('/:id/status', protect, authorize('admin'), updateVendorStatus);
router.delete('/:id', protect, authorize('admin'), deleteVendor);

module.exports = router;
