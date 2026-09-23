const Course = require('../models/course.model');
const User = require('../models/user.model');

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
const getAllCourses = async (req, res, next) => {
  try {
    const { category, search } = req.query;
    let query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    const courses = await Course.find(query);
    res.setHeader('X-Total-Count', courses.length);
    res.json(courses);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single course by ID
// @route   GET /api/courses/:id
// @access  Public
const getCourseById = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found.' });
    }
    res.json(course);
  } catch (error) {
    next(error);
  }
};

// @desc    Enroll in a course
// @route   POST /api/courses/:id/enroll
// @access  Private
const enrollCourse = async (req, res, next) => {
  try {
    const courseId = req.params.id;

    // Verify course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found.' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Check if user is already enrolled
    const isAlreadyEnrolled = user.enrolledCourses.some(
      (cId) => cId.toString() === courseId.toString()
    );

    if (isAlreadyEnrolled) {
      return res.status(400).json({ message: 'You are already enrolled in this course.' });
    }

    // Enroll user
    user.enrolledCourses.push(courseId);
    await user.save();

    const populatedUser = await User.findById(req.user._id).populate('enrolledCourses');

    res.status(200).json({
      message: 'Successfully enrolled in course.',
      enrolledCourses: populatedUser.enrolledCourses,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new course (Admin/Instructor)
// @route   POST /api/courses
// @access  Private (Admin/Instructor)
const createCourse = async (req, res, next) => {
  try {
    const newCourse = await Course.create({
      ...req.body,
      instructor: req.body.instructor || req.user.name,
    });

    res.status(201).json({
      message: 'Course created successfully.',
      course: newCourse,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update an existing course (Admin/Instructor)
// @route   PUT /api/courses/:id
// @access  Private (Admin/Instructor)
const updateCourse = async (req, res, next) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!course) {
      return res.status(404).json({ message: 'Course not found.' });
    }

    res.json({
      message: 'Course updated successfully.',
      course,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a course (Admin/Instructor)
// @route   DELETE /api/courses/:id
// @access  Private (Admin/Instructor)
const deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found.' });
    }

    res.json({ message: 'Course deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllCourses,
  getCourseById,
  enrollCourse,
  createCourse,
  updateCourse,
  deleteCourse,
};
