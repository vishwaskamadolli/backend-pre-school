const express = require("express");
const { createReligion, getPaginatedReligions, getReligionById, updateReligion, deleteReligion, getAllReligions } = require("../../controller/admin/religionController");
const router = express.Router();

// Create a new religion
router.post("/create/religion", createReligion);

// Get all religions (with pagination and optional search)
router.get("/paginated/religions", getPaginatedReligions);
router.get("/get/religions", getAllReligions);

// Get a religion by ID
router.get("/id/religion/:id", getReligionById);

// Update a religion by ID
router.put("/update/religion/:id", updateReligion);

// Delete a religion by ID
router.delete("/delete/religion/:id", deleteReligion);

module.exports = router;
