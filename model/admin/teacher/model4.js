const mongoose = require("mongoose");

const bankDetailsSchema = new mongoose.Schema(
  {
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },
    accountHolderName: { type: String },
    accountNumber: { type: String },
    bankName: { type: String },
    ifscCode: { type: String },
    branchName: { type: String },
    upiId: { type: String },
  },
  {
    timestamps: true,
  }
);

const BankDetails =
  mongoose.models.BankDetails || mongoose.model("BankDetails", bankDetailsSchema);

module.exports = BankDetails;
 