// context/AuthContext.jsx
"use client"
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function parseJwt(token) {
  try {
    const base64Payload = token.split(".")[1];
    const payload = atob(base64Payload); // decode base64
    return JSON.parse(payload);
  } catch (err) {
    console.error("Invalid token:", err);
    return null;
  }
}

export const AuthProvider = ({ children }) => {
    // const [user, setUser] = useState(null)

/*     const token = localStorage.getItem("token");
user = parseJwt(token); */

 const [user, setUser] = useState(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      return token ? parseJwt(token) : null;
    }
    return null;
  });


  // Login function
  const login = (token) => {
    localStorage.setItem("token", token);
    const decoded = jwt_decode(token);
    setUser(decoded);
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);
