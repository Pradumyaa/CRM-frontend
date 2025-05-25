// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

// Create the AuthContext
const AuthContext = createContext(null);

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Function to log in a user
  const login = async (employeeId, password, rememberMe = false) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employeeId, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }

      const data = await response.json();

      // Store token and user info in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("employeeId", data.employee.employeeId);
      localStorage.setItem("userName", data.employee.name || "User");
      localStorage.setItem("isAdmin", data.employee.isAdmin || false);

      // Store remember me preference
      localStorage.setItem("rememberMe", rememberMe);

      // Update state
      setUser(data.employee);
      setIsAdmin(data.employee.isAdmin || false);

      return data;
    } catch (error) {
      setError(error.message || "Login failed. Please try again.");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Function to log out a user
  const logout = () => {
    // Save remember me preference
    const rememberMe = localStorage.getItem("rememberMe") === "true";
    const rememberedId = rememberMe ? localStorage.getItem("employeeId") : null;

    // Clear auth data
    localStorage.removeItem("token");
    localStorage.removeItem("employeeId");
    localStorage.removeItem("userName");
    localStorage.removeItem("isAdmin");

    // Restore remembered ID if needed
    if (rememberMe && rememberedId) {
      localStorage.setItem("rememberedEmployeeId", rememberedId);
      localStorage.setItem("rememberMe", "true");
    }

    // Reset state
    setUser(null);
    setIsAdmin(false);

    // Redirect to login
    navigate("/login");
  };

  // Check if user is authenticated on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true);

        // Check if we have a token and employeeId
        const token = localStorage.getItem("token");
        const employeeId = localStorage.getItem("employeeId");
        const userIsAdmin = localStorage.getItem("isAdmin") === "true";
        const userName = localStorage.getItem("userName");

        if (!token || !employeeId) {
          setLoading(false);
          return;
        }

        // For now, we'll just use the stored data
        setUser({
          employeeId,
          name: userName || "User",
          isAdmin: userIsAdmin,
        });
        setIsAdmin(userIsAdmin);
      } catch (error) {
        console.error("Auth verification failed", error);
        // Clear auth data if verification fails
        logout();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Create the context value
  const value = {
    user,
    isAdmin,
    loading,
    error,
    login,
    logout,
    setUser,
    setIsAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
