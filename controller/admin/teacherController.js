const Teacher = require("../../model/admin/teacher/model");
const Payroll = require("../../model/admin/teacher/model2");
const Leave = require("../../model/admin/teacher/model3");
const BankDetails = require("../../model/admin/teacher/model4");
const TeacherDocuments = require("../../model/admin/teacher/model5");
const Password = require("../../model/admin/teacher/model6");
const bcrypt = require("bcrypt");

// ✅ CREATE Teacher profile (and linked models)
const createFullTeacherProfile = async (req, res) => {
  try {
    const profileImageFile = req.files?.profileImage;
    const idProofFile = req.files?.idProof;
    const joiningLetterFile = req.files?.joiningLetter;

    const teacher = req.body.teacher ? JSON.parse(req.body.teacher) : {};
    const payroll = req.body.payroll ? JSON.parse(req.body.payroll) : {};
    const leave = req.body.leave ? JSON.parse(req.body.leave) : {};
    const bankDetails = req.body.bankDetails
      ? JSON.parse(req.body.bankDetails)
      : {};
    const password = req.body.password ? JSON.parse(req.body.password) : {};

    // ✅ Attach profile image with URL path
    if (profileImageFile && profileImageFile.length > 0) {
      teacher.profileImage = `/upload/${profileImageFile[0].filename}`;
    }

    const newTeacher = await Teacher.create(teacher);

    // ✅ Related models
    await Promise.all([
      Payroll.create({ teacher: newTeacher._id, ...payroll }),
      Leave.create({ teacher: newTeacher._id, ...leave }),
      BankDetails.create({ teacher: newTeacher._id, ...bankDetails }),
      TeacherDocuments.create({
        teacher: newTeacher._id,
        idProof: idProofFile?.[0]?.filename
          ? `/upload/${idProofFile[0].filename}`
          : "",
        joiningLetter: joiningLetterFile?.[0]?.filename
          ? `/upload/${joiningLetterFile[0].filename}`
          : "",
      }),
      password?.password && password.password.length > 0
        ? Password.create({
            teacher: newTeacher._id,
            hashedPassword: await bcrypt.hash(password.password, 10),
          })
        : null,
    ]);

    res
      .status(201)
      .json({ message: "Teacher profile created", teacherId: newTeacher._id });
  } catch (err) {
    console.error("❌ Error creating teacher profile:", err);
    res.status(500).json({ error: "Failed to create teacher profile" });
  }
};

// ✅ GET ALL Teachers with full profile
const getAllTeacherProfiles = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalTeachers = await Teacher.countDocuments();

    const teachers = await Teacher.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate({
        path: "class",
        select: "name section",
        populate: {
          path: "section",
          select: "name", // or any other fields you want
        },
      }) // populate only the name of class
      .populate("subject", "name"); // populate only the name of subject

    const profiles = await Promise.all(
      teachers.map(async (teacher) => {
        const [payroll, leave, bankDetails, documents] = await Promise.all([
          Payroll.findOne({ teacher: teacher._id }),
          Leave.findOne({ teacher: teacher._id }),
          BankDetails.findOne({ teacher: teacher._id }),
          TeacherDocuments.findOne({ teacher: teacher._id }),
        ]);

        return {
          teacher,
          payroll,
          leave,
          bankDetails,
          documents,
        };
      })
    );

    res.status(200).json({
      currentPage: page,
      totalPages: Math.ceil(totalTeachers / limit),
      totalTeachers,
      profiles,
    });
  } catch (err) {
    console.error("❌ Error fetching teacher profiles:", err);
    res.status(500).json({ error: "Failed to fetch teacher profiles" });
  }
};

// ✅ GET teacher by ID
const getFullTeacherProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const teacher = await Teacher.findById(id)
      .populate("bloodGroup")        // Already added
       .populate({
        path: "class",
        select: "name section",
        populate: {
          path: "section",
          select: "name", // or any other fields you want
        },
      }) // populate only the name of class
      .populate("subject", "name");            // ✅ Add this

    if (!teacher) return res.status(404).json({ error: "Teacher not found" });

    const [payroll, leave, bankDetails, documents, password] =
      await Promise.all([
        Payroll.findOne({ teacher: id }),
        Leave.findOne({ teacher: id }),
        BankDetails.findOne({ teacher: id }),
        TeacherDocuments.findOne({ teacher: id }),
        Password.findOne({ teacher: id }),
      ]);

    res.status(200).json({
      teacher,
      payroll,
      leave,
      bankDetails,
      documents,
      password,
    });
  } catch (err) {
    console.error("❌ Error fetching teacher profile:", err);
    res.status(500).json({ error: "Failed to fetch teacher profile" });
  }
};


// ✅ UPDATE teacher profile
const updateFullTeacherProfile = async (req, res) => {
  try {
    const { id } = req.params;

    // Parse JSON stringified fields
    let teacher = req.body.teacher ? JSON.parse(req.body.teacher) : {};
    const payroll = req.body.payroll ? JSON.parse(req.body.payroll) : {};
    const leave = req.body.leave ? JSON.parse(req.body.leave) : {};
    const bankDetails = req.body.bankDetails
      ? JSON.parse(req.body.bankDetails)
      : {};
    const password = req.body.password ? JSON.parse(req.body.password) : {};

    const profileImageFile = req.files?.profileImage;
    const idProofFile = req.files?.idProof;
    const joiningLetterFile = req.files?.joiningLetter;

    // ✅ Attach profile image URL if uploaded
    if (profileImageFile && profileImageFile.length > 0) {
      const filePath = profileImageFile[0].filename;

      // Ensure no extra 'upload/' is added
      teacher.profileImage = filePath.startsWith("upload/")
        ? `/${filePath}`
        : `/upload/${filePath}`;
    }

    // ✅ Update Teacher main info
    await Teacher.findByIdAndUpdate(id, teacher, { new: true });

    // ✅ Prepare update operations
    const updatePromises = [];

    if (Object.keys(payroll).length > 0) {
      updatePromises.push(
        Payroll.findOneAndUpdate(
          { teacher: id },
          { ...payroll, teacher: id },
          { upsert: true, new: true }
        )
      );
    }

    if (Object.keys(leave).length > 0) {
      updatePromises.push(
        Leave.findOneAndUpdate(
          { teacher: id },
          { ...leave, teacher: id },
          { upsert: true, new: true }
        )
      );
    }

    if (Object.keys(bankDetails).length > 0) {
      updatePromises.push(
        BankDetails.findOneAndUpdate(
          { teacher: id },
          { ...bankDetails, teacher: id },
          { upsert: true, new: true }
        )
      );
    }

    if (password?.password) {
      const hashedPassword = await bcrypt.hash(password.password, 10);
      updatePromises.push(
        Password.findOneAndUpdate(
          { teacher: id },
          { teacher: id, hashedPassword },
          { upsert: true, new: true }
        )
      );
    }

    // ✅ Update documents if new files uploaded
    const docUpdates = {};
    if (idProofFile?.[0]?.filename) {
      docUpdates.idProof = `/upload/${idProofFile[0].filename}`;
    }
    if (joiningLetterFile?.[0]?.filename) {
      docUpdates.joiningLetter = `/upload/${joiningLetterFile[0].filename}`;
    }

    if (Object.keys(docUpdates).length > 0) {
      updatePromises.push(
        TeacherDocuments.findOneAndUpdate(
          { teacher: id },
          { teacher: id, ...docUpdates },
          { upsert: true, new: true }
        )
      );
    }

    await Promise.all(updatePromises);

    res.status(200).json({ message: "Teacher profile updated successfully" });
  } catch (err) {
    console.error("❌ Error updating teacher profile:", err);
    res.status(500).json({ error: "Failed to update teacher profile" });
  }
};

// ✅ DELETE teacher profile
const deleteTeacherProfile = async (req, res) => {
  try {
    const { id } = req.params;

    await Promise.all([
      Teacher.findByIdAndDelete(id),
      Payroll.findOneAndDelete({ teacher: id }),
      Leave.findOneAndDelete({ teacher: id }),
      BankDetails.findOneAndDelete({ teacher: id }),
      Password.findOneAndDelete({ teacher: id }),
      TeacherDocuments.findOneAndDelete({ teacher: id }),
    ]);

    res.status(200).json({ message: "Teacher profile deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting teacher profile:", err);
    res.status(500).json({ error: "Failed to delete teacher profile" });
  }
};

module.exports = {
  createFullTeacherProfile,
  getAllTeacherProfiles,
  getFullTeacherProfile,
  updateFullTeacherProfile,
  deleteTeacherProfile,
};
