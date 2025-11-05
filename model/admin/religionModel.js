const mongoose = require("mongoose");

const religionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

const Religion = mongoose.models.Religion || mongoose.model("Religion", religionSchema);

module.exports = Religion;
