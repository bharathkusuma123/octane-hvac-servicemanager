



import React, { useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaArrowLeft, FaLock } from "react-icons/fa";
import { FiEye, FiEyeOff } from "react-icons/fi";

import logo from "../Logos/hvac-logo-new.jpg";
// import "./SecurityQuestionsScreen.css";
import "./SignupSetPassword.css";

const SECURITY_QUESTION_CHOICES = [
  "What is your mother’s maiden name?",
  "What was the name of your first pet?",
  "What was your first car?",
  "What is the name of the town where you were born?",
  "What was your childhood nickname?",
];

const SecurityQuestionsScreen = () => {
  const [q1, setQ1] = useState("");
  const [q2, setQ2] = useState("");
  const [a1, setA1] = useState("");
  const [a2, setA2] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const a2InputRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const user_id = location.state?.user_id || "N/A";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const data = {
      security_question1: q1,
      security_answer1: a1,
      security_question2: q2,
      security_answer2: a2,
      password: password,
      is_registered_by_customer: true,
    };

    try {
      const response = await fetch(`http://175.29.21.7:8006/users/${user_id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert("Security questions and password updated successfully!");
        navigate("/"); // Redirect to login
      } else {
        const errorData = await response.json();
        console.error("API error:", errorData);
        alert("Failed to update user. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="security-container">
      <div className="security-card">
        <button className="security-back-button" onClick={() => navigate(-1)}>
          <FaArrowLeft size={20} />
        </button>

        <div className="security-logo-container">
          <img src={logo} alt="HVAC Logo" className="security-logo" />
        </div>

        <h4 className="security-title">Security Questions</h4>
        <p className="user-id-display">User ID: {user_id}</p>

        <form onSubmit={handleSubmit}>
          <label className="security-label">Security Question 1</label>
          <select
            className="security-select"
            value={q1}
            onChange={(e) => setQ1(e.target.value)}
            required
          >
            <option value="">Select Question 1</option>
            {SECURITY_QUESTION_CHOICES.map((question, idx) => (
              <option key={idx} value={question}>
                {question}
              </option>
            ))}
          </select>

          <input
            type="text"
            className="security-input"
            placeholder="Answer"
            value={a1}
            onChange={(e) => setA1(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                a2InputRef.current?.focus();
              }
            }}
            required
          />

          <label className="security-label mt-3">Security Question 2</label>
          <select
            className="security-select"
            value={q2}
            onChange={(e) => setQ2(e.target.value)}
            required
          >
            <option value="">Select Question 2</option>
            {SECURITY_QUESTION_CHOICES.map((question, idx) => (
              <option key={idx} value={question}>
                {question}
              </option>
            ))}
          </select>

          <input
            type="text"
            className="security-input"
            placeholder="Answer"
            value={a2}
            onChange={(e) => setA2(e.target.value)}
            ref={a2InputRef}
            required
          />

          <hr />

          <h5 className="security-label mt-3">Set Your Password</h5>

          <div className="set-input-wrapper">
            <FaLock className="input-icon-inside" />
            <input
              type={showPassword ? "text" : "password"}
              className="pass-input"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              className="eye-icon-right"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </span>
          </div>

          <div className="set-input-wrapper">
            <FaLock className="input-icon-inside" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              className="pass-input"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <span
              className="eye-icon-right"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
            </span>
          </div>

          <button type="submit" className="setpass-submit-button shadow mt-3">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default SecurityQuestionsScreen;

