const Section = require("../../model/admin/classes/section/sectioModel");

const generateSectionId = async () => {
  const prefix = "SE";

  const latest = await Section
    .findOne({})
    .sort({ createdAt: -1 }) // only get the latest
    .select("sectionId");

  const lastNum = latest?.sectionId ? parseInt(latest.sectionId.replace(prefix, ""), 10) : 0;
  const nextId = lastNum + 1;

  return `${prefix}${nextId}`;
};
exports.addSection = async (req, res) => {
  try {
    let { name, status } = req.body;

    if (!name || status === undefined) {
      return res.status(400).json({ message: "Name and status are required" });
    }

    if (typeof status === "boolean") {
      status = status ? "active" : "inactive";
    }

    const sectionId = await generateSectionId(); // custom ID like SE1

    const newSection = await Section.create({ sectionId, name, status });

    return res.status(201).json({ message: "Section added", section: newSection });
  } catch (error) {
    console.error("Add Section Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// @desc Get all sections
exports.getAllSections = async (req, res) => {
  try {
    // Get page and limit from query params (with defaults)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    // Fetch total count for frontend pagination
    const total = await Section.countDocuments();

    // Fetch paginated sections
    const sections = await Section.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      sections,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get Sections Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getAllSection = async (req, res) => {
  try {
    const sections = await Section.find().sort({ createdAt: -1 }); // Or sort by name if preferred

    res.status(200).json({
      sections,
    });
  } catch (error) {
    console.error("Get Sections Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



// @desc Get a single section
exports.getSectionById = async (req, res) => {
  try {
    const { id } = req.params;
    const section = await Section.findById(id);
    if (!section) {
      return res.status(404).json({ message: "Section not found" });
    }
    res.status(200).json(section);
  } catch (error) {
    console.error("Get Section Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// @desc Update section
exports.updateSection = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Section.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ message: "Section not found" });
    }
    res.status(200).json({ message: "Section updated", section: updated });
  } catch (error) {
    console.error("Update Section Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// @desc Delete section
exports.deleteSection = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Section.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Section not found" });
    }
    res.status(200).json({ message: "Section deleted" });
  } catch (error) {
    console.error("Delete Section Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
