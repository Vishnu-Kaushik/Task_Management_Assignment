import Task from '../models/Task.js';
import Project from '../models/Project.js';
import mongoose from 'mongoose';

// @desc    Get dashboard metrics for a specific project
// @route   GET /api/dashboard/:projectId
// @access  Private
export const getProjectMetrics = async (req, res) => {
  try {
    const projectId = req.params.projectId;

    // 1. Security Check: Verify project exists and user has access
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const isMember = project.members.includes(req.user._id);
    const isAdmin = project.admin.toString() === req.user._id.toString();

    if (!isMember && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to view this project' });
    }

    // 2. Total Tasks
    const totalTasks = await Task.countDocuments({ project: projectId });

    // 3. Overdue Tasks (Due date is in the past, and status is not 'Done')
    const currentDate = new Date();
    const overdueTasks = await Task.countDocuments({
      project: projectId,
      dueDate: { $lt: currentDate },
      status: { $ne: 'Done' }
    });

    // 4. Tasks by Status (Using Aggregation Pipeline)
    const tasksByStatus = await Task.aggregate([
      { $match: { project: new mongoose.Types.ObjectId(projectId) } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // 5. Tasks per User (Grouping by assignee and fetching their names)
    const tasksByUser = await Task.aggregate([
      { $match: { project: new mongoose.Types.ObjectId(projectId) } },
      { $group: { _id: '$assignedTo', count: { $sum: 1 } } },
      {
        $lookup: {
          from: 'users', // Matches the User collection
          localField: '_id',
          foreignField: '_id',
          as: 'userInfo'
        }
      },
      { $unwind: { path: '$userInfo', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          count: 1,
          name: { $ifNull: ['$userInfo.name', 'Unassigned'] }
        }
      }
    ]);

    // Send the compiled metrics back
    res.json({
      totalTasks,
      overdueTasks,
      tasksByStatus,
      tasksByUser
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};