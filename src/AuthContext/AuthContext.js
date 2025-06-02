import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [userRole, setUserRole] = useState(localStorage.getItem("userRole") || null);
  const [userId, setUserId] = useState(localStorage.getItem("userId") || null);

  const login = (role, id) => {
    setUserRole(role);
    setUserId(id);
    localStorage.setItem("userRole", role);
    localStorage.setItem("userId", id);
  };

  const logout = () => {
    setUserRole(null);
    setUserId(null);
    localStorage.removeItem("userRole");
    localStorage.removeItem("userId");
  };

  useEffect(() => {
    // Optional: could add validation with token here
  }, []);

  return (
    <AuthContext.Provider value={{ userRole, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
