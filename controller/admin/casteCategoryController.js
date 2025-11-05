const CasteCategory = require("../../model/admin/casteCategoryModel");

// Create a new caste category
exports.createCasteCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "Caste category name is required." });
    }

    const existing = await CasteCategory.findOne({ name: name.trim() });
    if (existing) {
      return res.status(409).json({ message: "Caste category already exists." });
    }

    const casteCategory = new CasteCategory({ name: name.trim() });
    await casteCategory.save();

    res.status(201).json({ message: "Caste category created successfully.", casteCategory });
  } catch (err) {
    console.error("❌ Error creating caste category:", err);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Get paginated caste categories
exports.getPaginatedCasteCategories = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";

    const query = search
      ? { name: { $regex: new RegExp(search, "i") } }
      : {};

    const total = await CasteCategory.countDocuments(query);
    const casteCategories = await CasteCategory.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      casteCategories,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("❌ Error fetching caste categories:", err);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Get all caste categories (non-paginated)
exports.getAllCasteCategories = async (req, res) => {
  try {
    const search = req.query.search || "";

    const query = search
      ? { name: { $regex: new RegExp(search, "i") } }
      : {};

    const casteCategories = await CasteCategory.find(query).sort({ createdAt: -1 });

    res.status(200).json({ casteCategories });
  } catch (err) {
    console.error("❌ Error fetching caste categories:", err);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Get caste category by ID
exports.getCasteCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const casteCategory = await CasteCategory.findById(id);
    if (!casteCategory) {
      return res.status(404).json({ message: "Caste category not found." });
    }

    res.status(200).json(casteCategory);
  } catch (err) {
    console.error("❌ Error fetching caste category by ID:", err);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Update caste category by ID
exports.updateCasteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "Caste category name is required." });
    }

    const existing = await CasteCategory.findOne({ name: name.trim(), _id: { $ne: id } });
    if (existing) {
      return res.status(409).json({ message: "Another caste category with the same name exists." });
    }

    const updated = await CasteCategory.findByIdAndUpdate(
      id,
      { name: name.trim() },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Caste category not found." });
    }

    res.status(200).json({ message: "Caste category updated successfully.", casteCategory: updated });
  } catch (err) {
    console.error("❌ Error updating caste category:", err);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Delete caste category by ID
exports.deleteCasteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await CasteCategory.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Caste category not found." });
    }

    res.status(200).json({ message: "Caste category deleted successfully." });
  } catch (err) {
    console.error("❌ Error deleting caste category:", err);
    res.status(500).json({ message: "Internal server error." });
  }
};
