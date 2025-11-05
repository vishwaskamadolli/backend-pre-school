const mongoose = require("mongoose");

const passwordSchema = new mongoose.Schema(
  {
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },
    hashedPassword: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Password =
  mongoose.models.Password || mongoose.model("Password", passwordSchema);

module.exports = Password;
  