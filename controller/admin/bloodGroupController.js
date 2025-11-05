const BloodGroup = require("../../model/admin/bloodGroupModel");

// Create a new blood group
exports.createBloodGroup = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "Blood group name is required." });
    }

    const existing = await BloodGroup.findOne({ name: name.trim() });
    if (existing) {
      return res.status(409).json({ message: "Blood group already exists." });
    }

    const bloodGroup = new BloodGroup({ name: name.trim() });
    await bloodGroup.save();

    res.status(201).json({ message: "Blood group created successfully.", bloodGroup });
  } catch (err) {
    console.error("❌ Error creating blood group:", err);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Get all blood groups (paginated)
exports.getPaginatedBloodGroups = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";

    const query = search
      ? { name: { $regex: new RegExp(search, "i") } }
      : {};

    const total = await BloodGroup.countDocuments(query);
    const bloodGroups = await BloodGroup.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      bloodGroups,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("❌ Error fetching blood groups:", err);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Get all blood groups (no pagination)
exports.getAllBloodGroups = async (req, res) => {
  try {
    const search = req.query.search || "";

    const query = search
      ? { name: { $regex: new RegExp(search, "i") } }
      : {};

    const bloodGroups = await BloodGroup.find(query).sort({ createdAt: -1 });

    res.status(200).json({ bloodGroups });
  } catch (err) {
    console.error("❌ Error fetching blood groups:", err);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Get blood group by ID
exports.getBloodGroupById = async (req, res) => {
  try {
    const { id } = req.params;

    const bloodGroup = await BloodGroup.findById(id);
    if (!bloodGroup) {
      return res.status(404).json({ message: "Blood group not found." });
    }

    res.status(200).json(bloodGroup);
  } catch (err) {
    console.error("❌ Error fetching blood group by ID:", err);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Update blood group by ID
exports.updateBloodGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "Blood group name is required." });
    }

    const existing = await BloodGroup.findOne({ name: name.trim(), _id: { $ne: id } });
    if (existing) {
      return res.status(409).json({ message: "Another blood group with the same name exists." });
    }

    const updated = await BloodGroup.findByIdAndUpdate(
      id,
      { name: name.trim() },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Blood group not found." });
    }

    res.status(200).json({ message: "Blood group updated successfully.", bloodGroup: updated });
  } catch (err) {
    console.error("❌ Error updating blood group:", err);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Delete blood group by ID
exports.deleteBloodGroup = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await BloodGroup.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Blood group not found." });
    }

    res.status(200).json({ message: "Blood group deleted successfully." });
  } catch (err) {
    console.error("❌ Error deleting blood group:", err);
    res.status(500).json({ message: "Internal server error." });
  }
};
