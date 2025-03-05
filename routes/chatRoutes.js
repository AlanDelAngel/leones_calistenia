const express = require("express");
const axios = require("axios");
require("dotenv").config();

const router = express.Router();
const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

// Ensure the API key is loaded
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_API_KEY) {
    console.error("❌ OpenAI API key is missing! Check .env file.");
}

router.post("/chat", async (req, res) => {
    try {
        const userMessage = req.body.message;
        const response = await axios.post(
            OPENAI_API_URL,
            {
                model: "gpt-4",
                messages: [
                    { role: "system", content: "You are an AI assistant for Leones Calistenia." },
                    { role: "user", content: userMessage },
                ],
                max_tokens: 200,
            },
            {
                headers: {
                    "Authorization": `Bearer ${OPENAI_API_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );

        res.json(response.data);
    } catch (error) {
        console.error("❌ Error with OpenAI API:", error.response?.data || error.message);
        res.status(500).json({ error: "Error processing request" });
    }
});

module.exports = router;
