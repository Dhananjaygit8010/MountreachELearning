const User = require('../models/user.model');
const { generateToken } = require('../utils/jwt.util');

// Helper to set httpOnly cookie
const setAuthCookie = (res, token) => {
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
  try {
    const { name, email, password, college, branch } = req.body;

    // Disallow registration using dedicated admin email
    if (email && email.toLowerCase().trim() === 'admin@gmail.com') {
      return res.status(400).json({
        message: 'The Administrator account is reserved and pre-configured. Please log in directly with your admin credentials.',
      });
    }

    // Check if email already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email address.' });
    }

    // Create user strictly with role: 'student'
    const user = await User.create({
      name,
      email,
      password,
      college,
      branch,
      role: 'student', // All self-registered users are students
    });

    const token = generateToken(user._id);
    setAuthCookie(res, token);

    const userObj = user.toObject();
    delete userObj.password;

    res.status(201).json({
      ...userObj,
      token,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email }).populate('enrolledCourses');
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Verify password match using model method
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = generateToken(user._id);
    setAuthCookie(res, token);

    const userObj = user.toObject();
    delete userObj.password;

    res.json({
      ...userObj,
      token,
    });
  } catch (error) {
    if (
      error.name === 'MongooseServerSelectionError' ||
      error.message?.includes('alert internal error') ||
      error.message?.includes('SSL alert number 80')
    ) {
      return res.status(503).json({
        message: 'Database connection failed. Please ensure your IP address is whitelisted in MongoDB Atlas Network Access.',
      });
    }
    next(error);
  }
};

// @desc    Logout user & clear cookie
// @route   POST /api/auth/logout
// @access  Public
const logout = async (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });
  res.json({ message: 'Logged out successfully.' });
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('enrolledCourses').select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/update
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Standard profile fields
    if (req.body.name !== undefined) user.name = req.body.name;
    if (req.body.college !== undefined) user.college = req.body.college;
    if (req.body.branch !== undefined) user.branch = req.body.branch;
    if (req.body.phone !== undefined) user.phone = req.body.phone;
    if (req.body.avatar !== undefined) user.avatar = req.body.avatar;
    if (req.body.bio !== undefined) user.bio = req.body.bio;
    if (req.body.semester !== undefined) user.semester = req.body.semester;
    if (req.body.graduationYear !== undefined) user.graduationYear = req.body.graduationYear;
    if (req.body.rollNumber !== undefined) user.rollNumber = req.body.rollNumber;
    if (req.body.githubUrl !== undefined) user.githubUrl = req.body.githubUrl;
    if (req.body.linkedinUrl !== undefined) user.linkedinUrl = req.body.linkedinUrl;

    if (req.body.password && req.body.password.trim().length >= 6) {
      user.password = req.body.password; // Hook will automatically hash it
    }

    const updatedUser = await user.save();
    const populatedUser = await User.findById(updatedUser._id).populate('enrolledCourses').select('-password');

    const token = generateToken(populatedUser._id);
    setAuthCookie(res, token);

    res.json({
      ...populatedUser.toObject(),
      token,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Punch attendance for today
// @route   POST /api/auth/attendance/punch
// @access  Private
const punchAttendance = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    const todayStr = new Date().toISOString().split('T')[0];
    if (!user.attendance) user.attendance = [];

    const alreadyPunched = user.attendance.some((a) => a.date === todayStr);
    if (alreadyPunched) {
      return res.status(400).json({
        message: 'Attendance already checked in for today!',
        attendance: user.attendance,
      });
    }

    const sessionName = req.body.sessionName || 'Industrial Systems & Architecture Lab';
    const mode = req.body.mode || 'Online';

    user.attendance.unshift({
      date: todayStr,
      timestamp: new Date(),
      status: 'Present',
      sessionName,
      mode,
    });

    await user.save();

    res.status(200).json({
      message: 'Attendance successfully checked in for today! 100% daily credit granted.',
      attendance: user.attendance,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create support ticket
// @route   POST /api/auth/support/ticket
// @access  Private
const createSupportTicket = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    const { subject, category, priority, description } = req.body;
    if (!subject || !description) {
      return res.status(400).json({ message: 'Subject and description are required.' });
    }

    if (!user.supportTickets) user.supportTickets = [];

    const newTicket = {
      ticketId: `MR-TKT-${Date.now().toString().slice(-6)}`,
      subject,
      category: category || 'General Academic',
      priority: priority || 'Medium',
      status: 'Open',
      description,
      createdAt: new Date(),
    };

    user.supportTickets.unshift(newTicket);
    await user.save();

    res.status(201).json({
      message: 'Support ticket submitted. Support staff will respond shortly.',
      supportTickets: user.supportTickets,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  logout,
  getMe,
  updateProfile,
  punchAttendance,
  createSupportTicket,
};
