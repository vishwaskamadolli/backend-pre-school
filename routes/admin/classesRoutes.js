const express = require("express");
const { addClass, getAllClasses, getAllClassesWithoutPagination, getClassById, updateClass, deleteClass, getSectionsByClass } = require("../../controller/admin/classesController");
const router = express.Router();


router.post("/create/class", addClass);
router.get("/get/class", getAllClasses); // paginated
router.get("/get2/class", getAllClassesWithoutPagination); // no pagination
router.get("/id/class/:id", getClassById);
router.put("/update/class/:id", updateClass);
router.delete("/delete/class/:id", deleteClass);


module.exports = router;
