const express = require('express');
const router = express.Router();
const {
  saveOnboardingStep,
  getOnboardingApplications,
  getOnboardingApplicationById,
  approveApplication,
  rejectApplication,
  requestChanges,
} = require('../controllers/onboardingController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.post('/step', protect, saveOnboardingStep);
router.get('/', protect, authorize('admin'), getOnboardingApplications);
router.get('/:id', protect, getOnboardingApplicationById);
router.patch('/:id/approve', protect, authorize('admin'), approveApplication);
router.patch('/:id/reject', protect, authorize('admin'), rejectApplication);
router.patch('/:id/request-changes', protect, authorize('admin'), requestChanges);

module.exports = router;
