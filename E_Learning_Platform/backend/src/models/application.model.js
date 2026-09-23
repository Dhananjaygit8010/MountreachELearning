const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    internship: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Internship',
      required: [true, 'Internship ID is required'],
    },
    college: {
      type: String,
      required: [true, 'College is required'],
      trim: true,
    },
    branch: {
      type: String,
      required: [true, 'Branch is required'],
      trim: true,
    },
    resumeName: {
      type: String,
      required: [true, 'Resume document name is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['Applied', 'Under Review', 'Accepted', 'Rejected'],
      default: 'Applied',
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate application from same student for same internship
applicationSchema.index({ user: 1, internship: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
