const express = require('express');
const router = express.Router();
const {
  getPurchaseOrders,
  getPOById,
  createPO,
  updatePO,
  updatePOStatus,
  deletePO,
} = require('../controllers/purchaseOrderController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/', protect, getPurchaseOrders);
router.get('/:id', protect, getPOById);
router.post('/', protect, authorize('admin'), createPO);
router.put('/:id', protect, authorize('admin'), updatePO);
router.patch('/:id/status', protect, updatePOStatus);
router.delete('/:id', protect, authorize('admin'), deletePO);

module.exports = router;
