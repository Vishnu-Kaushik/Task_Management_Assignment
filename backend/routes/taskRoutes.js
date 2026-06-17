import express from 'express';
import { createTask, getProjectTasks, updateTask } from '../controllers/taskController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Route for creating a task
router.route('/').post(protect, createTask);

// Route for getting tasks associated with a specific project ID
router.route('/:projectId').get(protect, getProjectTasks);

// Route for updating a single task by its unique task ID
router.route('/update/:id').put(protect, updateTask);

export default router;