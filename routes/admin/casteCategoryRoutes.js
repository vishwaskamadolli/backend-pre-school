const express = require("express");
const { createCasteCategory, getPaginatedCasteCategories, getAllCasteCategories, getCasteCategoryById, updateCasteCategory, deleteCasteCategory } = require("../../controller/admin/casteCategoryController");


const router = express.Router();

// Create a new caste category
router.post("/create/caste-category", createCasteCategory);

// Get all caste categories (with pagination and optional search)
router.get("/paginated/caste-categories", getPaginatedCasteCategories);
router.get("/get/caste-categories", getAllCasteCategories);

// Get a caste category by ID
router.get("/id/caste-category/:id", getCasteCategoryById);

// Update a caste category by ID
router.put("/update/caste-category/:id", updateCasteCategory);

// Delete a caste category by ID
router.delete("/delete/caste-category/:id", deleteCasteCategory);

module.exports = router;
