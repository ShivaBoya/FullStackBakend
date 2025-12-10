const TemplateRegistry = {
    // --- SPECIALIZED LAYOUTS ---

    // 1. CLASSIC MATCH (Image Based)
    classic_bw: {
        id: "classic_bw",
        name: "Classic Image Match",
        layout: "single-column",
        columns: {
            main: ["personal", "summary", "education", "skills", "projects", "certificates", "languages", "declaration"]
        }
    },

    // 2. MODERN MATCH (Image Based)
    modern_clean: {
        id: "modern_clean",
        name: "Modern Image Match",
        layout: "single-column",
        columns: {
            main: ["personal", "summary", "skills", "education", "projects", "certificates", "languages", "declaration"]
        }
    },

    // 3. EXECUTIVE (Focus on Experience)
    executive: {
        id: "executive",
        name: "Executive Professional",
        layout: "single-column",
        columns: {
            main: ["personal", "summary", "experience", "skills", "education", "projects", "references"]
        }
    },

    // 4. TECH LEAD (Skills & Projects First)
    tech_lead: {
        id: "tech_lead",
        name: "Tech Lead / Senior Dev",
        layout: "two-column",
        columns: {
            left: ["personal", "skills", "languages", "achievements"],
            right: ["summary", "experience", "projects", "education"]
        }
    },

    // 5. ACADEMIC / CV (Education & Publications focus)
    academic: {
        id: "academic",
        name: "Academic CV",
        layout: "single-column",
        columns: {
            main: ["personal", "education", "publications", "experience", "awards", "conferences", "skills"]
        }
    },

    // 6. CREATIVE (Portfolio & Skills focus)
    creative: {
        id: "creative",
        name: "Creative Portfolio",
        layout: "two-column",
        columns: {
            left: ["personal", "skills", "interests", "awards"],
            right: ["summary", "projects", "experience", "education"]
        }
    },

    // 7. STARTUP / GENERALIST (Versatile)
    startup: {
        id: "startup",
        name: "Startup Generalist",
        layout: "single-column",
        columns: {
            main: ["personal", "summary", "skills", "projects", "experience", "education", "interests"]
        }
    },

    // 8. INTERN / STUDENT (Education First)
    student: {
        id: "student",
        name: "Student / Intern",
        layout: "single-column",
        columns: {
            main: ["personal", "education", "skills", "projects", "experience", "certifications", "languages"]
        }
    },

    // --- STANDARD LAYOUTS ---

    // 9. MODERN SPLIT (Original)
    modern_split: {
        id: "modern",
        name: "Modern Split (2 Column)",
        layout: "two-column",
        columns: {
            left: ["personal", "skills", "languages", "interests"],
            right: ["summary", "experience", "projects", "education", "certificates"]
        }
    },

    // 10. CLASSIC STANDARD (Original)
    classic: {
        id: "classic",
        name: "Classic Standard",
        layout: "single-column",
        columns: {
            main: ["personal", "summary", "experience", "education", "projects", "skills"]
        }
    },

    // 11. MINIMALIST (Original)
    minimal: {
        id: "minimal",
        name: "Minimalist",
        layout: "single-column",
        columns: {
            main: ["personal", "summary", "experience", "projects", "education", "skills"]
        }
    },

    // 12. COMPACT (Dense)
    compact: {
        id: "compact",
        name: "Compact One-Page",
        layout: "two-column",
        columns: {
            left: ["personal", "education", "skills", "languages", "certifications"],
            right: ["summary", "experience", "projects"]
        }
    }
};

module.exports = TemplateRegistry;
