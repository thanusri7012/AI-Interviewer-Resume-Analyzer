import React, { useState } from "react";
import { signUp, logIn, logOut } from "./auth";
import { useNavigate } from "react-router-dom";
import './AuthForm.css';

const AuthForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLogin, setIsLogin] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleAuth = async (event) => {
        event.preventDefault();
        setError("");

        try {
            if (isLogin) {
                await logIn(email, password);
                navigate("/dashboard");
            } else {
                await signUp(email, password);
                navigate("/dashboard");
            }
        } catch (err) {
            setError(err.message);
        }
    };

    const handleLogout = async () => {
        try {
            await logOut();
            setError("");
            navigate("/");
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2 className="card-title">{isLogin ? "Welcome Back!" : "Join Us Today!"}</h2>
                <p className="card-subtitle">{isLogin ? "Sign in to your account" : "Create a new account"}</p>
                
                <form className="auth-form" onSubmit={handleAuth}>
                    <input
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="input-field"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="input-field"
                        required
                    />
                    
                    {error && <p className="error-message">{error}</p>}

                    <button type="submit" className="submit-button">
                        {isLogin ? "Log In" : "Sign Up"}
                    </button>
                </form>

                <div className="auth-toggle">
                    <p>
                        {isLogin ? "Don't have an account?" : "Already have an account?"}
                        <span onClick={() => setIsLogin(!isLogin)} className="toggle-link">
                            {isLogin ? " Sign Up" : " Log In"}
                        </span>
                    </p>
                </div>
                
                <button onClick={handleLogout} className="logout-button">Log Out</button>
            </div>
        </div>
    );
};

export default AuthForm;