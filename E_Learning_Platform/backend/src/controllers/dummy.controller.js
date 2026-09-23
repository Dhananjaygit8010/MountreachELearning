const path = require('path');
const fs = require('fs');
const Course = require('../models/course.model');
const Internship = require('../models/internship.model');

// Helper to safely load dummy data without crashing if file is deleted
const loadDummyDataModule = () => {
  const dummyFilePath = path.join(__dirname, '../config/dummyData.js');
  if (!fs.existsSync(dummyFilePath)) {
    return null;
  }
  try {
    // Clear node require cache to read fresh file contents in realtime
    delete require.cache[require.resolve(dummyFilePath)];
    return require(dummyFilePath);
  } catch (error) {
    console.warn('⚠️  Could not load dummyData.js:', error.message);
    return null;
  }
};

// @desc    Get dummy data status and database counts
// @route   GET /api/dummy/status
// @access  Public
const getDummyStatus = async (req, res, next) => {
  try {
    const dummyModule = loadDummyDataModule();
    const dummyCoursesCount = await Course.countDocuments({ isDummy: true });
    const realCoursesCount = await Course.countDocuments({ isDummy: { $ne: true } });
    const dummyInternshipsCount = await Internship.countDocuments({ isDummy: true });
    const realInternshipsCount = await Internship.countDocuments({ isDummy: { $ne: true } });

    res.json({
      success: true,
      dummyFileExists: !!dummyModule,
      availableInFile: {
        courses: dummyModule ? dummyModule.dummyCourses?.length || 0 : 0,
        internships: dummyModule ? dummyModule.dummyInternships?.length || 0 : 0,
      },
      database: {
        totalCourses: dummyCoursesCount + realCoursesCount,
        realCourses: realCoursesCount,
        dummyCourses: dummyCoursesCount,
        totalInternships: dummyInternshipsCount + realInternshipsCount,
        realInternships: realInternshipsCount,
        dummyInternships: dummyInternshipsCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Inject dummy courses & internships into MongoDB Atlas
// @route   POST /api/dummy/inject
// @access  Public
const injectDummyData = async (req, res, next) => {
  try {
    const dummyModule = loadDummyDataModule();
    if (!dummyModule) {
      return res.status(404).json({
        success: false,
        message: 'dummyData.js file not found on disk. The system is operating in 100% dynamic mode.',
      });
    }

    let injectedCourses = 0;
    let injectedInternships = 0;

    // Inject courses safely (avoiding duplicates by title)
    if (Array.isArray(dummyModule.dummyCourses)) {
      for (const courseData of dummyModule.dummyCourses) {
        const existing = await Course.findOne({ title: courseData.title });
        if (!existing) {
          await Course.create({ ...courseData, isDummy: true });
          injectedCourses++;
        }
      }
    }

    // Inject internships safely (avoiding duplicates by title)
    if (Array.isArray(dummyModule.dummyInternships)) {
      for (const internData of dummyModule.dummyInternships) {
        const existing = await Internship.findOne({ title: internData.title });
        if (!existing) {
          await Internship.create({ ...internData, isDummy: true });
          injectedInternships++;
        }
      }
    }

    res.status(200).json({
      success: true,
      message: `Injected ${injectedCourses} demo courses and ${injectedInternships} demo internships into database.`,
      injectedCourses,
      injectedInternships,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove all dummy data from database, keeping real data intact
// @route   DELETE /api/dummy/clean
// @access  Public
const cleanDummyData = async (req, res, next) => {
  try {
    const coursesDeleted = await Course.deleteMany({ isDummy: true });
    const internshipsDeleted = await Internship.deleteMany({ isDummy: true });

    res.json({
      success: true,
      message: `Cleaned up ${coursesDeleted.deletedCount} demo courses and ${internshipsDeleted.deletedCount} demo internships. Real data is preserved!`,
      deletedCourses: coursesDeleted.deletedCount,
      deletedInternships: internshipsDeleted.deletedCount,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDummyStatus,
  injectDummyData,
  cleanDummyData,
};
