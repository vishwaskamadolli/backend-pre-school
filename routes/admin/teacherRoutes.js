const express = require("express");
const router = express.Router();
const upload = require("../../middleware/admin/upload");
const { createFullTeacherProfile, getAllTeacherProfiles, getFullTeacherProfile, updateFullTeacherProfile } = require("../../controller/admin/teacherController");



// Shared file uploads
const fileFields = upload.fields([
  { name: "profileImage", maxCount: 1 },
  { name: "idProof", maxCount: 1 },
  { name: "joiningLetter", maxCount: 1 },
]);

// ✅ Create teacher
router.post("/create/teachers", fileFields, createFullTeacherProfile);

// ✅ Get all teachers
router.get("/get/teachers", getAllTeacherProfiles);

// ✅ Get teacher by ID
router.get("/id/teachers/:id", getFullTeacherProfile);

// ✅ Update teacher by ID
router.put("/update/teachers/:id", fileFields,  updateFullTeacherProfile);

module.exports = router;
