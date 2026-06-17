import express from 'express';
import { getProjectMetrics } from '../controllers/dashboardController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Route for fetching dashboard metrics
router.route('/:projectId').get(protect, getProjectMetrics);

export default router;