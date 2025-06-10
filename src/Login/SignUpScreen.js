import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaEye, FaEyeSlash } from "react-icons/fa";
import logo from "../Logos/hvac-logo-new.jpg";
import "./SignUpScreen.css";

const SignUpScreen = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      alert("Please enter both username and password.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://175.29.21.7:8006/users-login/");
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const result = await response.json();
      const users = result.data || [];

      const matchedUser = users.find(
        (user) =>
          user.username === username &&
          user.password === password
      );

      if (matchedUser) {
        navigate("/servicemanager/signupset-password-screen", { state: { user: matchedUser } });
      } else {
        alert("Invalid username or password. Please try again.");
      }
    } catch (error) {
      alert("Error checking user details. Please try again later.");
      console.error("Error fetching users:", error);
    }
    setLoading(false);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="signup-container">
      <div className="signup-card shadow">
        <button 
          className="otp-back-button" 
          onClick={() => navigate(-1)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '10px',
            position: 'absolute',
            left: '15px',
            top: '15px'
          }}
        >
          <FaArrowLeft size={20} />
        </button>

        <div className="signup-logo-container" style={{ textAlign: 'center', marginBottom: '20px' }}>
          <img 
            src={logo} 
            alt="Logo" 
            style={{ width: "150px", height: "80px" }} 
          />
          <h3 style={{ marginTop: '15px' }}>Sign Up</h3>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px', position: 'relative' }}>
            <i 
              className="bi bi-person-fill" 
              style={{
                position: 'absolute',
                left: '10px',
                top: '10px',
                color: '#6c757d'
              }}
            ></i>
            <input
              type="text"
              style={{
                width: '100%',
                padding: '8px 8px 8px 35px',
                borderRadius: '4px',
                border: '1px solid #ced4da'
              }}
              placeholder="Enter Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div style={{ marginBottom: '15px', position: 'relative' }}>
            <i 
              className="bi bi-lock-fill" 
              style={{
                position: 'absolute',
                left: '10px',
                top: '10px',
                color: '#6c757d'
              }}
            ></i>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter Password"
              value={password}
              style={{
                width: '100%',
                padding: '8px 35px 8px 35px',
                borderRadius: '4px',
                border: '1px solid #ced4da'
              }}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              style={{
                position: 'absolute',
                right: '10px',
                top: '10px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#6c757d'
              }}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <button 
            type="submit" 
            className="loginButton shadow" 
            disabled={loading}
            style={{
              width: '100%',
              backgroundColor: '#0096D6',
              padding: '10px',
              borderRadius: '12px',
              border: 'none',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '20px',
              marginTop: '20px',
              cursor: 'pointer'
            }}
          >
            {loading ? "Checking..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUpScreen;