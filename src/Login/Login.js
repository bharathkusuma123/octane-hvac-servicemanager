import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import LoginCard from "./LoginCard";
import { AuthContext } from "../AuthContext/AuthContext"; // adjust the path
import baseURL from '../ApiUrl/Apiurl';

const Login = () => {
  const [username, setUsername] = useState(""); 
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const { login } = useContext(AuthContext); // using context
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
            const response = await axios.post(`${baseURL}/user-login/`, {
        username,
        password,
      });

      const user = response.data.data;

      if (user.role === "Service Manager") {
        login("service-manager", user.user_id);
        navigate("/servicemanager/preventive-maintainance-group");
      } else {
        setError("Access denied. Only Service Managers are allowed.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Invalid username or password");
    }
  };

  return (
    <LoginCard
      title="Service Manager Login"
      username={username}
      password={password}
      showPassword={showPassword}
      setUsername={setUsername}
      setPassword={setPassword}
      setShowPassword={setShowPassword}
      handleSubmit={handleSubmit}
      error={error}
    />
  );
};

export default Login;
