const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const router = express.Router();

router.post("/chat", async (req, res) => {
    const { message } = req.body;

    try {
        if (!message) {
            return res.status(400).json({ error: "Message is required" });
        }

        if (!process.env.GEMINI_API_KEY) {
            console.error("Gemini Error: Missing API Key");
            return res.status(500).json({ error: "Server Configuration Error: GEMINI_API_KEY is missing." });
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // Add a system prompt context by prepending it to the message or using system instruction if supported.
        // simpler to just prepend context for a stateless chat
        const context = "You are an expert AI Career Coach and Resume Builder Assistant. Your goal is to help users improve their resumes, suggest skills, prepare for interviews, and provide career advice. Be professional, encouraging, and concise.\n\nUser Query: ";

        const result = await model.generateContent(context + message);
        const response = await result.response;
        const text = response.text();

        res.json({ response: text });
    } catch (error) {
        console.error("Gemini Error:", error);
        res.status(500).json({
            error: "AI Request Failed",
            details: error.message || "Unknown error"
        });
    }
});

module.exports = router;
