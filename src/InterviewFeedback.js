import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./InterviewFeedback.css";

const InterviewFeedback = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Retrieve data from the router state
    const { question, userAnswer, score, feedback, suggestions } = location.state || {};

    if (!location.state) {
        // Redirect if state data is missing
        navigate("/dashboard");
        return null;
    }

    const formatContent = (text) => {
        if (!text) return null;
        return text.split('\n').map((line, index) => {
            if (line.trim().startsWith('-')) {
                const subItems = line.trim().substring(1).trim().split(':');
                return (
                    <li key={index}>
                        <strong>{subItems[0]}:</strong> {subItems.slice(1).join(':')}
                    </li>
                );
            } else if (line.trim().startsWith('**')) {
                return <p key={index}><strong>{line.replace(/\*\*/g, '')}</strong></p>;
            }
            return <p key={index}>{line}</p>;
        });
    };

    return (
        <div className="feedback-page-container">
            <div className="feedback-panel">
                <div className="feedback-header">
                    <h1 className="feedback-title">Your Interview Summary</h1>
                    <p className="feedback-subtitle">Detailed feedback on your performance</p>
                </div>
                
                <div className="feedback-content">
                    <div className="feedback-card">
                        <h2 className="card-title">Question Asked</h2>
                        <div className="card-text-container">
                            <p className="card-text">{question}</p>
                        </div>
                    </div>

                    <div className="feedback-card">
                        <h2 className="card-title">Your Answer</h2>
                        <div className="card-text-container">
                            <p className="card-text">{userAnswer}</p>
                        </div>
                    </div>
                    
                    <div className="score-container">
                        <h2 className="score-title">Your Score</h2>
                        <div className="score-ring">
                            <span className="score-value">{score !== undefined ? `${score}/10` : 'N/A'}</span>
                        </div>
                    </div>

                    <div className="feedback-card full-width">
                        <h2 className="card-title">Feedback & Suggestions</h2>
                        <div className="feedback-list-container">
                            <ul className="feedback-list">
                                {formatContent(feedback)}
                                {suggestions && formatContent(suggestions)}
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="feedback-actions">
                    <button onClick={() => navigate("/dashboard")} className="feedback-btn return-btn">
                        Return to Dashboard
                    </button>
                    <button onClick={() => navigate(-1)} className="feedback-btn new-interview-btn">
                        Return to the question
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InterviewFeedback;