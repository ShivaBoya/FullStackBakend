const SectionRegistry = {
    // --- CORE SECTIONS (Image Based + Standard) ---

    personal: {
        id: "personal",
        label: "Personal Information",
        icon: "User",
        repeatable: false,
        fields: [
            { key: "fullName", label: "Full Name", type: "text", required: true, placeholder: "Boya Shiva" },
            { key: "jobTitle", label: "Job Title", type: "text", placeholder: "MERN Stack Developer" },
            { key: "email", label: "Email", type: "email", placeholder: "shiva@example.com" },
            { key: "phone", label: "Phone", type: "text", placeholder: "+91 9876543210" },
            { key: "location", label: "Location", type: "text", placeholder: "Hyderabad, Telangana" },
            { key: "linkedin", label: "LinkedIn", type: "url", placeholder: "linkedin.com/in/..." },
            { key: "github", label: "GitHub", type: "url", placeholder: "github.com/..." },
            { key: "portfolio", label: "Portfolio", type: "url", placeholder: "https://..." }
        ]
    },
    summary: {
        id: "summary",
        label: "Professional Summary",
        icon: "FileText",
        repeatable: false,
        fields: [
            { key: "summaryText", label: "Summary", type: "textarea", maxLength: 600, placeholder: "Passionate MERN Stack Developer..." }
        ]
    },
    experience: {
        id: "experience",
        label: "Professional Experience",
        icon: "Briefcase",
        repeatable: true,
        fields: [
            { key: "jobTitle", label: "Job Title", type: "text", required: true, placeholder: "Senior Developer" },
            { key: "company", label: "Company", type: "text", required: true, placeholder: "Tech Corp" },
            { key: "location", label: "Location", type: "text", placeholder: "New York, NY" },
            { key: "startDate", label: "Start Date", type: "text", placeholder: "MM/YYYY" },
            { key: "endDate", label: "End Date", type: "text", placeholder: "MM/YYYY or Present" },
            { key: "isCurrent", label: "I currently work here", type: "checkbox" },
            { key: "responsibilities", label: "Responsibilities", type: "bullet-list", placeholder: "Led a team of 5 developers..." }
        ]
    },
    education: {
        id: "education",
        label: "Education",
        icon: "GraduationCap",
        repeatable: true,
        fields: [
            { key: "degree", label: "Degree / Course", type: "text", required: true, placeholder: "Bachelor of Science" },
            { key: "institution", label: "Institution", type: "text", required: true, placeholder: "University of Tech" },
            { key: "location", label: "Location", type: "text", placeholder: "City, Country" },
            { key: "startDate", label: "Start Date", type: "text", placeholder: "MM/YYYY" },
            { key: "endDate", label: "End Date", type: "text", placeholder: "MM/YYYY" },
            { key: "grade", label: "Grade / GPA", type: "text", placeholder: "3.8/4.0" }
        ]
    },
    skills: {
        id: "skills",
        label: "Skills",
        icon: "Zap",
        repeatable: true,
        fields: [
            { key: "category", label: "Category", type: "select", options: ["Frontend", "Backend", "Databases", "Tools & Platforms", "Programming Languages", "Soft Skills"], required: true },
            { key: "skillName", label: "Skills (Comma Separated)", type: "tag-list", placeholder: "React, Node.js, MongoDB" }
        ]
    },
    projects: {
        id: "projects",
        label: "Projects",
        icon: "Folder",
        repeatable: true,
        fields: [
            { key: "title", label: "Project Title", type: "text", required: true, placeholder: "E-Commerce App" },
            { key: "techStack", label: "Tech Stack", type: "tag-list", placeholder: "React, Node.js, MongoDB" },
            { key: "descriptionBullets", label: "Key Contributions", type: "bullet-list", placeholder: "Implemented payment gateway..." },
            { key: "liveLink", label: "Live Link", type: "url" },
            { key: "githubLink", label: "GitHub Link", type: "url" }
        ]
    },

    // --- ADDITIONAL SECTIONS (Restored) ---

    certificates: {
        id: "certificates",
        label: "Certificates",
        icon: "Award",
        repeatable: true,
        fields: [
            { key: "title", label: "Certificate Name", type: "text", placeholder: "AWS Certified" },
            { key: "issuer", label: "Issuer", type: "text", placeholder: "Amazon" },
            { key: "year", label: "Year/Date", type: "text", placeholder: "2024" },
            { key: "credentialUrl", label: "Credential URL", type: "url" }
        ]
    },
    awards: {
        id: "awards",
        label: "Awards",
        icon: "Trophy",
        repeatable: true,
        fields: [
            { key: "title", label: "Award Title", type: "text", placeholder: "Employee of the Month" },
            { key: "issuer", label: "Issuer", type: "text", placeholder: "Company Inc" },
            { key: "year", label: "Year", type: "text", placeholder: "2023" }
        ]
    },
    courses: {
        id: "courses",
        label: "Courses",
        icon: "BookOpen",
        repeatable: true,
        fields: [
            { key: "courseName", label: "Course Name", type: "text", placeholder: "Advanced React Patterns" },
            { key: "platform", label: "Platform", type: "text", placeholder: "Udemy" },
            { key: "year", label: "Year", type: "text", placeholder: "2023" }
        ]
    },
    languages: {
        id: "languages",
        label: "Languages",
        icon: "Globe",
        repeatable: true,
        fields: [
            { key: "language", label: "Language", type: "text", placeholder: "English" },
            { key: "proficiency", label: "Proficiency", type: "select", options: ["Native", "Fluent", "Intermediate", "Basic"] }
        ]
    },
    organisations: {
        id: "organisations",
        label: "Organisations",
        icon: "Users",
        repeatable: true,
        fields: [
            { key: "organisationName", label: "Organisation", type: "text", placeholder: "Red Cross" },
            { key: "role", label: "Role", type: "text", placeholder: "Volunteer" },
            { key: "duration", label: "Duration", type: "text", placeholder: "2020 - 2021" }
        ]
    },
    publications: {
        id: "publications",
        label: "Publications",
        icon: "PenTool",
        repeatable: true,
        fields: [
            { key: "title", label: "Publication Title", type: "text" },
            { key: "publisher", label: "Publisher", type: "text" },
            { key: "year", label: "Year", type: "text" },
            { key: "link", label: "Link", type: "url" }
        ]
    },
    interests: {
        id: "interests",
        label: "Interests",
        icon: "Heart",
        repeatable: true,
        fields: [
            { key: "interest", label: "Interest", type: "text", placeholder: "Photography" }
        ]
    },
    references: {
        id: "references",
        label: "References",
        icon: "UserCheck",
        repeatable: true,
        fields: [
            { key: "name", label: "Reference Name", type: "text" },
            { key: "designation", label: "Position", type: "text" },
            { key: "organisation", label: "Company", type: "text" },
            { key: "contactInfo", label: "Contact Info", type: "text" }
        ]
    },
    declaration: {
        id: "declaration",
        label: "Declaration",
        icon: "FileSignature",
        repeatable: false,
        fields: [
            { key: "statement", label: "Statement", type: "textarea", placeholder: "I hereby declare..." },
            { key: "place", label: "Place", type: "text" },
            { key: "date", label: "Date", type: "date" }
        ]
    },
    custom: {
        id: "custom",
        label: "Custom Section",
        icon: "PlusCircle",
        repeatable: true,
        fields: [
            { key: "customTitle", label: "Title", type: "text" },
            { key: "customContent", label: "Details", type: "textarea" }
        ]
    }
};

module.exports = SectionRegistry;
