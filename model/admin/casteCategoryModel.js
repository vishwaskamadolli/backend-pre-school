const mongoose = require("mongoose");

const casteCategorySchema = new mongoose.Schema(
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

const CasteCategory = mongoose.models.CasteCategory || mongoose.model("CasteCategory", casteCategorySchema);

module.exports = CasteCategory;
