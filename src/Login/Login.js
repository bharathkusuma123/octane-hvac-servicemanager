import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import LoginCard from "./LoginCard";
import { AuthContext } from "../AuthContext/AuthContext"; // adjust the path
import baseURL from '../ApiUrl/Apiurl';
import  Notification_Url from "../ApiUrl/PushNotificanURL";
import { generateToken } from "../Firebase/Firebase";

const Login = () => {
  const [username, setUsername] = useState(""); 
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const { login } = useContext(AuthContext); // using context
  const navigate = useNavigate();

const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');

  try {
    // Generate FCM token
    const fcmToken = await generateToken();

    // Send login request with FCM token
    const response = await axios.post(`${baseURL}/user-login/`, {
      username,
      password,
      fcm_token: fcmToken || '',
    });

    const user = response.data.data;

    if (user.role === "Service Manager") {
      // Login and navigate
      login("service-manager", user.user_id);
      navigate("/servicemanager/preventive-maintainance-group");

      // Send push notification after successful login
      if (fcmToken) {
        try {
          const notifyResponse = await fetch(`${Notification_Url}/send-notification`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              token: fcmToken,
              title: 'Welcome to LandNest!',
              body: 'You have successfully logged in.',
            }),
          });

          const notifyData = await notifyResponse.json();

          if (notifyResponse.ok) {
            console.log('Notification sent successfully:', notifyData);
          } else {
            console.error('Failed to send notification:', notifyData);
          }
        } catch (notifyError) {
          console.error('Error sending notification:', notifyError);
        }
      } else {
        console.warn('No FCM token available for notification.');
      }

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
