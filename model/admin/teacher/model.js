const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema(
  {
    profileImage: { type: String }, // File path for uploaded image

    teacherId: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class", // You must have a BloodGroup model
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject", // You must have a BloodGroup model
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Others"],
    },

    primaryContactNumber: { type: String },
    emailAddress: { type: String },

    bloodGroup: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BloodGroup", // You must have a BloodGroup model
    },

    dateOfJoining: { type: Date },
    fatherName: { type: String },
    motherName: { type: String },
    dateOfBirth: { type: Date },
    maritalStatus: {
      type: String,
      enum: ["Single", "Married", "Divorced", "Widowed"],
    },

    qualification: { type: String },
    workExperience: { type: String },

    previousSchool: { type: String },
    previousSchoolAddress: { type: String },
    previousSchoolPhone: { type: String },

    address: { type: String },
    permanentAddress: { type: String },
    panNumber: { type: String },

    languagesKnown: [{ type: String }], // Array of strings

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

const Teacher =
  mongoose.models.Teacher || mongoose.model("Teacher", teacherSchema);

module.exports = Teacher;
