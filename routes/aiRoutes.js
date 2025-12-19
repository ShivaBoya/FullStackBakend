const express = require("express");
const OpenAI = require("openai");
const authMiddleware = require("../middlewares/authmiddleware");
require("dotenv").config();

const router = express.Router();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

router.post("/chat", authMiddleware(["user"]), async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ error: "Message is required" });
        }

        if (!process.env.OPENAI_API_KEY) {
            console.error("OpenAI Error: Missing API Key");
            return res.status(500).json({ error: "Server Configuration Error: OPENAI_API_KEY is missing." });
        }

        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content:
                        "You are an expert AI Career Coach and Resume Builder Assistant. Your goal is to help users improve their resumes, suggest skills, prepare for interviews, and provide career advice. Be professional, encouraging, and concise.",
                },
                { role: "user", content: message },
            ],
        });

        res.json({ response: completion.choices[0].message.content });
    } catch (error) {
        console.error("OpenAI Error:", error);
        res.status(500).json({
            error: "AI Request Failed",
            details: error.message || "Unknown error"
        });
    }
});

module.exports = router;
