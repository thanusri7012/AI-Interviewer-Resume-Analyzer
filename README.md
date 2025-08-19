# 🤖 AI Interview Assistant and Resume Analyzer

## 📌 Project Description
The **AI Interview Assistant and Resume Analyzer** is a full-stack application designed to help job seekers prepare for **technical** and **behavioral interviews** while optimizing their resumes with the power of **local AI**.  
It leverages a local Large Language Model (LLM) — **Ollama** with the **Gemma 2B** model — to generate interview questions, evaluate answers, and provide detailed resume feedback.

---

## 🚀 Key Features

### 🎯 AI-Powered Interview Simulation
- **Dynamic Question Generation**: Generates unique, non-repeating interview questions on technical topics like **C**, **Java**, **Python**, **Data Structures**, and behavioral skills.
- **Customizable Interviews**: Choose interview type (**Technical** or **Behavioral**) and difficulty (**Easy**, **Medium**, **Hard**).
- **Interactive Interface**: Clean and intuitive UI to view questions, submit answers, and navigate the interview process.

### 🧠 Intelligent Answer Evaluation
- **Real-time Feedback**: AI evaluates answers instantly.
- **Scoring & Feedback**: Each answer gets a **score out of 10**, detailed strengths & weaknesses, and the **correct answer** for comparison.
- **Structured Output**: Neatly formatted sections for easy readability.

### 📄 Resume Analysis with AI
- **Automated Resume Review**: Upload your resume in **PDF** format.
- **Actionable Feedback**: Get clear, specific suggestions to improve structure, clarity, and effectiveness.

### 🗣 Enhanced Accessibility & Usability
- **Text-to-Speech**: Uses Web Speech API to read out questions and feedback.
- **Voice Commands**: Navigate hands-free with commands like `"next question"`, `"submit answer"`, `"stop audio"`.
- **Voice Input for Answers**: Dictate your responses instead of typing.

---

## 🛠 Technology Stack
**Frontend:**  
- React.js with `react-router-dom` for navigation  
- CSS for a modern, responsive UI  

**Backend:**  
- Node.js with Express.js  
- `axios` for API calls  
- `cors` for CORS handling  
- `multer` for file uploads  
- `pdf-parse` for extracting PDF text  

**AI/LLM:**  
- Ollama with **Gemma 2B** model (runs locally for privacy & low latency)  

---

## ⚙ How It Works
1. **Start Interview** → User selects interview type & topic → Frontend sends request to backend.
2. **Generate Question** → Backend prompts Ollama to create a unique question.
3. **Evaluate Answer** → User answers (text/voice) → Backend evaluates and returns score + feedback + correct answer.
4. **Analyze Resume** → User uploads PDF → Backend extracts text → Ollama analyzes and returns actionable suggestions.
5. **Voice Integration** → Web Speech API handles Text-to-Speech and Speech Recognition for smooth interaction.

---

## 🎯 Purpose
This project acts as a **private, AI-powered interview coach and resume consultant**,  
demonstrating the potential of **local AI** for practical, real-world career preparation.

---
