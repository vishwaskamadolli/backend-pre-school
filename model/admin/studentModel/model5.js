const mongoose = require("mongoose");

const documentsSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    birthCertificate: {
      type: String, // path or filename (e.g., /uploads/birth-cert.pdf)
      required: false,
    },
    transferCertificate: {
      type: String, // path or filename
      required: false,
    },
    medicalCondition: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Documents = mongoose.models.Documents || mongoose.model("Documents", documentsSchema);

module.exports = Documents;
