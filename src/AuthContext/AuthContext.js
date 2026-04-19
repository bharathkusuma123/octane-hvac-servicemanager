import React, { createContext, useState } from "react";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [userRole, setUserRole] = useState(localStorage.getItem("userRole") || null);
  const [userId, setUserId] = useState(localStorage.getItem("userId") || null);
  const [sessionId, setSessionId] = useState(localStorage.getItem("session_id") || null); // ✅

  const login = (role, id, sessionId) => {
    setUserRole(role);
    setUserId(id);

    localStorage.setItem("userRole", role);
    localStorage.setItem("userId", id);

    // ✅ Store session_id
    if (sessionId) {
      localStorage.setItem("session_id", sessionId);
      setSessionId(sessionId);
    }
  };

  const logout = () => {
    setUserRole(null);
    setUserId(null);
    setSessionId(null);

    localStorage.removeItem("userRole");
    localStorage.removeItem("userId");
    localStorage.removeItem("session_id"); // ✅ IMPORTANT
    localStorage.removeItem("selectedCompany");
  };

  return (
    <AuthContext.Provider value={{ userRole, userId, sessionId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;