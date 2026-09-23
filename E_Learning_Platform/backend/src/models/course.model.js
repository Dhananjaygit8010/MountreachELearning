const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Course title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Course description is required'],
    },
    category: {
      type: String,
      required: [true, 'Course category is required'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Course tuition fee is required'],
      min: [0, 'Price cannot be negative'],
    },
    duration: {
      type: String,
      required: [true, 'Course duration is required'],
    },
    syllabus: [
      {
        type: String,
      },
    ],
    projects: [
      {
        type: String,
      },
    ],
    certificationDetails: {
      type: String,
      required: [true, 'Certification details are required'],
    },
    image: {
      type: String,
      default: 'default',
    },
    instructor: {
      type: String,
      default: 'Mountreach Faculty Architect',
    },
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'All Levels'],
      default: 'All Levels',
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    isDummy: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Course', courseSchema);
