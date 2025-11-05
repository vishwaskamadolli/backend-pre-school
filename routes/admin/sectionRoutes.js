const express = require("express");
const { addSection, getSectionById, getAllSections, updateSection, deleteSection, getAllSection } = require("../../controller/admin/sectionController");
const router = express.Router();



// POST /api/admin/sections
router.post("/create/section", addSection);

// GET /api/admin/sections
router.get("/get/section", getAllSections);
router.get("/get2/section", getAllSection);

// GET /api/admin/sections/:id
router.get("/id/section/:id", getSectionById);

// PUT /api/admin/sections/:id
router.put("/update/section/:id", updateSection);

// DELETE /api/admin/sections/:id
router.delete("/:id", deleteSection);

module.exports = router;
