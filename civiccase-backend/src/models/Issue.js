<<<<<<< HEAD
const mongoose = require("mongoose");
=======
const mongoose = require('mongoose');
>>>>>>> 73e57ebb4e2b758352596fdc622371743863be7c

const issueSchema = new mongoose.Schema(
  {
    title: {
      type: String,
<<<<<<< HEAD
      required: [true, "Title is required"],
=======
      required: [true, 'Title is required'],
>>>>>>> 73e57ebb4e2b758352596fdc622371743863be7c
      trim: true,
    },
    description: {
      type: String,
<<<<<<< HEAD
      required: [true, "Description is required"],
    },
    category: {
      type: String,
      enum: ["POTHOLE", "STREETLIGHT", "FLOODING", "SAFETY", "OTHER"],
      default: "OTHER",
    },
    status: {
      type: String,
      enum: ["OPEN", "IN_PROGRESS", "RESOLVED", "REJECTED"],
      default: "OPEN",
    },
    priority: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH", "URGENT"],
      default: "MEDIUM",
=======
      required: [true, 'Description is required'],
    },
    category: {
      type: String,
      enum: ['POTHOLE', 'STREETLIGHT', 'FLOODING', 'SAFETY', 'OTHER'],
      default: 'OTHER',
    },
    status: {
      type: String,
      enum: ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'REJECTED'],
      default: 'OPEN',
    },
    priority: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'],
      default: 'MEDIUM',
>>>>>>> 73e57ebb4e2b758352596fdc622371743863be7c
    },
    imageUrl: {
      type: String,
    },
    location: {
      type: {
        type: String,
<<<<<<< HEAD
        enum: ["Point"],
        default: "Point",
=======
        enum: ['Point'],
        default: 'Point',
>>>>>>> 73e57ebb4e2b758352596fdc622371743863be7c
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
      address: {
        type: String,
      },
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
<<<<<<< HEAD
      ref: "User",
=======
      ref: 'User',
>>>>>>> 73e57ebb4e2b758352596fdc622371743863be7c
      required: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
<<<<<<< HEAD
      ref: "User",
=======
      ref: 'User',
>>>>>>> 73e57ebb4e2b758352596fdc622371743863be7c
      default: null,
    },
    aiCategory: {
      type: String,
    },
    aiSummary: {
      type: String,
    },
  },
<<<<<<< HEAD
  { timestamps: true },
);

// 2dsphere index for geospatial queries
issueSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Issue", issueSchema);
=======
  { timestamps: true }
);

// 2dsphere index for geospatial queries
issueSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Issue', issueSchema);
>>>>>>> 73e57ebb4e2b758352596fdc622371743863be7c
