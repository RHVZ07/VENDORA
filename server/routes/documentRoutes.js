const express = require('express');
const router = express.Router();
const {
  uploadDocument,
  getDocuments,
  verifyDocument,
  rejectDocument,
  deleteDocument,
} = require('../controllers/documentController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/', protect, upload.single('document'), uploadDocument);
router.get('/', protect, getDocuments);
router.patch('/:id/verify', protect, authorize('admin'), verifyDocument);
router.patch('/:id/reject', protect, authorize('admin'), rejectDocument);
router.delete('/:id', protect, deleteDocument);

module.exports = router;
