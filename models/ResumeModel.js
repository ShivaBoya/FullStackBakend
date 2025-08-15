const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  personalInfo: {
    name: String,
    email: String,
    phone: String,
    address: String,
    linkedin: String,
    github: String,
  },

  workExperience: { type: [Object], default: [] },

  education: {
    type: [
      {
        institution: String,
        degree: String,
        startDate: String,
        endDate: String,
        grade: String,
      },
    ],
    default: [],
  },

  skills: { type: [String], default: [] },

  certifications: {
    type: [
      {
        name: String,
        issuer: String,
        year: String,
      },
    ],
    default: [],
  },

  projects: {
    type: [
      {
        title: String,
        description: String,
        techStack: [String],
        githubLink: String,
        collaborators: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
        ],
      },
    ],
    default: [],
  },

  coverLetter: {
    title: String,
    content: String,
  },

  theme: {
    font: String,
    color: String,
    layout: String,
  },

  versions: {
    type: [
      {
        versionName: String,
        date: Date,
        createdAt: { type: Date, default: Date.now },
      },
    ],
    default: [],
  },

  createdAt: { type: Date, default: Date.now },
  updatedAt: Date,
});

resumeSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model("Resume", resumeSchema);
