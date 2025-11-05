// controllers/academicYear.controller.js
const mongoose = require("mongoose");
const AcademicYear = require("../../model/admin/academicYearModel");

// Helper to generate unique yearId like AY001
const generateYearId = async () => {
  const prefix = "AY";
  const latest = await AcademicYear.findOne().sort({ createdAt: -1 }).select("yearId");
  const lastNum = latest?.yearId ? parseInt(latest.yearId.replace(prefix, ""), 10) : 0;
  const nextId = lastNum + 1;
  return `${prefix}${String(nextId).padStart(3, "0")}`;
};


exports.createAcademicYear = async (req, res) => {
  try {
    let { name, startDate, endDate, isActive } = req.body;

    console.log("Received Academic Year Data:", { name, startDate, endDate, isActive });

    if (!name || !startDate || !endDate) {
      console.warn("Validation failed: Missing required fields");
      return res.status(400).json({ message: "Name, startDate, and endDate are required" });
    }

    if (isActive) {
      await AcademicYear.updateMany({}, { isActive: false });
    }

    const yearId = await generateYearId();

    const newYear = await AcademicYear.create({
      yearId,
      name,
      startDate,
      endDate,
      isActive: !!isActive,
    });

    console.log("New academic year created successfully:", newYear);

    res.status(201).json({ message: "Academic year added", academicYear: newYear });
  } catch (error) {
    console.error("Create Academic Year Error:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

exports. getAcademicYears = async (req, res) => {
  try {
    const years = await AcademicYear.find().sort({ createdAt: -1 });
    res.status(200).json(years);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateAcademicYear = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, startDate, endDate, isActive } = req.body;

    console.log("Updating Academic Year:", { id, name, startDate, endDate, isActive });

    if (!name || !startDate || !endDate) {
      console.warn("Validation failed: Missing required fields");
      return res.status(400).json({ message: "Name, startDate, and endDate are required" });
    }

    if (isActive) {
      await AcademicYear.updateMany({}, { isActive: false });
    }

    // Determine if it's an ObjectId or a custom yearId
    let query = mongoose.Types.ObjectId.isValid(id)
      ? { _id: id }
      : { yearId: id };

    const updated = await AcademicYear.findOneAndUpdate(
      query,
      {
        name,
        startDate,
        endDate,
        isActive: !!isActive,
      },
      { new: true }
    );

    if (!updated) {
      console.warn("⚠️ Academic year not found:", id);
      return res.status(404).json({ message: "Academic year not found" });
    }

    console.log("✅ Academic year updated:", updated);
    res.status(200).json({ message: "Academic year updated", academicYear: updated });
  } catch (err) {
    console.error("❌ Update Academic Year Error:", err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
};


exports.deleteAcademicYear = async (req, res) => {
  try {
    const { id } = req.params;
    await AcademicYear.findByIdAndDelete(id);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get single academic year by ID

exports.getAcademicYearById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("📥 Request to fetch academic year using:", id);

    let year;
    if (mongoose.Types.ObjectId.isValid(id)) {
      // Treat it as Mongo _id
      year = await AcademicYear.findById(id);
    } else {
      // Treat it as yearId (like AY001)
      year = await AcademicYear.findOne({ yearId: id });
    }

    console.log("🔍 Found academic year:", year);

    if (!year) {
      return res.status(404).json({ message: "Academic year not found" });
    }

    res.status(200).json(year);
  } catch (err) {
    console.error("❌ Error in getAcademicYearById:", err.message);
    res.status(500).json({ error: err.message });
  }
};



// ✅ Get academic years with pagination
exports.getAcademicYearsPaginated = async (req, res) => {
  try {
    let { page = 1, limit = 10, search = "" } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    const query = search
      ? { name: { $regex: search, $options: "i" } }
      : {};

    const total = await AcademicYear.countDocuments(query);
    const totalPages = Math.ceil(total / limit);
    const years = await AcademicYear.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      academicYears: years,
      pagination: {
        total,
        page,
        limit,
        totalPages,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};