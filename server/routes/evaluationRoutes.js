const express = require('express');
const router = express.Router();
const {
  getEvaluations,
  getEvaluationById,
  createEvaluation,
  updateEvaluation,
} = require('../controllers/evaluationController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/', protect, getEvaluations);
router.get('/:id', protect, getEvaluationById);
router.post('/', protect, authorize('admin'), createEvaluation);
router.put('/:id', protect, authorize('admin'), updateEvaluation);

module.exports = router;
