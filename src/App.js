import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthForm from "./AuthForm";
import Dashboard from "./Dashboard";
import InterviewTypeSelection from "./InterviewTypeSelection"; 
import Interview from "./Interview";
import ResumeAnalysis from "./ResumeAnalysis";
import { getCurrentUser } from "./auth";
import InterviewFeedback from './InterviewFeedback';

const App = () => {
  const [user, setUser] = useState(null);

  // Check if the user is logged in
  useEffect(() => {
    const unsubscribe = getCurrentUser((currentUser) => {
      setUser(currentUser);  
    });
    return () => unsubscribe(); 
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthForm />} />
        <Route path="/dashboard" element={user ? <Dashboard /> : <AuthForm />} />
        <Route path="/interviewtypeselection" element={user ? <InterviewTypeSelection /> : <AuthForm />} />
        <Route path="/interview" element={user ? <Interview /> : <AuthForm />} />
        <Route path="/resume-analysis" element={user ? <ResumeAnalysis /> : <AuthForm />} />
        <Route path="/feedback" element={<InterviewFeedback />} /> {/* Add the new route */}
      </Routes>
    </Router>
  );
};

export default App;
