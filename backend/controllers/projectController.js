import Project from '../models/Project.js';
import User from '../models/User.js';

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private (Requires Token)
export const createProject = async (req, res) => {
  const { name, description } = req.body;

  try {
    const project = await Project.create({
      name,
      description,
      admin: req.user._id, // The protect middleware provides this req.user
      members: [] // Starts with no extra members
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all projects for the logged-in user (as Admin or Member)
// @route   GET /api/projects
// @access  Private (Requires Token)
export const getProjects = async (req, res) => {
  try {
    // Find projects where the user is EITHER the admin OR in the members array
    const projects = await Project.find({
      $or: [{ admin: req.user._id }, { members: req.user._id }]
    })
      .populate('admin', 'name email') // Brings in actual user data instead of just IDs
      .populate('members', 'name email'); 
    
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};