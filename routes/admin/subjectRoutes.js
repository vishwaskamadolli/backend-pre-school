const express = require("express");
const { createSubject, getPaginatedSubjects, getAllSubjects, getSubjectById, updateSubject, deleteSubject } = require("../../controller/admin/subjectController");


const router = express.Router();

// Create a new subject
router.post("/create/subject", createSubject);

// Get all subjects (with pagination and optional search)
router.get("/paginated/subjects", getPaginatedSubjects);
router.get("/get/subjects", getAllSubjects);

// Get a subject by ID
router.get("/id/subject/:id", getSubjectById);

// Update a subject by ID
router.put("/update/subject/:id", updateSubject);

// Delete a subject by ID
router.delete("/delete/subject/:id", deleteSubject);

module.exports = router;
