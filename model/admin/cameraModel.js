const mongoose = require('mongoose');

const cameraSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    streamUrl: {
      type: String,
      required: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // or 'Student' based on your design
      default: null,
    },
    status: {
      type: String,
      enum: ['Online', 'Offline', 'Inactive', 'Error'],
      default: 'Offline', // default value if not specified
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Camera', cameraSchema);
