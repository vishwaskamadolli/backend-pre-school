const Subject = require("../../model/admin/subjectModel");

// Create a new subject
exports.createSubject = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "Subject name is required." });
    }

    const existing = await Subject.findOne({ name: name.trim() });
    if (existing) {
      return res.status(409).json({ message: "Subject already exists." });
    }

    const subject = new Subject({ name: name.trim() });
    await subject.save();

    res.status(201).json({ message: "Subject created successfully.", subject });
  } catch (err) {
    console.error("❌ Error creating subject:", err);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Get all subjects (paginated)
exports.getPaginatedSubjects = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";

    const query = search
      ? { name: { $regex: new RegExp(search, "i") } }
      : {};

    const total = await Subject.countDocuments(query);
    const subjects = await Subject.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      subjects,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("❌ Error fetching subjects:", err);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Get all subjects (no pagination)
exports.getAllSubjects = async (req, res) => {
  try {
    const search = req.query.search || "";

    const query = search
      ? { name: { $regex: new RegExp(search, "i") } }
      : {};

    const subjects = await Subject.find(query).sort({ createdAt: -1 });

    res.status(200).json({ subjects });
  } catch (err) {
    console.error("❌ Error fetching subjects:", err);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Get subject by ID
exports.getSubjectById = async (req, res) => {
  try {
    const { id } = req.params;

    const subject = await Subject.findById(id);
    if (!subject) {
      return res.status(404).json({ message: "Subject not found." });
    }

    res.status(200).json(subject);
  } catch (err) {
    console.error("❌ Error fetching subject by ID:", err);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Update subject by ID
exports.updateSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "Subject name is required." });
    }

    const existing = await Subject.findOne({ name: name.trim(), _id: { $ne: id } });
    if (existing) {
      return res.status(409).json({ message: "Another subject with the same name exists." });
    }

    const updated = await Subject.findByIdAndUpdate(
      id,
      { name: name.trim() },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Subject not found." });
    }

    res.status(200).json({ message: "Subject updated successfully.", subject: updated });
  } catch (err) {
    console.error("❌ Error updating subject:", err);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Delete subject by ID
exports.deleteSubject = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Subject.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Subject not found." });
    }

    res.status(200).json({ message: "Subject deleted successfully." });
  } catch (err) {
    console.error("❌ Error deleting subject:", err);
    res.status(500).json({ message: "Internal server error." });
  }
};
