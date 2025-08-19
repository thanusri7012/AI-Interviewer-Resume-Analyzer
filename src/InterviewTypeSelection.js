import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./InterviewTypeSelection.css";

const InterviewType = () => {
    const navigate = useNavigate();
    const [selectedType, setSelectedType] = useState("");

    const handleSelect = (type) => {
        setSelectedType(type);
        setTimeout(() => {
            navigate(`/interview`, { state: { type: type.toLowerCase() } });
        }, 500);
    };

    const goToDashboard = () => {
        navigate("/dashboard");
    };

    return (
        <div className="interview-type-container">
            <div className="interview-type-card">
                <h1 className="main-title">Select Your Interview Type</h1>
                <p className="subtitle">Choose an option below to begin your practice interview.</p>
                <div className="options-grid">
                    <div className="option-card" onClick={() => handleSelect("Behavioral")}>
                        <div className="icon-circle behavioral-icon">
                            <i className="fas fa-user-friends"></i>
                        </div>
                        <h2 className="option-title">Behavioral Interview</h2>
                        <p className="option-description">Focus on soft skills, teamwork, and problem-solving scenarios.</p>
                        <button
                            className={`select-btn ${selectedType === "Behavioral" ? "selected" : ""}`}
                            onClick={(e) => { e.stopPropagation(); handleSelect("Behavioral"); }}
                        >
                            Select
                        </button>
                    </div>
                    <div className="option-card" onClick={() => handleSelect("Technical")}>
                        <div className="icon-circle technical-icon">
                            <i className="fas fa-laptop-code"></i>
                        </div>
                        <h2 className="option-title">Technical Interview</h2>
                        <p className="option-description">Test your knowledge on coding, algorithms, and system design.</p>
                        <button
                            className={`select-btn ${selectedType === "Technical" ? "selected" : ""}`}
                            onClick={(e) => { e.stopPropagation(); handleSelect("Technical"); }}
                        >
                            Select
                        </button>
                    </div>
                </div>
                <div className="back-link-container">
                    <button className="back-link" onClick={goToDashboard}>
                        ← Back to Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InterviewType;