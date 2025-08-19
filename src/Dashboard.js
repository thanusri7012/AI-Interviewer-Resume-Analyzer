import React, { useState, useEffect } from "react";
import { logOut, getCurrentUser } from "./auth";
import { useNavigate } from "react-router-dom";
import ResumeAnalysis from "./ResumeAnalysis";
import './Dashboard.css';


const updateUserProfile = async (userId, profileData) => {
    
    console.log("Saving profile for user:", userId, profileData);
    return {
        ...profileData,
       
        userId: userId,
        status: 'success'
    };
};

// Profile Component
const UserProfile = ({ onBack, user, onSave }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState({
        name: user?.displayName || user?.email?.split("@")[0] || "User",
        email: user?.email || "",
        phone: user?.phone || "",
        bio: user?.bio || "",
    });

    // Update local state if user props change (e.g., after saving)
    useEffect(() => {
        setProfile({
            name: user?.displayName || user?.email?.split("@")[0] || "User",
            email: user?.email || "",
            phone: user?.phone || "",
            bio: user?.bio || "",
        });
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        // You would typically call an API here to persist the data.
        // For this example, we'll use a placeholder function.
        const updatedUser = await updateUserProfile(user.uid, {
            phone: profile.phone,
            bio: profile.bio
        });

        if (updatedUser) {
            // Pass the updated data up to the parent component
            onSave(updatedUser);
            setIsEditing(false); // Switch back to view mode
        }
    };

    return (
        <div className="profile-container">
            <h2 className="profile-title">User Profile</h2>
            <div className="profile-card">
                <div className="profile-info">
                    {isEditing ? (
                        <>
                            <div className="info-group">
                                <label>Name</label>
                                <input type="text" name="name" value={profile.name} onChange={handleChange} />
                            </div>
                            <div className="info-group">
                                <label>Email</label>
                                <input type="email" name="email" value={profile.email} disabled />
                            </div>
                            <div className="info-group">
                                <label>Phone</label>
                                <input type="text" name="phone" value={profile.phone} onChange={handleChange} />
                            </div>
                            <div className="info-group">
                                <label>Bio</label>
                                <textarea name="bio" value={profile.bio} onChange={handleChange} rows="4"></textarea>
                            </div>
                        </>
                    ) : (
                        <>
                            <p><strong>Name:</strong> {profile.name}</p>
                            <p><strong>Email:</strong> {profile.email}</p>
                            <p><strong>Phone:</strong> {profile.phone || "Not provided"}</p>
                            <p><strong>Bio:</strong> {profile.bio || "No bio yet"}</p>
                        </>
                    )}
                </div>
                <div className="profile-actions">
                    <button className="edit-btn" onClick={() => {
                        if (isEditing) {
                            handleSave();
                        } else {
                            setIsEditing(true);
                        }
                    }}>
                        {isEditing ? 'Save Profile' : 'Edit Profile'}
                    </button>
                    <button className="back-btn" onClick={onBack}>
                        ⬅ Back to Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
};

// Progress Component
const UserProgress = ({ onBack }) => {
    const progressData = [
        { name: "Technical Interview", progress: 75, status: "In Progress" },
        { name: "Behavioral Interview", progress: 100, status: "Completed" },
        { name: "Resume Analysis", progress: 100, status: "Completed" }
    ];

    return (
        <div className="progress-container">
            <h2 className="progress-title">Your Progress</h2>
            <button className="back-btn" onClick={onBack}>
                ⬅ Back to Dashboard
            </button>
            <div className="progress-list">
                {progressData.map((item, index) => (
                    <div key={index} className="progress-item">
                        <div className="progress-details">
                            <span className="progress-name">{item.name}</span>
                            <span className="progress-status">{item.status}</span>
                        </div>
                        <div className="progress-bar-container">
                            <div className="progress-bar" style={{ width: `${item.progress}%` }}></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Dashboard
const Dashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [currentView, setCurrentView] = useState('home');

    useEffect(() => {
        getCurrentUser((u) => {
            if (u) {
                // To display phone and bio, you must fetch this data along with the user object.
                // Assuming getCurrentUser now returns an object with phone and bio.
                // If not, you'll need another function to fetch it.
                setUser({
                    ...u,
                    phone: u.phone || '', // Initialize with empty string if not present
                    bio: u.bio || ''
                });
            } else {
                setUser(null);
            }
        });
    }, []);

    const handleSaveProfile = (updatedData) => {
        setUser(prevUser => ({ ...prevUser, ...updatedData }));
    };

    const handleStartInterview = () => {
        navigate("/interviewtypeselection");
    };

    const handleResumeAnalysis = () => {
        setCurrentView('resumeAnalysis');
    };

    const handleBackToDashboard = () => {
        setCurrentView('home');
    };

    const handleLogout = () => {
        logOut();
        navigate("/");
    };

    const renderMainContent = () => {
        switch (currentView) {
            case 'resumeAnalysis':
                return (
                    <div className="content-area">
                        <button className="back-btn" onClick={handleBackToDashboard}>
                            ⬅ Back to Dashboard
                        </button>
                        <ResumeAnalysis />
                    </div>
                );
            case 'profile':
                return <UserProfile onBack={handleBackToDashboard} user={user} onSave={handleSaveProfile} />;
            case 'progress':
                return <UserProgress onBack={handleBackToDashboard} />;
            case 'home':
            default:
                return (
                    <div className="card-grid">
                        <div className="card start-interview-card">
                            <h3 className="card-title">Start Interview</h3>
                            <p className="card-description">Practice with a live AI interviewer.</p>
                            <button className="card-btn" onClick={handleStartInterview}>Start Now</button>
                        </div>
                        <div className="card resume-analysis-card">
                            <h3 className="card-title">Resume Analysis</h3>
                            <p className="card-description">Get feedback on your resume's strengths and weaknesses.</p>
                            <button className="card-btn" onClick={handleResumeAnalysis}>Analyze</button>
                        </div>
                        <div className="card recent-activity-card">
                            <h3 className="card-title">Recent Activity</h3>
                            <p className="card-description">No recent interviews found.</p>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="dashboard-container">
            <aside className="sidebar">
                <div className="sidebar-header">
                    <h2 className="sidebar-title">AI Interviewer</h2>
                    <p className="sidebar-subtitle">Dashboard</p>
                </div>
                <nav className="sidebar-nav">
                    <button className={`nav-btn ${currentView === 'home' ? 'active' : ''}`} onClick={() => setCurrentView('home')}>
                        Home
                    </button>
                    <button className={`nav-btn ${currentView === 'progress' ? 'active' : ''}`} onClick={() => setCurrentView('progress')}>
                        Progress
                    </button>
                    <button className={`nav-btn ${currentView === 'profile' ? 'active' : ''}`} onClick={() => setCurrentView('profile')}>
                        Profile
                    </button>
                </nav>
                <button className="logout-btn" onClick={handleLogout}>Log Out</button>
            </aside>
            <main className="main-content">
                <header className="main-header">
                    <h1 className="main-title">
                        Welcome, {user ? user.email.split('@')[0] : "User"}!
                    </h1>
                    <p className="main-subtitle">Ready for your next step?</p>
                </header>
                {renderMainContent()}
            </main>
        </div>
    );
};

export default Dashboard;