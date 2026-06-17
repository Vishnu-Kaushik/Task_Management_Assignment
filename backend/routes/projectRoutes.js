import express from 'express';
import { createProject, getProjects } from '../controllers/projectController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// We can chain routes that share the same path ('/')
// Notice how 'protect' runs BEFORE the controller functions
router.route('/')
  .post(protect, createProject)
  .get(protect, getProjects);

export default router;