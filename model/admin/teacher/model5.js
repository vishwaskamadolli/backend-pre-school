const mongoose = require("mongoose");

const teacherDocumentsSchema = new mongoose.Schema(
  {
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },
    idProof: {
      type: String, // store file path or URL (e.g. "/uploads/teachers/idProof123.pdf")
      required: false,
    },
    joiningLetter: {
      type: String, // store file path or URL
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const TeacherDocuments =
  mongoose.models.TeacherDocuments ||
  mongoose.model("TeacherDocuments", teacherDocumentsSchema);

module.exports = TeacherDocuments;
