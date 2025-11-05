require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const connectDB = require("./config/db");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());

// Middleware to parse JSON requests
app.use(express.json());
app.use('/upload', express.static(path.join(__dirname, 'uploads')));


// Connect to MongoDB
connectDB();


// Basic route
app.use("/api", require("./routes/admin/cameraRoutes"));
app.use("/api", require("./routes/admin/studentRoutes"));
app.use("/api", require("./routes/admin/sectionRoutes"));
app.use("/api", require("./routes/admin/classesRoutes"));
app.use("/api", require("./routes/admin/academicYearRoutes"));
app.use("/api", require("./routes/admin/religionRoutes"));
app.use("/api", require("./routes/admin/bloodGroupRoutes"));
app.use("/api", require("./routes/admin/casteCategoryRoutes"));
app.use("/api", require("./routes/admin/teacherRoutes"));
app.use("/api", require("./routes/admin/subjectRoutes"));
app.use("/api", require("./routes/admin/attandanceRoutes"));



// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});

