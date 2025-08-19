const express = require("express");
const axios = require("axios");
const cors = require("cors");
const multer = require("multer");
const pdfParse = require("pdf-parse");

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cors());

const OLLAMA_URL = "http://127.0.0.1:11434/api/generate";

const upload = multer({ storage: multer.memoryStorage() });

let userResponses = [];
let askedQuestions = new Set(); // Track unique questions

// ✅ Generate Unique AI Interview Question
app.post("/generate-question", async (req, res) => {
    try {
        const { topic, level } = req.body;
        let promptText = `Generate a ${level} level interview question on ${topic}.`;

        if (topic === "behavioral") {
            promptText = `Generate a ${level} level behavioral interview question.`;
        }

        let attempts = 0;
        let question = "";

        do {
            const response = await axios.post(
                OLLAMA_URL,
                { model: "gemma:2b", prompt: promptText, stream: false },
                { headers: { "Content-Type": "application/json" } }
            );

            question = response.data.response?.trim();
            attempts++;
        } while (askedQuestions.has(question) && attempts < 5); // Retry if duplicate

        if (!question) {
            return res.status(500).json({ error: "Failed to generate a question" });
        }

        askedQuestions.add(question);
        res.json({ question });
    } catch (error) {
        console.error("Error generating question:", error);
        res.status(500).json({ error: "Failed to generate question" });
    }
});

// ✅ Evaluate Answer and Provide Correct Answer
app.post("/evaluate-answer", async (req, res) => {
    try {
        const { question, answer } = req.body;

        const response = await axios.post(
            OLLAMA_URL,
            {
                model: "gemma:2b",
                prompt: `Provide the correct answer for the following interview question. If the answer is a code snippet, format it in a neat and readable way, providing it line by line:\n\nQuestion: "${question}"`,
                stream: false,
            },
            { headers: { "Content-Type": "application/json" } }
        );

        let correctAnswer = response.data.response?.trim();
        if (!correctAnswer) {
            return res.status(500).json({ error: "Failed to retrieve correct answer" });
        }

        userResponses.push({ question, answer, correctAnswer });

        res.json({ correctAnswer });
    } catch (error) {
        console.error("Error evaluating answer:", error);
        res.status(500).json({ error: "Failed to evaluate answer" });
    }
});

// ✅ Resume Analysis with Gemma AI
// ✅ Analyze Resume with Gemma AI
// ✅ Analyze Resume with Gemma AI
app.post("/analyze-resume", upload.single("resume"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const pdfData = await pdfParse(req.file.buffer);
        const resumeText = pdfData.text.trim();

        console.log("✅ Extracted Resume Text:", resumeText.substring(0, 500)); // Debugging Log

        if (!resumeText) {
            return res.status(500).json({ error: "Failed to extract text from resume" });
        }

        const response = await axios.post(
            OLLAMA_URL,
            {
                model: "gemma:2b",
                prompt: `Analyze the following resume:\n\n"${resumeText}"\n\nProvide detailed and actionable feedback on how to improve this resume. List specific corrections, suggestions, and enhancements that the user should implement to make their resume more effective.`,
                stream: false,
            },
            { headers: { "Content-Type": "application/json" } }
        );

        const feedback = response.data.response?.trim() || "No feedback generated.";
        
        // Format feedback into a structured list
        const formattedFeedback = feedback.split("\n").map(item => item.trim()).filter(item => item).join("<br>");

        console.log("✅ Gemma AI Response:", formattedFeedback); // Debugging Log

        res.json({ feedback: formattedFeedback });
    } catch (error) {
        console.error("❌ Error analyzing resume:", error);
        res.status(500).json({ error: "Internal server error while analyzing resume" });
    }
});
// ✅ Start Express Server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
