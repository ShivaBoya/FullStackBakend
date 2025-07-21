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

  workExperience: [
    {
      company: String,
      position: String,
      startDate: String,
      endDate: String,
      description: String,
    },
  ],

  education: [
    {
      instition: String,
      degree: String,
      startDate: String,
      endDate: String,
      grade: String,
    },
  ],

  skills: [String],

  certifications: [
    {
      nmae: String,
      issuer: String,
      year: String,
    },
  ],

  projects: [
    {
      title: String,
      description: String,
      techStack: [String],
      githublink: String,
      collaborators: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
    },
  ],

  coverLetter: {
    title: String,
    content: String,
  },

  theme: {
    font: String,
    color: String,
    layout: String,
  },

  versions: [
    {
      versionName: String,
      date: Object,
      createdAt: { type: Date, default: Date.now },
    },
  ],

  createdAt: { type: Date, default: Date.now },
  updatedAt: Date,
});

module.exports = mongoose.model("Resume", resumeSchema);
