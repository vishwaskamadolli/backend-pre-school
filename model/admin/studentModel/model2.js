const mongoose = require("mongoose");

const parentInfoSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String },
  phoneNumber: { type: String },
  occupation: { type: String },
  image: { type: String },
});

const guardianInfoSchema = new mongoose.Schema({
  guardianType: { type: String, enum: ["Parents", "Guardian", "Others"], default: "Parents" },
  name: { type: String },
  relation: { type: String },
  email: { type: String },
  phoneNumber: { type: String },
  occupation: { type: String },
  address: { type: String },
  image: { type: String },
});

const parentGuardianSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    father: parentInfoSchema,
    mother: parentInfoSchema,
    guardian: guardianInfoSchema,
  },
  {
    timestamps: true,
  }
);

const ParentGuardian = mongoose.models.ParentGuardian || mongoose.model("ParentGuardian", parentGuardianSchema);

module.exports = ParentGuardian;
