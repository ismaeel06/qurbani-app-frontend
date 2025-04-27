"use client";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

import axios from "axios";
import { createContext, useState, useEffect } from "react";
import { useRouter } from "next/router";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const config = {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          };
          const res = await axios.get(`${API_URL}/api/auth/me`, config);
          setUser(res.data);
        }
      } catch (err) {
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  // Register user
  const register = async (userData) => {
    try {
      setError(null);
      const res = await axios.post(`${API_URL}/api/auth/register`, userData);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
      throw err;
    }
  };

  // Verify OTP
  const verifyOTP = async (phone, otp) => {
    try {
      setError(null);
      const res = await axios.post(`${API_URL}/api/auth/verify-otp`, { phone, otp });
      localStorage.setItem("token", res.data.token);
      setUser(res.data.user);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || "OTP verification failed");
      throw err;
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      setError(null);
      const res = await axios.post(`${API_URL}/api/auth/login`, { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userData", JSON.stringify(res.data.user));
      setUser(res.data.user);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      throw err;
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    router.push("/");
  };

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      setError(null);
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const res = await axios.put(`${API_URL}/api/auth/update-profile`, userData, config);
      setUser(res.data);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || "Profile update failed");
      throw err;
    }
  };

  // Change password
  const changePassword = async (currentPassword, newPassword) => {
    try {
      setError(null);
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.put(`${API_URL}/api/auth/change-password`, { currentPassword, newPassword }, config);
    } catch (err) {
      setError(err.response?.data?.message || "Password change failed");
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser, // <-- Add this line
        loading,
        error,
        register,
        verifyOTP,
        login,
        logout,
        updateProfile,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
