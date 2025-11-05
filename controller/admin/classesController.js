const Class = require("../../model/admin/classes/class/classModel"); // adjust the path
const Section = require("../../model/admin/classes/section/sectioModel");

// Helper to generate unique classId like CL001
const generateClassId = async () => {
  const prefix = "CL";
  const latest = await Class.findOne().sort({ createdAt: -1 }).select("classId");
  const lastNum = latest?.classId ? parseInt(latest.classId.replace(prefix, ""), 10) : 0;
  const nextId = lastNum + 1;
  return `${prefix}${String(nextId).padStart(3, "0")}`;
};

// @desc Add class
exports.addClass = async (req, res) => {
  try {
    let { name, section, noOfStudents, status } = req.body;

    console.log("Received data:", { name, section, noOfStudents, status });

    if (!name || !section || !noOfStudents) {
      console.warn("Validation failed: Missing required fields");
      return res.status(400).json({ message: "Name, section, and noOfStudents are required" });
    }

    if (typeof status === "boolean") {
      status = status ? "active" : "inactive";
    }

    // 🔍 Find the actual MongoDB _id of the section using sectionId like "SE1"
    const sectionDoc = await Section.findOne({ sectionId: section });
    if (!sectionDoc) {
      return res.status(400).json({ message: `Section with ID ${section} not found` });
    }

    const classId = await generateClassId();

    const newClassData = {
      classId,
      name,
      section: sectionDoc._id, // ✅ Use actual ObjectId
      noOfStudents,
      status,
    };

    const newClass = await Class.create(newClassData);

    console.log("New class created successfully:", newClass);

    res.status(201).json({ message: "Class added", class: newClass });
  } catch (error) {
    console.error("Add Class Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



// @desc Get all classes (with pagination)
exports.getAllClasses = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await Class.countDocuments();
    const classes = await Class.find()
      .populate("section", "sectionId name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      classes,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get Classes Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// @desc Get all classes (no pagination)
exports.getAllClassesWithoutPagination = async (req, res) => {
  try {
    const classes = await Class.find()
      .populate("section", "sectionId name")
      .sort({ createdAt: -1 });

    res.status(200).json({ classes });
  } catch (error) {
    console.error("Get All Classes Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// @desc Get class by ID
exports.getClassById = async (req, res) => {
  try {
    const { id } = req.params;

    // Use classId (e.g., "CL001") instead of Mongo _id
    const classData = await Class.findOne({ classId: id }).populate("section", "sectionId name");

    if (!classData) {
      return res.status(404).json({ message: "Class not found" });
    }

    res.status(200).json(classData);
  } catch (error) {
    console.error("Get Class Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


// @desc Update class
exports.updateClass = async (req, res) => {
  try {
    const { id } = req.params;
    let { name, section, noOfStudents, status } = req.body;

    const updateData = {};

    if (name) updateData.name = name;
    if (noOfStudents) updateData.noOfStudents = noOfStudents;

    if (typeof status === "boolean") {
      updateData.status = status ? "active" : "inactive";
    } else if (status) {
      updateData.status = status;
    }

    // If section is provided (like "SE1"), resolve to ObjectId
    if (section) {
      const sectionDoc = await Section.findOne({ sectionId: section });
      if (!sectionDoc) {
        return res.status(400).json({ message: `Section with ID ${section} not found` });
      }
      updateData.section = sectionDoc._id;
    }

    const updatedClass = await Class.findOneAndUpdate(
      { classId: id }, // Match by classId
      updateData,      // Only send clean, resolved data
      { new: true }
    );

    if (!updatedClass) {
      return res.status(404).json({ message: "Class not found" });
    }

    res.status(200).json({ message: "Class updated", class: updatedClass });
  } catch (error) {
    console.error("Update Class Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



// @desc Delete class
exports.deleteClass = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Class.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Class not found" });
    }
    res.status(200).json({ message: "Class deleted" });
  } catch (error) {
    console.error("Delete Class Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

