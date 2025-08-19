import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
// The axios import is removed as you're using mock data
import "./Interview.css";

const Interview = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const interviewType = location.state?.type || "technical";

    const technicalTopics = [
        "C",
        "Java",
        "Python",
        "Data Structures & Algorithms",
        "Object-Oriented Programming (OOP)",
        "Databases & SQL",
        "Web Development",
        "Operating Systems",
        "Computer Networks"
    ];

    const behavioralTopics = ["Behavioral"];
    const levels = ["Easy", "Medium", "Hard"];

    const [level, setLevel] = useState("Easy");
    const [topic, setTopic] = useState(technicalTopics[0]);
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [evaluation, setEvaluation] = useState("");
    const [previousQuestions, setPreviousQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1);
    const [timeLeft, setTimeLeft] = useState(180);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const recognitionRef = React.useRef(null);

    const synth = window.speechSynthesis;

    const speak = (text) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1;
        utterance.pitch = 1;
        synth.speak(utterance);
    };

    const stopSpeaking = () => {
        synth.cancel();
    };
    
    // startRecording is now a dependency, so we wrap it in useCallback
    const startRecording = useCallback(() => {
        if ('webkitSpeechRecognition' in window) {
            const recognition = new window.webkitSpeechRecognition();
            recognition.lang = "en-US";
            recognition.continuous = true;
            recognition.interimResults = true;
            recognitionRef.current = recognition;

            recognition.onresult = (event) => {
                let finalTranscript = "";
                let interimTranscript = "";
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    const transcript = event.results[i][0].transcript;
                    if (event.results[i].isFinal) {
                        finalTranscript += transcript;
                    } else {
                        interimTranscript += transcript;
                    }
                }
                setAnswer(finalTranscript + interimTranscript);
            };

            recognition.onstart = () => {
                setIsRecording(true);
            };

            recognition.onend = () => {
                setIsRecording(false);
            };

            recognition.start();
        } else {
            console.error("Web Speech API is not supported in this browser.");
            alert("Web Speech API is not supported in this browser. Please use Google Chrome.");
        }
    }, []);

    const stopRecording = useCallback(() => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
        setIsRecording(false);
    }, []);
    
    // This is the missing function that was causing the error
    const toggleRecording = () => {
        if (!isRecording) {
            startRecording();
        } else {
            stopRecording();
        }
    };


    const fetchQuestion = useCallback(async () => {
        stopSpeaking();
        stopRecording();
        try {
            const newQuestion = `**Explain the concept of Polymorphism in Object-Oriented Programming.**

- What is the difference between compile-time and run-time polymorphism?
- Provide a clear code example for one type of polymorphism using C++.
- How does polymorphism contribute to code reusability and flexibility?
`;
            setQuestion(newQuestion);
            setAnswer("");
            setEvaluation("");
            setTimeLeft(180);
            setIsTimerRunning(true);
            setPreviousQuestions((prev) => [...prev, { question: newQuestion, answer: "", evaluation: "" }]);
            setCurrentQuestionIndex(prevIndex => prevIndex + 1);
        } catch (error) {
            console.error("❌ Error fetching question:", error);
            alert("Error fetching question. Please check console for details.");
        }
    }, [topic, level, stopRecording, stopSpeaking]);

    const handleSubmit = useCallback(async () => {
        stopSpeaking();
        setIsTimerRunning(false);
        stopRecording();

        try {
            const generatedFeedback = `Completeness: Your answer covered the definition of polymorphism but lacked a concrete code example.
Accuracy: The definition was accurate.
Clarity: The explanation was clear, but could be more concise.`;
            const generatedSuggestions = `Next time, try to include a small code snippet to illustrate the concept. Also, mention method overriding and overloading as key aspects of polymorphism.`;
            const generatedScore = Math.floor(Math.random() * 5) + 6; // Mock score between 6 and 10

            navigate('/feedback', {
                state: {
                    question,
                    userAnswer: answer,
                    score: generatedScore,
                    feedback: generatedFeedback,
                    suggestions: generatedSuggestions
                }
            });

        } catch (error) {
            console.error("❌ Error retrieving feedback:", error);
            alert("An error occurred while retrieving the evaluation.");
        }
    }, [answer, question, stopRecording, speak, navigate]);

    useEffect(() => {
        if (timeLeft === 0) handleSubmit();
        if (isTimerRunning && timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [timeLeft, isTimerRunning, handleSubmit]);

    const handlePreviousQuestion = () => {
        stopSpeaking();
        stopRecording();
        if (currentQuestionIndex > 0) {
            const prevQuestion = previousQuestions[currentQuestionIndex - 1];
            setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
            setQuestion(prevQuestion.question);
            setAnswer(prevQuestion.answer);
            setEvaluation(prevQuestion.evaluation);
        }
    };

    const handleNextQuestion = () => {
        stopSpeaking();
        stopRecording();
        if (currentQuestionIndex < previousQuestions.length - 1) {
            const nextQuestion = previousQuestions[currentQuestionIndex + 1];
            setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
            setQuestion(nextQuestion.question);
            setAnswer(nextQuestion.answer);
            setEvaluation(nextQuestion.evaluation);
        } else {
            fetchQuestion();
        }
    };

    const handleResetAnswer = () => {
        setAnswer("");
        setEvaluation("");
    };

    const handleStopInterview = () => {
        stopSpeaking();
        stopRecording();
        navigate("/interviewtypeselection");
    };

    const formatQuestion = (text) => {
        const lines = text.split('\n');
        let formattedHtml = '';
        let inList = false;

        lines.forEach(line => {
            if (line.trim().startsWith('-')) {
                if (!inList) {
                    formattedHtml += '<ul>';
                    inList = true;
                }
                const content = line.trim().substring(1).trim();
                const boldFormatted = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                formattedHtml += `<li>${boldFormatted}</li>`;
            } else {
                if (inList) {
                    formattedHtml += '</ul>';
                    inList = false;
                }
                const boldFormatted = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                if (boldFormatted.trim() !== '') {
                    formattedHtml += `<p>${boldFormatted}</p>`;
                }
            }
        });

        if (inList) {
            formattedHtml += '</ul>';
        }

        return formattedHtml;
    };

    const formatEvaluation = (text) => {
        return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
    };

    return (
        <div className="interview-page-container">
            <div className="interview-panel">
                <div className="interview-header">
                    <h1 className="interview-title">AI Interview Assistant</h1>
                    <p className="interview-type-label">Type: <span>{interviewType.charAt(0).toUpperCase() + interviewType.slice(1)}</span> Interview</p>
                </div>
                
                <div className="interview-main">
                    <div className="question-area">
                        <h3 className="section-title">Question:</h3>
                        {question ? (
                            <div className="question-box">
                                <div className="formatted-question-content" dangerouslySetInnerHTML={{ __html: formatQuestion(question) }}></div>
                            </div>
                        ) : (
                            <p className="no-question-message">Click "Start Interview" to get your first question.</p>
                        )}
                        {question && (
                             <div className="timer-display">
                                 Time Left: {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
                             </div>
                        )}
                    </div>

                    <div className="answer-area">
                        <h3 className="section-title">Your Answer:</h3>
                        <textarea
                            className="answer-input"
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            placeholder={isRecording ? "Listening..." : "Type or speak your answer here..."}
                        />
                    </div>
                </div>

                {evaluation && (
                    <div className="feedback-area">
                        <h3 className="section-title">Evaluation & Feedback:</h3>
                        <div className="evaluation-box" dangerouslySetInnerHTML={{ __html: formatEvaluation(evaluation) }}></div>
                    </div>
                )}
                
                <div className="interview-controls-panel">
                    <div className="dropdown-group">
                        <label htmlFor="topic" className="control-label">Topic:</label>
                        <select id="topic" value={topic} onChange={(e) => setTopic(e.target.value)} className="control-select">
                            {(interviewType === "behavioral" ? behavioralTopics : technicalTopics).map((t) => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>
                    </div>

                    {interviewType !== "behavioral" && (
                        <div className="dropdown-group">
                            <label htmlFor="level" className="control-label">Level:</label>
                            <select id="level" value={level} onChange={(e) => setLevel(e.target.value)} className="control-select">
                                {levels.map((l) => (
                                    <option key={l} value={l}>{l}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    <button className="btn start-btn" onClick={fetchQuestion}>
                        <i className="fas fa-play"></i> Start Interview
                    </button>
                    <button className="btn audio-btn" onClick={() => speak(question)} disabled={!question}>
                        <i className="fas fa-volume-up"></i> Start Audio
                    </button>
                    <button className="btn audio-btn stop-audio-btn" onClick={stopSpeaking}>
                        <i className="fas fa-volume-mute"></i> Stop Audio
                    </button>
                    <button className={`btn voice-input-btn ${isRecording ? "recording" : ""}`} onClick={toggleRecording}>
                        {isRecording ? <><i className="fas fa-stop-circle"></i> Stop Voice Input</> : <><i className="fas fa-microphone"></i> Start Voice Input</>}
                    </button>
                    <button className="btn submit-btn" onClick={handleSubmit}>
                        <i className="fas fa-paper-plane"></i> Submit Answer
                    </button>
                    <button className="btn nav-btn prev-btn" onClick={handlePreviousQuestion} disabled={currentQuestionIndex <= 0}>
                        <i className="fas fa-arrow-left"></i> Previous
                    </button>
                    <button className="btn nav-btn reset-btn" onClick={handleResetAnswer}>
                        <i className="fas fa-redo"></i> Reset
                    </button>
                    <button className="btn nav-btn next-btn" onClick={handleNextQuestion}>
                        Next <i className="fas fa-arrow-right"></i>
                    </button>
                    <button className="btn end-interview-btn" onClick={handleStopInterview}>
                        <i className="fas fa-times-circle"></i> End Interview
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Interview;