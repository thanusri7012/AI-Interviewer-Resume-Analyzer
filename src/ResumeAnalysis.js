import React, { useState } from "react";
import axios from "axios";
import "./ResumeAnalysis.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudUploadAlt, faFilePdf, faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';

const ResumeAnalysis = () => {
    const [file, setFile] = useState(null);
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile && selectedFile.type === "application/pdf") {
            setFile(selectedFile);
            setResult(null);
            setError("");
        } else {
            setFile(null);
            setError("Please upload a PDF file only.");
        }
    };

    const handleUpload = async () => {
        if (!file) {
            setError("Please select a resume file to upload.");
            return;
        }

        const formData = new FormData();
        formData.append("resume", file);

        setLoading(true);
        setError("");

        try {
            const response = await axios.post("http://127.0.0.1:5000/analyze-resume", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            if (response.data && response.data.feedback) {
                setResult(response.data.feedback);
            } else {
                setError("No analysis results received. Try again.");
            }
        } catch (err) {
            console.error("Error details:", err);
            setError("Error analyzing resume. Please ensure the backend is running and the file is a valid PDF.");
        }

        setLoading(false);
    };

    return (
        <div className="resume-analysis-container">
            <h2 className="resume-analysis-title">Resume Analyzer</h2>
            <p className="resume-analysis-subtitle">Upload your resume to get instant feedback on how to improve it.</p>

            <div className="upload-section">
                <label htmlFor="file-input" className="file-upload-label">
                    <div className="upload-box">
                        <FontAwesomeIcon icon={faCloudUploadAlt} className="upload-icon" />
                        <p className="upload-text">Drag & Drop or Click to Upload</p>
                        <p className="upload-subtext">PDF files only (max 10MB)</p>
                    </div>
                </label>
                <input id="file-input" type="file" accept=".pdf" onChange={handleFileChange} />
            </div>

            {file && (
                <div className="file-info-box">
                    <FontAwesomeIcon icon={faFilePdf} className="file-icon" />
                    <span className="file-name">{file.name}</span>
                    <FontAwesomeIcon icon={faCheckCircle} className="file-status-icon success" />
                </div>
            )}

            {error && (
                <div className="error-box">
                    <FontAwesomeIcon icon={faTimesCircle} className="error-icon" />
                    <p className="error-text">{error}</p>
                </div>
            )}

            <button
                className="analyze-btn"
                onClick={handleUpload}
                disabled={!file || loading}
            >
                {loading ? "Analyzing..." : "Analyze Resume"}
            </button>

            {result && (
                <div className="analysis-result-card">
                    <h3 className="result-title">Analysis Result</h3>
                    <div className="result-content" dangerouslySetInnerHTML={{ __html: result }} />
                </div>
            )}
        </div>
    );
};

export default ResumeAnalysis;