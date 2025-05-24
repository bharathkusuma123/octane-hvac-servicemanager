// AdminLogin.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginCard from "./LoginCard";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email === "servicemanager@gmail.com" && password === "service@123") {
      localStorage.setItem("userRole", "service-manager");
      navigate("/servicemanager/preventive-maintainance-group");
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <LoginCard
      title="Service Manager Login"
      email={email}
      password={password}
      showPassword={showPassword}
      setEmail={setEmail}
      setPassword={setPassword}
      setShowPassword={setShowPassword}
      handleSubmit={handleSubmit}
      error={error}
    />
  );
};

export default AdminLogin;
