const mongoose = require("mongoose");

const payrollSchema = new mongoose.Schema(
  {
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },
    epfNo: { type: String },
    basicSalary: { type: String },
    contractType: {
      type: String,
      enum: ["permanent", "temporary", "contract"],
    },
    workShift: {
      type: String,
      enum: ["morning", "evening", "night"],
    },
    workLocation: { type: String },
    dateOfLeaving: { type: Date },
  },
  {
    timestamps: true,
  }
);

const Payroll =
  mongoose.models.Payroll || mongoose.model("Payroll", payrollSchema);

module.exports = Payroll;
