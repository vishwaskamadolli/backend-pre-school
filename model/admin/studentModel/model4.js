const mongoose = require("mongoose");

const previousSchoolDetailsSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    schoolName: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    // lastClassPassed: {
    //   type: String,
    // },
  },
  {
    timestamps: true,
  }
);

const PreviousSchoolDetails = mongoose.models.PreviousSchoolDetails || mongoose.model("PreviousSchoolDetails", previousSchoolDetailsSchema);

module.exports = PreviousSchoolDetails;
