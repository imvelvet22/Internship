const { Project } = require('../models');

// Get projects
exports.findAll = async (req, res) => {
  try {
    const projects = await Project.findAll();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create project
exports.create = async (req, res) => {
  try {
    const { projectName, client, startDate, endDate } = req.body;
    const project = await Project.create({ projectName, client, startDate, endDate });
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update  project
exports.updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { projectName, client, startDate, endDate } = req.body;

    // Validate input
    if (!projectName || !client || !startDate || !endDate) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if dates are valid
    if (new Date(startDate) > new Date(endDate)) {
      return res.status(400).json({ message: 'End date must be after start date' });
    }

    const [updatedRows] = await Project.update(
      { projectName, client, startDate, endDate },
      { where: { id } }
    );

    if (updatedRows === 0) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const updatedProject = await Project.findByPk(id);
    res.json(updatedProject);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.delete = async (req, res) => {
    try {
      const { id } = req.params;
      const project = await Project.findByPk(id);
      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }
      await project.destroy();
      res.json({ message: "User deleted successfully" });

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };