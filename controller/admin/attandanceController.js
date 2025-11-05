const Student = require("../../model/admin/studentModel/model");
const Attendance = require("../../model/admin/attendanceModel");
const mongoose = require("mongoose");

// 🔹 Get all students by class
exports.getStudentsByClass = async (req, res) => {
  try {
    const { classId } = req.params;

    // Fetch all students without pagination
    const students = await Student.find({ class: classId })
      .sort({ rollNumber: 1 })
      .select("firstName lastName admissionNumber rollNumber gender profileImage")
      .populate("section", "name");

    res.status(200).json({ students });
  } catch (error) {
    console.error("Error in getStudentsByClass:", error);
    res.status(500).json({ message: "Error fetching students by class" });
  }
};



// 🔹 Get students grouped by class
exports.getStudentsGroupedByClass = async (req, res) => {
  try {
    const grouped = await Student.aggregate([
      {
        $group: {
          _id: "$class",
          students: {
            $push: {
              _id: "$_id",
              name: { $concat: ["$firstName", " ", "$lastName"] },
              rollNumber: "$rollNumber",
              admissionNumber: "$admissionNumber",
              gender: "$gender",
              profileImage: "$profileImage",
            },
          },
        },
      },
    ]);

    res.status(200).json(grouped);
  } catch (error) {
    console.error("Error in getStudentsGroupedByClass:", error);
    res.status(500).json({ message: "Error grouping students by class" });
  }
};

// 🔹 Optional: Get students by class and section
exports.getStudentsByClassAndSection = async (req, res) => {
  try {
    const { classId, sectionId } = req.params;

    const students = await Student.find({ class: classId, section: sectionId })
      .sort({ rollNumber: 1 })
      .select("firstName lastName admissionNumber rollNumber gender profileImage");

    res.status(200).json(students);
  } catch (error) {
    console.error("Error in getStudentsByClassAndSection:", error);
    res.status(500).json({ message: "Error fetching students by class and section" });
  }
};

exports.saveAttendance = async (req, res) => {
  try {
    const { classId, section, date, records } = req.body;

    if (!classId || !section || !date || !records || !records.length) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    if (!mongoose.Types.ObjectId.isValid(section)) {
      return res.status(400).json({ message: "Invalid section ID." });
    }

    const sectionObjId = new mongoose.Types.ObjectId(section);

    const existing = await Attendance.findOne({
      classId,
      section: sectionObjId,
      date,
    });

    if (existing) {
      existing.records = records;
      await existing.save();
      return res.status(200).json({ message: "Attendance updated.", attendance: existing });
    }

    const attendance = await Attendance.create({
      classId,
      section: sectionObjId,
      date,
      records,
    });

    res.status(201).json({ message: "Attendance saved.", attendance });
  } catch (error) {
    console.error("Error saving attendance:", error);
    res.status(500).json({ message: "Server error", error });
  }
};


exports.getAttendanceByClassDate = async (req, res) => {
  try {
    const { classId, section, date } = req.params;

    const attendance = await Attendance.findOne({ classId, section, date }).populate("records.studentId");

    if (!attendance) {
      return res.status(404).json({ message: "Attendance not found." });
    }

    res.status(200).json(attendance);
  } catch (error) {
    console.error("Error fetching attendance:", error);
    res.status(500).json({ message: "Server error", error });
  }
};