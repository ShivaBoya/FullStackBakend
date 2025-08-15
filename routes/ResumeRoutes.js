
const express = require("express");
const ResumeModel = require("../models/ResumeModel");
const authMiddleware = require("../middlewares/authmiddleware");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const nodemailer = require("nodemailer");
const cron = require("node-cron");
const path = require("path");

const ResumeRouter = express.Router();
ResumeRouter.post("/create", authMiddleware(["user"]), async (req, res) => {
  const resumeData = req.body;
  resumeData.userId = req.userId;

  const existing = await ResumeModel.findOne({ userId: req.userId });
  if (existing) {
    return res
      .status(400)
      .json({ message: "Resume already exists. Use update instead." });
  }

  const resume = new ResumeModel(resumeData);
  await resume.save();

  res.status(201).json({ message: "Resume created successfully", resume });
});

ResumeRouter.get("/getresume", authMiddleware(["user"]), async (req, res) => {
  try {
    const resume = await ResumeModel.findOne({ userId: req.userId });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    res.status(200).json({ resume });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: err.message });
  }
});

ResumeRouter.put("/update", authMiddleware(["user"]), async (req, res) => {
  try {
    const updatedData = req.body;

    const updatedResume = await ResumeModel.findOneAndUpdate(
      { userId: req.userId },
      updatedData,
      { new: true }
    );

    if (!updatedResume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    res.status(200).json({ message: "Resume updated", updatedResume });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: err.message });
  }
});
ResumeRouter.get(
  "/allresumes",
  authMiddleware(["user", "admin"]),
  async (req, res) => {
    try {
      const resumes = await ResumeModel.find({});
      if (resumes.length === 0) {
        return res.status(404).json({ message: "No resumes found" });
      }

      res.status(200).json({ resumes });
    } catch (err) {
      res
        .status(500)
        .json({ message: "Something went wrong", error: err.message });
    }
  }
);

ResumeRouter.delete("/delete", authMiddleware(["user"]), async (req, res) => {
  try {
    const deleted = await ResumeModel.findOneAndDelete({ userId: req.userId });

    if (!deleted) {
      return res.status(404).json({ message: "Resume not found" });
    }

    res.status(200).json({ message: "Resume deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: err.message });
  }
});


ResumeRouter.get("/send", authMiddleware(["user"]), async (req, res) => {
  try {
    const resume = await ResumeModel.findOne({ userId: req.userId });

    if (!resume) {
      return res.status(404).json({ message: "No resume found" });
    }

    const userEmail = resume.personalInfo?.email;
    if (!userEmail) {
      return res.status(400).json({ message: "Email not found in resume" });
    }

    const reportsDir = path.join(__dirname, "reports");
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir);
    }

    const filePath = path.join(reportsDir, `${req.userId}_resume.pdf`);

    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream(filePath));
    doc
      .fontSize(16)
      .text(`Resume of ${resume.personalInfo.name || "User"}`, { underline: true });
    doc.moveDown();
    doc.text(`Email: ${userEmail}`);
    doc.text(`Education: ${JSON.stringify(resume.education, null, 2)}`);
    doc.text(`Skills: ${resume.skills.join(", ")}`);
    doc.text(`Experience: ${JSON.stringify(resume.workExperience, null, 2)}`);
    doc.end();

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
      text: "Here is your resume attached as PDF",
      attachments: [{ filename: "Resume.pdf", path: filePath }],
    });

    res.status(200).json({ message: "Resume sent via email successfully" });
  } catch (err) {
    res.status(500).json({ message: "Email sending failed", error: err.message });
  }
});




module.exports = ResumeRouter;
