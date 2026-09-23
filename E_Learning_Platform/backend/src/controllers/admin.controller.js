const User = require('../models/user.model');
const Course = require('../models/course.model');
const Internship = require('../models/internship.model');
const Application = require('../models/application.model');

// @desc    Get complete administrative platform statistics
// @route   GET /api/admin/overview
// @access  Private
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
      .populate('user', 'name email college branch')
      .populate('internship', 'title stipend')
      .sort({ appliedAt: -1 })
      .limit(5);

    const allStudents = await User.find({}).select('-password').sort({ createdAt: -1 }).limit(10);

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

module.exports = {
  getAdminOverview,
};
