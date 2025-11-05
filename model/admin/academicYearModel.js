// models/academicYear.model.js
const mongoose = require("mongoose");

const academicYearSchema = new mongoose.Schema(
  {
    yearId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      unique: true, // e.g. "2024-25"
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const AcademicYear =
  mongoose.models.AcademicYear || mongoose.model("AcademicYear", academicYearSchema);

module.exports = AcademicYear;
