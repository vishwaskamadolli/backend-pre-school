// routes/academicYear.routes.js
const express = require("express");
const { createAcademicYear, getAcademicYears, updateAcademicYear, deleteAcademicYear, getAcademicYearsPaginated, getAcademicYearById, } = require("../../controller/admin/academicYearController");
const router = express.Router();


router.post("/create/academic-year", createAcademicYear);
router.get("/get/academic-years", getAcademicYears);
router.get("/paginated/academic-years", getAcademicYearsPaginated); // new

router.put("/update/academic-year/:id", updateAcademicYear);
router.get("/id/academic-year/:id", getAcademicYearById)
router.delete("/:id", deleteAcademicYear);

module.exports = router;
