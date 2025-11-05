const express = require("express");
const { createBloodGroup, getPaginatedBloodGroups, getAllBloodGroups, getBloodGroupById, updateBloodGroup, deleteBloodGroup } = require("../../controller/admin/bloodGroupController");


const router = express.Router();

// Create a new blood group
router.post("/create/blood-group", createBloodGroup);

// Get all blood groups (with pagination and optional search)
router.get("/paginated/blood-groups", getPaginatedBloodGroups);
router.get("/get/blood-groups", getAllBloodGroups);

// Get a blood group by ID
router.get("/id/blood-group/:id", getBloodGroupById);

// Update a blood group by ID
router.put("/update/blood-group/:id", updateBloodGroup);

// Delete a blood group by ID
router.delete("/delete/blood-group/:id", deleteBloodGroup);

module.exports = router;
