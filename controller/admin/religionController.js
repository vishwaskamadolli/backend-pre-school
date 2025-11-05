const Religion = require("../../model/admin/religionModel");

// Create a new religion
exports.createReligion = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "Religion name is required." });
    }

    const existing = await Religion.findOne({ name: name.trim() });
    if (existing) {
      return res.status(409).json({ message: "Religion already exists." });
    }

    const religion = new Religion({ name: name.trim() });
    await religion.save();

    res.status(201).json({ message: "Religion created successfully.", religion });
  } catch (err) {
    console.error("❌ Error creating religion:", err);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Get all religions (paginated)
exports.getPaginatedReligions = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";

    const query = search
      ? { name: { $regex: new RegExp(search, "i") } }
      : {};

    const total = await Religion.countDocuments(query);
    const religions = await Religion.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      religions,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("❌ Error fetching religions:", err);
    res.status(500).json({ message: "Internal server error." });
  }
};

exports.getAllReligions = async (req, res) => {
  try {
    const search = req.query.search || "";

    const query = search
      ? { name: { $regex: new RegExp(search, "i") } }
      : {};

    const religions = await Religion.find(query).sort({ createdAt: -1 });

    res.status(200).json({ religions });
  } catch (err) {
    console.error("❌ Error fetching religions:", err);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Get religion by ID
exports.getReligionById = async (req, res) => {
  try {
    const { id } = req.params;

    const religion = await Religion.findById(id);
    if (!religion) {
      return res.status(404).json({ message: "Religion not found." });
    }

    res.status(200).json(religion);
  } catch (err) {
    console.error("❌ Error fetching religion by ID:", err);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Update religion by ID
exports.updateReligion = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "Religion name is required." });
    }

    const existing = await Religion.findOne({ name: name.trim(), _id: { $ne: id } });
    if (existing) {
      return res.status(409).json({ message: "Another religion with the same name exists." });
    }

    const updated = await Religion.findByIdAndUpdate(
      id,
      { name: name.trim() },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Religion not found." });
    }

    res.status(200).json({ message: "Religion updated successfully.", religion: updated });
  } catch (err) {
    console.error("❌ Error updating religion:", err);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Delete religion by ID
exports.deleteReligion = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Religion.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Religion not found." });
    }

    res.status(200).json({ message: "Religion deleted successfully." });
  } catch (err) {
    console.error("❌ Error deleting religion:", err);
    res.status(500).json({ message: "Internal server error." });
  }
};
