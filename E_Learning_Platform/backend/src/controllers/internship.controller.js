const Internship = require('../models/internship.model');
const Application = require('../models/application.model');

// @desc    Get all active internship programs
// @route   GET /api/internships
// @access  Public
const getAllInternships = async (req, res, next) => {
  try {
    const internships = await Internship.find({});
    res.json(internships);
  } catch (error) {
    next(error);
  }
};

// @desc    Apply for an internship
// @route   POST /api/internships/apply
// @access  Private
const applyInternship = async (req, res, next) => {
  try {
    const { internshipId, college, branch, resumeName } = req.body;

    // Verify internship exists
    const internship = await Internship.findById(internshipId);
    if (!internship) {
      return res.status(404).json({ message: 'Internship program not found.' });
    }

    // Check if student has already applied
    const existingApplication = await Application.findOne({
      user: req.user._id,
      internship: internshipId,
    });

    if (existingApplication) {
      return res.status(400).json({
        message: 'You have already submitted an application for this internship.',
      });
    }

    // Create the application
    const application = await Application.create({
      user: req.user._id,
      internship: internshipId,
      college,
      branch,
      resumeName,
    });

    res.status(201).json({
      message: 'Application submitted successfully!',
      application,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current student's applications
// @route   GET /api/internships/my-applications
// @access  Private
const getMyApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ user: req.user._id })
      .populate('internship')
      .sort({ appliedAt: -1 });

    res.json(applications);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all applications across platform (Admin)
// @route   GET /api/internships/admin/all-applications
// @access  Private (Admin/Instructor)
const getAllApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({})
      .populate('user', 'name email college branch')
      .populate('internship', 'title company duration stipend')
      .sort({ appliedAt: -1 });

    res.json(applications);
  } catch (error) {
    next(error);
  }
};

// @desc    Update application review status (Admin)
// @route   PUT /api/internships/admin/applications/:id/status
// @access  Private (Admin/Instructor)
const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Applied', 'Under Review', 'Accepted', 'Rejected'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status provided.' });
    }

    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )
      .populate('user', 'name email college branch')
      .populate('internship', 'title company duration stipend');

    if (!application) {
      return res.status(404).json({ message: 'Application not found.' });
    }

    res.json({
      message: `Application status updated to ${status}.`,
      application,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new internship (Admin)
// @route   POST /api/internships
// @access  Private (Admin/Instructor)
const createInternship = async (req, res, next) => {
  try {
    const { title, description, duration, company, stipend, skillsRequired, projects } = req.body;

    const internship = await Internship.create({
      title,
      description,
      duration,
      company: company || 'Mountreach Solution Private Limited',
      stipend,
      skillsRequired: Array.isArray(skillsRequired) ? skillsRequired : (skillsRequired ? skillsRequired.split(',').map(s => s.trim()) : []),
      projects: Array.isArray(projects) ? projects : (projects ? projects.split(',').map(p => p.trim()) : []),
    });

    res.status(201).json({
      message: 'Internship program created successfully.',
      internship,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an internship (Admin)
// @route   DELETE /api/internships/:id
// @access  Private (Admin/Instructor)
const deleteInternship = async (req, res, next) => {
  try {
    const internship = await Internship.findByIdAndDelete(req.params.id);
    if (!internship) {
      return res.status(404).json({ message: 'Internship program not found.' });
    }

    res.json({ message: 'Internship program deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllInternships,
  applyInternship,
  getMyApplications,
  getAllApplications,
  updateApplicationStatus,
  createInternship,
  deleteInternship,
};
