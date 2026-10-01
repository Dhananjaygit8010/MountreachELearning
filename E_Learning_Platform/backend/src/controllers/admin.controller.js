const User = require('../models/user.model');
const Course = require('../models/course.model');
const Internship = require('../models/internship.model');
const Application = require('../models/application.model');

// @desc    Get complete administrative platform statistics
// @route   GET /api/admin/overview
// @access  Private (Admin)
const getAdminOverview = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments({});
    const totalCourses = await Course.countDocuments({});
    const totalInternships = await Internship.countDocuments({});
    const totalApplications = await Application.countDocuments({});

    const appliedCount = await Application.countDocuments({ status: 'Applied' });
    const reviewingCount = await Application.countDocuments({ status: 'Under Review' });
    const acceptedCount = await Application.countDocuments({ status: 'Accepted' });
    const rejectedCount = await Application.countDocuments({ status: 'Rejected' });

    const recentApplications = await Application.find({})
      .populate('user', 'name email college branch phone')
      .populate('internship', 'title stipend')
      .sort({ appliedAt: -1 })
      .limit(6);

    const allStudents = await User.find({ role: 'student' })
      .select('-password')
      .populate('enrolledCourses', 'title category price duration')
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalCourses,
        totalInternships,
        totalApplications,
        statusBreakdown: {
          applied: appliedCount,
          underReview: reviewingCount,
          accepted: acceptedCount,
          rejected: rejectedCount,
        },
      },
      recentApplications,
      recentStudents: allStudents,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all registered students with attendance & enrollment profiles
// @route   GET /api/admin/students
// @access  Private (Admin)
const getAllStudents = async (req, res, next) => {
  try {
    const students = await User.find({ role: 'student' })
      .select('-password')
      .populate('enrolledCourses', 'title category price duration')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: students.length,
      students,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all support tickets submitted across platform
// @route   GET /api/admin/tickets
// @access  Private (Admin)
const getAllTickets = async (req, res, next) => {
  try {
    const usersWithTickets = await User.find({
      'supportTickets.0': { $exists: true }
    }).select('name email college phone supportTickets');

    let allTickets = [];
    usersWithTickets.forEach((u) => {
      (u.supportTickets || []).forEach((t) => {
        allTickets.push({
          ticketId: t.ticketId,
          subject: t.subject,
          category: t.category,
          priority: t.priority,
          message: t.message,
          status: t.status,
          createdAt: t.createdAt,
          user: {
            id: u._id,
            name: u.name,
            email: u.email,
            college: u.college,
            phone: u.phone,
          },
        });
      });
    });

    // Sort newest first
    allTickets.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({
      success: true,
      count: allTickets.length,
      tickets: allTickets,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update support ticket status
// @route   PUT /api/admin/tickets/:ticketId/status
// @access  Private (Admin)
const updateTicketStatus = async (req, res, next) => {
  try {
    const { ticketId } = req.params;
    const { status } = req.body;

    const user = await User.findOne({ 'supportTickets.ticketId': ticketId });
    if (!user) {
      return res.status(404).json({ message: 'Ticket not found.' });
    }

    const ticket = user.supportTickets.find((t) => t.ticketId === ticketId);
    if (ticket) {
      ticket.status = status || ticket.status;
      await user.save();
    }

    res.json({
      success: true,
      message: `Ticket ${ticketId} status updated to ${status}.`,
      ticket,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminOverview,
  getAllStudents,
  getAllTickets,
  updateTicketStatus,
};
