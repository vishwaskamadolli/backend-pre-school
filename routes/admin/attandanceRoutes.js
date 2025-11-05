const express = require("express");
const router = express.Router();
const { getStudentsByClass, getStudentsByClassAndSection, getStudentsGroupedByClass, saveAttendance, getAttendanceByClassDate } = require("../../controller/admin/attandanceController");

// GET /api/students/class/:classId
router.get("/students/class/:classId", getStudentsByClass);

// GET /api/students/class/:classId/section/:sectionId
router.get("/students/class/:classId/section/:sectionId", getStudentsByClassAndSection);

// GET /api/students/grouped-by-class
router.get("/students/grouped-by-class", getStudentsGroupedByClass);

// POST /api/attendance/save
router.post("/attendance/save", saveAttendance);

// GET /api/attendance/:classId/:section/:date
router.get("/attendance/:classId/:section/:date", getAttendanceByClassDate);

module.exports = router;
