const mongoose = require("mongoose");

const sectionSchema = new mongoose.Schema(
  {
    sectionId: {
      type: String, // your custom ID like "SE1"
      unique: true,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

const Section = mongoose.models.Section || mongoose.model("Section", sectionSchema);
module.exports = Section;
