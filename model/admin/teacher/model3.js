const mongoose = require("mongoose");

const leaveSchema = new mongoose.Schema(
  {
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },
    totalLeaves: { type: String },
    remainingLeaves: { type: String },
    medicalLeaves: { type: String },
    casualLeaves: { type: String },
    maternityLeaves: { type: String },
    sickLeaves: { type: String },
    lastLeaveDate: { type: Date },
  },
  {
    timestamps: true,
  }
);

const Leave = mongoose.models.Leave || mongoose.model("Leave", leaveSchema);
module.exports = Leave;
