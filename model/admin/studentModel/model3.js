const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    currentAddress: {
      type: String,
      required: true,
    },
    permanentAddress: {
      type: String,
      required: true,
    },
    country: {
      name: { type: String },
      isoCode: { type: String },
    },
    state: {
      name: { type: String },
      isoCode: { type: String },
    },
    city: {
      name: { type: String },
    },
    pincode: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Address = mongoose.models.Address || mongoose.model("Address", addressSchema);

module.exports = Address;
