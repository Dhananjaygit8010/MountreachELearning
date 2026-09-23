const mongoose = require('mongoose');

const internshipSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Internship title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Internship description is required'],
    },
    duration: {
      type: String,
      required: [true, 'Internship duration is required'],
    },
    company: {
      type: String,
      default: 'Mountreach Solution Private Limited',
    },
    isoCertified: {
      type: Boolean,
      default: true,
    },
    stipend: {
      type: String,
      required: [true, 'Stipend details are required'],
    },
    skillsRequired: [
      {
        type: String,
      },
    ],
    projects: [
      {
        type: String,
      },
    ],
    isDummy: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Internship', internshipSchema);
