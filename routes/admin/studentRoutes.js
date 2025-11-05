const express = require("express");
const router = express.Router();

const {
  createFullStudentProfile,
  getFullStudentProfile,
  updateFullStudentProfile,
  deleteStudentProfile,
  getAllStudentProfiles,
} = require("../../controller/admin/studentController");
const upload = require("../../middleware/admin/upload");


// For create — accept multiple images
router.post(
  "/create/students",
  upload.fields([
    { name: "studentImage", maxCount: 1 },
    { name: "fatherImage", maxCount: 1 },
    { name: "motherImage", maxCount: 1 },
    { name: "guardianImage", maxCount: 1 },
  ]),
  createFullStudentProfile
);

// Get all student profiles
router.get("/get/students/profile", getAllStudentProfiles);

// Read full student profile by ID
router.get("/id/students/:id", getFullStudentProfile);

// For update — accept multiple images
router.put(
  "/update/students/:id",
  upload.fields([
    { name: "studentImage", maxCount: 1 },
    { name: "fatherImage", maxCount: 1 },
    { name: "motherImage", maxCount: 1 },
    { name: "guardianImage", maxCount: 1 },
  ]),
  updateFullStudentProfile
);

// Delete student profile
router.delete("/students/:id", deleteStudentProfile);

module.exports = router;
