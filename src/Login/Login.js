import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import LoginCard from "./LoginCard";

const AdminLogin = () => {
  const [mobile_no, setMobileNo] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await axios.post("http://175.29.21.7:8006/login/", {
      mobile_no: mobile_no,
      password,
    });

    const user = response.data.data;

    if (user.role === "Service Manager") {
      localStorage.setItem("userRole", "service-manager");
      localStorage.setItem("userId", user.user_id);
      navigate("/servicemanager/preventive-maintainance-group");
    } else {
      setError("Access denied. Only Service Managers are allowed.");
    }
  } catch (err) {
    console.error("Login error:", err);
    setError("Invalid mobile number or password");
  }
};


  return (
    <LoginCard
      title="Service Manager Login"
      mobile_no={mobile_no}
      password={password}
      showPassword={showPassword}
      setMobileNo={setMobileNo}
      setPassword={setPassword}
      setShowPassword={setShowPassword}
      handleSubmit={handleSubmit}
      error={error}
    />
  );
};

export default AdminLogin;
