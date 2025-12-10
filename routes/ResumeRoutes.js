
const express = require("express");
const ResumeModel = require("../models/ResumeModel");
const authMiddleware = require("../middlewares/authmiddleware");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const nodemailer = require("nodemailer");
const cron = require("node-cron");
const path = require("path");


const ResumeRouter = express.Router();

// ✅ Create a new Resume (Allows multiple)
ResumeRouter.post("/create", authMiddleware(["user"]), async (req, res) => {
  try {
    const resumeData = req.body;
    resumeData.userId = req.userId; // Link to authenticated user

    const resume = new ResumeModel(resumeData);
    await resume.save();

    res.status(201).json({ message: "Resume created successfully", resume });
  } catch (err) {
    res.status(500).json({ message: "Failed to create resume", error: err.message });
  }
});

// ✅ Get ALL Resumes for the logged-in user
ResumeRouter.get("/myresumes", authMiddleware(["user"]), async (req, res) => {
  try {
    const resumes = await ResumeModel.find({ userId: req.userId }).sort({ updatedAt: -1 });
    // Return empty array instead of 404 if none found, to handle "first time" gracefully
    res.status(200).json({ resumes });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch resumes", error: err.message });
  }
});

// ✅ Get a Specific Resume by ID
ResumeRouter.get("/:id", authMiddleware(["user"]), async (req, res) => {
  try {
    const resume = await ResumeModel.findOne({ _id: req.params.id, userId: req.userId });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    res.status(200).json({ resume });
  } catch (err) {
    res.status(500).json({ message: "Error fetching resume", error: err.message });
  }
});

// ✅ Update a Specific Resume
ResumeRouter.put("/update/:id", authMiddleware(["user"]), async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    // Use findOneAndUpdate with userId check to ensure ownership
    const updatedResume = await ResumeModel.findOneAndUpdate(
      { _id: id, userId: req.userId },
      updatedData,
      { new: true }
    );

    if (!updatedResume) {
      return res.status(404).json({ message: "Resume not found or unauthorized" });
    }

    res.status(200).json({ message: "Resume updated successfully", updatedResume });
  } catch (err) {
    res.status(500).json({ message: "Update failed", error: err.message });
  }
});

// ✅ Delete a Specific Resume
ResumeRouter.delete("/delete/:id", authMiddleware(["user"]), async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await ResumeModel.findOneAndDelete({ _id: id, userId: req.userId });

    if (!deleted) {
      return res.status(404).json({ message: "Resume not found or unauthorized" });
    }

    res.status(200).json({ message: "Resume deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed", error: err.message });
  }
});

// ✅ Email Resume (Sends the most recently updated one, or specific if ID provided)
// Modified to optionally take ?id= query param
ResumeRouter.get("/send/email", authMiddleware(["user"]), async (req, res) => {
  try {
    const resumeId = req.query.id;
    let query = { userId: req.userId };
    if (resumeId) query._id = resumeId;

    // If ID provided, find that one. If not, find latest.
    const resume = await ResumeModel.findOne(query).sort({ updatedAt: -1 });

    if (!resume) {
      return res.status(404).json({ message: "No resume found to send" });
    }

    const userEmail = resume.personalInfo?.email;
    if (!userEmail) {
      return res.status(400).json({ message: "Email not found in resume" });
    }

    const reportsDir = path.join(__dirname, "../reports"); // ensuring path is correct relative to routes
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir);
    }

    const filePath = path.join(reportsDir, `${req.userId}_${resume._id}_resume.pdf`);

    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream(filePath));
    doc.fontSize(20).text(resume.personalInfo.name || "Resume", { align: "center" });
    doc.moveDown();
    doc.fontSize(12).text(`Email: ${userEmail}`);
    doc.text(`Phone: ${resume.personalInfo.phone || "N/A"}`);
    doc.moveDown();
    doc.fontSize(14).text("Experience", { underline: true });
    (resume.workExperience || []).forEach(exp => {
      doc.fontSize(12).text(`${exp.position} at ${exp.company}`);
      doc.fontSize(10).text(exp.description);
      doc.moveDown();
    });

    doc.end();

    // Give PDFKit a moment to write file before sending (simple hack, better to use stream directly)
    await new Promise(resolve => setTimeout(resolve, 1000));

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GOOGLE_APP_EMAIL,
        pass: process.env.GOOGLE_APP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: '"Resume Builder" <resume@builder.com>',
      to: userEmail,
      subject: "Your Resume PDF",
      text: "Please find your resume attached.",
      attachments: [{ filename: "Resume.pdf", path: filePath }],
    });

    res.status(200).json({ message: "Resume sent via email successfully" });
  } catch (err) {
    console.error("Email Error:", err);
    res.status(500).json({ message: "Email sending failed", error: err.message });
  }
});


module.exports = ResumeRouter;

