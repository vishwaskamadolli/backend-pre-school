const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    profileImage: { type: String },
    academicYear: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AcademicYear",
      required: true,
    },
    admissionNumber: { type: String, required: true, unique: true },
    admissionDate: { type: Date, required: true },
    rollNumber: { type: String, required: true },
    status: { type: String, enum: ["active", "inactive"], default: "active" },

    firstName: { type: String, required: true },
    lastName: { type: String },
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class", // This must exactly match your Class model name
    },

    section: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Section", // This must match your Section model name
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "others"],
      required: true,
    },
    dateOfBirth: { type: Date, required: true },

    bloodGroup: { type: mongoose.Schema.Types.ObjectId, ref: "BloodGroup" },
    house: { type: String },
    religion: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Religion",
    },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "CasteCategory" },
    caste: { type: String },
    motherTongue: { type: String },

    primaryContactNumber: { type: String, required: true },
    emailAddress: { type: String },

    languagesKnown: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.models.Student || mongoose.model("Student", studentSchema);
