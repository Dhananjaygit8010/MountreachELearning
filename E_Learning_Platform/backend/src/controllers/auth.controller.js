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

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      college: user.college,
      branch: user.branch,
      role: user.role,
      enrolledCourses: user.enrolledCourses || [],
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

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      college: user.college,
      branch: user.branch,
      role: user.role,
      enrolledCourses: user.enrolledCourses || [],
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

    user.name = req.body.name || user.name;
    user.college = req.body.college || user.college;
    user.branch = req.body.branch || user.branch;

    if (req.body.password && req.body.password.trim().length >= 6) {
      user.password = req.body.password; // Hook will automatically hash it
    }

    const updatedUser = await user.save();
    const populatedUser = await User.findById(updatedUser._id).populate('enrolledCourses');

    const token = generateToken(populatedUser._id);
    setAuthCookie(res, token);

    res.json({
      _id: populatedUser._id,
      name: populatedUser.name,
      email: populatedUser.email,
      college: populatedUser.college,
      branch: populatedUser.branch,
      role: populatedUser.role,
      enrolledCourses: populatedUser.enrolledCourses || [],
      token,
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
};
