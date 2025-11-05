const mongoose = require("mongoose");

const bloodGroupSchema = new mongoose.Schema(
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

const BloodGroup = mongoose.models.BloodGroup || mongoose.model("BloodGroup", bloodGroupSchema);

module.exports = BloodGroup;
