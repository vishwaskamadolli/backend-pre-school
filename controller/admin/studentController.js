const Student = require("../../model/admin/studentModel/model");
const ParentGuardian = require("../../model/admin/studentModel/model2");
const Address = require("../../model/admin/studentModel/model3");
const PreviousSchoolDetails = require("../../model/admin/studentModel/model4");
const Documents = require("../../model/admin/studentModel/model5");
const AcademicYear = require("../../model/admin/academicYearModel"); // add this line
const fs = require("fs");
const path = require("path");

const sanitizeImageField = (person, file) => {
  if (!person) return person;
  if (file && file.length > 0) {
    person.image = file[0].filename;
  } else if (typeof person.image === "object") {
    person.image = "";
  }
  return person;
};

const isNonEmptyString = (val) =>
  typeof val === "string" && val.trim().length > 0;

const formatAcademicYearLabel = (startDate, endDate) => {
  const startYear = new Date(startDate).getFullYear();
  const endYear = new Date(endDate).getFullYear().toString().slice(-2);
  return `June ${startYear}/${endYear}`;
};

// CREATE student profile
const createFullStudentProfile = async (req, res) => {
  try {
    const {
      student,
      father,
      mother,
      guardian,
      address,
      previousSchool,
      documents,
    } = req.body;

    const profileImageFile = req.files?.profileImage;
    const fatherImageFile = req.files?.fatherImage;
    const motherImageFile = req.files?.motherImage;
    const guardianImageFile = req.files?.guardianImage;

    if (profileImageFile && profileImageFile.length > 0) {
      student.profileImage = profileImageFile[0].filename;
    }

    const newStudent = await Student.create(student);

    const sanitizedFather = sanitizeImageField(father, fatherImageFile);
    const sanitizedMother = sanitizeImageField(mother, motherImageFile);
    const sanitizedGuardian = sanitizeImageField(guardian, guardianImageFile);

    await ParentGuardian.create({
      studentId: newStudent._id,
      father: sanitizedFather,
      mother: sanitizedMother,
      guardian: sanitizedGuardian,
    });

    if (address && Object.keys(address).length > 0) {
      const preparedAddress = {
        studentId: newStudent._id,
        currentAddress: address.currentAddress,
        permanentAddress: address.permanentAddress,
        pincode: address.pincode,
        country: {
          name: address.country?.name || "",
          isoCode: address.country?.isoCode || "",
        },
        state: {
          name: address.state?.name || "",
          isoCode: address.state?.isoCode || "",
        },
        city: {
          name: address.city?.name || "",
        },
      };
      await Address.create(preparedAddress);
    }

    if (
      previousSchool &&
      isNonEmptyString(previousSchool.schoolName) &&
      isNonEmptyString(previousSchool.address)
    ) {
      await PreviousSchoolDetails.create({
        studentId: newStudent._id,
        ...previousSchool,
      });
    }

    if (documents && Object.keys(documents).length > 0) {
      await Documents.create({
        studentId: newStudent._id,
        ...documents,
      });
    }

    res.status(201).json({
      message: "Student profile created successfully",
      studentId: newStudent._id,
    });
  } catch (error) {
    console.error("Error creating student profile:", error);
    res.status(500).json({ error: "Failed to create student profile" });
  }
};

// GET all student profiles
const getAllStudentProfiles = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalStudents = await Student.countDocuments();

    const students = await Student.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("class", "name")
      .populate("section", "name")
      .populate("academicYear"); // Populate academic year

    const fullProfiles = await Promise.all(
      students.map(async (student) => {
        const studentId = student._id;

        const [parentGuardian, address, previousSchool, documents] =
          await Promise.all([
            ParentGuardian.findOne({ studentId }),
            Address.findOne({ studentId }),
            PreviousSchoolDetails.findOne({ studentId }),
            Documents.findOne({ studentId }),
          ]);

        let academicYearLabel = "";
        if (student.academicYear?.startDate && student.academicYear?.endDate) {
          academicYearLabel = formatAcademicYearLabel(
            student.academicYear.startDate,
            student.academicYear.endDate
          );
        }

        return {
          student,
          academicYearLabel,
          parentGuardian,
          address,
          previousSchool,
          documents,
        };
      })
    );

    res.status(200).json({
      currentPage: page,
      totalPages: Math.ceil(totalStudents / limit),
      totalStudents,
      profiles: fullProfiles,
    });
  } catch (error) {
    console.error("Error fetching student profiles:", error);
    res.status(500).json({ error: "Failed to fetch student profiles" });
  }
};

// GET full student profile by ID
const getFullStudentProfile = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Missing student ID" });
    }

    const student = await Student.findById(id).populate("academicYear");

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    const [parentGuardian, address, previousSchool, documents] =
      await Promise.all([
        ParentGuardian.findOne({ studentId: id }),
        Address.findOne({ studentId: id }),
        PreviousSchoolDetails.findOne({ studentId: id }),
        Documents.findOne({ studentId: id }),
      ]);

    const father = parentGuardian?.father || null;
    const mother = parentGuardian?.mother || null;
    const guardian = parentGuardian?.guardian || null;

    let academicYearLabel = "";
    if (student.academicYear?.startDate && student.academicYear?.endDate) {
      academicYearLabel = formatAcademicYearLabel(
        student.academicYear.startDate,
        student.academicYear.endDate
      );
    }

    res.status(200).json({
      student,
      academicYearLabel,
      father,
      mother,
      guardian,
      address,
      previousSchool,
      documents,
    });
  } catch (error) {
    console.error("Error fetching student profile:", error);
    res.status(500).json({ error: "Failed to fetch student profile" });
  }
};

// PUT update full student profile
const updateFullStudentProfile = async (req, res) => {
  try {
    const { id } = req.params;

    let {
      student,
      father,
      mother,
      guardian,
      address,
      previousSchool,
      documents,
    } = req.body;

    student = typeof student === "string" ? JSON.parse(student) : student;
    father = typeof father === "string" ? JSON.parse(father) : father;
    mother = typeof mother === "string" ? JSON.parse(mother) : mother;
    guardian = typeof guardian === "string" ? JSON.parse(guardian) : guardian;
    address = typeof address === "string" ? JSON.parse(address) : address;
    previousSchool =
      typeof previousSchool === "string"
        ? JSON.parse(previousSchool)
        : previousSchool;
    documents =
      typeof documents === "string" ? JSON.parse(documents) : documents;

    const studentImageFile = req.files?.studentImage;
    const fatherImageFile = req.files?.fatherImage;
    const motherImageFile = req.files?.motherImage;
    const guardianImageFile = req.files?.guardianImage;

    if (studentImageFile && studentImageFile.length > 0) {
      student.profileImage = `/upload/${studentImageFile[0].filename}`;
    }

    const sanitizeImageField = (person, file) => {
      if (!person) return person;
      if (file && file.length > 0) {
        person.image = `/upload/${file[0].filename}`;
      } else if (typeof person.image === "object") {
        person.image = "";
      }
      return person;
    };

    const sanitizedFather = sanitizeImageField(father, fatherImageFile);
    const sanitizedMother = sanitizeImageField(mother, motherImageFile);
    const sanitizedGuardian = sanitizeImageField(guardian, guardianImageFile);

    await Student.findByIdAndUpdate(id, student, { new: true });

    let preparedAddress = null;
    if (address && Object.keys(address).length > 0) {
      preparedAddress = {
        currentAddress: address.currentAddress,
        permanentAddress: address.permanentAddress,
        pincode: address.pincode,
        country: {
          name: address.country?.name || "",
          isoCode: address.country?.isoCode || "",
        },
        state: {
          name: address.state?.name || "",
          isoCode: address.state?.isoCode || "",
        },
        city: {
          name: address.city?.name || "",
        },
      };
    }

    await Promise.all([
      ParentGuardian.findOneAndUpdate(
        { studentId: id },
        {
          father: sanitizedFather,
          mother: sanitizedMother,
          guardian: sanitizedGuardian,
        },
        { new: true, upsert: true }
      ),
      preparedAddress
        ? Address.findOneAndUpdate({ studentId: id }, preparedAddress, {
            new: true,
            upsert: true,
          })
        : null,
      previousSchool && Object.keys(previousSchool).length > 0
        ? PreviousSchoolDetails.findOneAndUpdate(
            { studentId: id },
            previousSchool,
            { new: true, upsert: true }
          )
        : null,
      documents && Object.keys(documents).length > 0
        ? Documents.findOneAndUpdate({ studentId: id }, documents, {
            new: true,
            upsert: true,
          })
        : null,
    ]);

    res.status(200).json({ message: "Student profile updated successfully" });
  } catch (error) {
    console.error("Error updating student profile:", error);
    res.status(500).json({ error: "Failed to update student profile" });
  }
};

// DELETE student profile
const deleteStudentProfile = async (req, res) => {
  try {
    const { id } = req.params;

    await Promise.all([
      Student.findByIdAndDelete(id),
      ParentGuardian.findOneAndDelete({ studentId: id }),
      Address.findOneAndDelete({ studentId: id }),
      PreviousSchoolDetails.findOneAndDelete({ studentId: id }),
      Documents.findOneAndDelete({ studentId: id }),
    ]);

    res.status(200).json({ message: "Student profile deleted successfully" });
  } catch (error) {
    console.error("Error deleting student profile:", error);
    res.status(500).json({ error: "Failed to delete student profile" });
  }
};

module.exports = {
  createFullStudentProfile,
  getAllStudentProfiles,
  getFullStudentProfile,
  updateFullStudentProfile,
  deleteStudentProfile,
};
