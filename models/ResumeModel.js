const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Metadata
    meta: {
      title: { type: String, default: "Untitled Resume" },
      isPublic: { type: Boolean, default: false },
      lastActiveStep: { type: String, default: "personal" }, // For UI restoration
    },

    // Layout & Style Configuration
    templateId: { type: String, default: "modern" },
    themeId: { type: String, default: "blue" },

    // CORE DATA: Order of sections
    // e.g. ["personal", "summary", "experience", "projects", "education"]
    sectionsOrder: {
      type: [String],
      default: ["personal", "summary", "experience", "projects", "education", "skills"]
    },

    // CORE DATA: Content of sections
    // This is flexible to accommodate different field types defined in SectionRegistry
    sectionsData: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      default: {
        personal: {}, // { name: "", email: "" ... }
        summary: {},  // { content: "" }
        experience: [], // Array of objects
        education: [],
        skills: [],
        projects: [],
      }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Resume", resumeSchema);
