const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
    },
    college: {
      type: String,
      required: [true, 'College name is required'],
      trim: true,
    },
    branch: {
      type: String,
      required: [true, 'Branch or domain is required'],
      trim: true,
    },
    role: {
      type: String,
      enum: ['student', 'instructor', 'admin'],
      default: 'student',
    },
    phone: {
      type: String,
      default: '',
      trim: true,
    },
    avatar: {
      type: String,
      default: '',
    },
    bio: {
      type: String,
      default: '',
    },
    semester: {
      type: String,
      default: 'Semester 6',
    },
    graduationYear: {
      type: String,
      default: '2026',
    },
    rollNumber: {
      type: String,
      default: '',
    },
    githubUrl: {
      type: String,
      default: '',
    },
    linkedinUrl: {
      type: String,
      default: '',
    },
    enrolledCourses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
      },
    ],
    attendance: [
      {
        date: { type: String },
        timestamp: { type: Date, default: Date.now },
        status: { type: String, default: 'Present' },
        sessionName: { type: String, default: 'Industrial Tech Session' },
        mode: { type: String, default: 'Online' },
      },
    ],
    learningProgress: [
      {
        courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
        completedLessons: [{ type: String }],
        progressPercent: { type: Number, default: 0 },
        lastAccessed: { type: Date, default: Date.now },
      },
    ],
    payments: [
      {
        transactionId: { type: String },
        courseTitle: { type: String },
        courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
        amount: { type: Number },
        date: { type: Date, default: Date.now },
        status: { type: String, default: 'Captured' },
        invoiceNumber: { type: String },
        paymentMethod: { type: String, default: 'UPI / Online Card' },
      },
    ],
    supportTickets: [
      {
        ticketId: { type: String },
        subject: { type: String },
        category: { type: String },
        priority: { type: String, default: 'Medium' },
        status: { type: String, default: 'Open' },
        description: { type: String },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Pre-save hook: automatically hash password if created or modified
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare plaintext candidate password with hashed password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
