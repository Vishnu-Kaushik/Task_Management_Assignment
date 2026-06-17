import Task from '../models/Task.js';
import Project from '../models/Project.js';

// @desc    Create a new task within a project
// @route   POST /api/tasks
// @access  Private
export const createTask = async (req, res) => {
  const { title, description, dueDate, priority, project, assignedTo } = req.body;

  try {
    // Verify the project exists first
    const projectExists = await Project.findById(project);
    if (!projectExists) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const task = await Task.create({
      title,
      description,
      dueDate,
      priority,
      project,
      assignedTo: assignedTo || null
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all tasks for a specific project
// @route   GET /api/tasks/:projectId
// @access  Private
export const getProjectTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ project: req.params.projectId })
      .populate('assignedTo', 'name email');
    
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update task details (Status, Assignee, etc.)
// @route   PUT /api/tasks/:id
// @access  Private
export const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Update fields dynamically if they are passed in the request body
    task.title = req.body.title || task.title;
    task.description = req.body.description || task.description;
    task.dueDate = req.body.dueDate || task.dueDate;
    task.priority = req.body.priority || task.priority;
    task.status = req.body.status || task.status;
    task.assignedTo = req.body.assignedTo !== undefined ? req.body.assignedTo : task.assignedTo;

    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};