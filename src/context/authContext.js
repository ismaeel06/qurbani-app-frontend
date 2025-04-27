"use client";

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
          // Comment out the API call
          /*
          const config = {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
          const res = await axios.get("/api/auth/me", config)
          setUser(res.data)
          */

          // Instead, use mock data or retrieve from localStorage
          const userData = JSON.parse(localStorage.getItem("userData")) || {
            _id: "user123",
            name: "Demo User 3",
            email: "demo@example.com",
            phone: "1234567890",
            role: "seller",
            favorites: [],
            createdAt: new Date().toISOString(),
          };
          setUser(userData);
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
      // Comment out the API call
      /*
      const res = await axios.post("/api/auth/register", userData)
      return res.data
      */

      // Instead, return mock data
      const mockResponse = {
        message: "Registration successful. Please verify OTP.",
      };
      return mockResponse;
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
      throw err;
    }
  };

  // Verify OTP
  const verifyOTP = async (phone, otp) => {
    try {
      setError(null);
      // Comment out the API call
      /*
      const res = await axios.post("/api/auth/verify-otp", { phone, otp })
      localStorage.setItem("token", res.data.token)
      setUser(res.data.user)
      return res.data
      */

      // Instead, use mock data
      // Assuming userData is available from the registration process or elsewhere
      const userData =
        JSON.parse(localStorage.getItem("registrationData")) || {}; // Retrieve or initialize userData
      const mockUser = {
        _id: "user123",
        name: userData.name || "Demo User 2",
        email: userData.email || "demo@example.com",
        phone: phone,
        role: userData.role || "seller",
        favorites: [],
        createdAt: new Date().toISOString(),
      };

      localStorage.setItem("token", "mock-token-123");
      localStorage.setItem("userData", JSON.stringify(mockUser));
      setUser(mockUser);

      return { token: "mock-token-123", user: mockUser };
    } catch (err) {
      setError(err.response?.data?.message || "OTP verification failed");
      throw err;
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      setError(null);
      // Comment out the API call
      /*
      const res = await axios.post("/api/auth/login", { email, password })
      localStorage.setItem("token", res.data.token)
      setUser(res.data.user)
      return res.data
      */

      // Instead, use mock data
      const mockUser = {
        _id: "user123",
        name: "Demo User 1",
        email: email,
        phone: "1234567890",
        role: "admin",
        favorites: [],
        createdAt: new Date().toISOString(),
      };

      localStorage.setItem("token", "mock-token-123");
      localStorage.setItem("userData", JSON.stringify(mockUser));
      setUser(mockUser);

      return { token: "mock-token-123", user: mockUser };
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
      // Comment out the API call
      /*
      const token = localStorage.getItem("token")
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
      const res = await axios.put("/api/auth/update-profile", userData, config)
      setUser(res.data)
      return res.data
      */

      // Instead, update the user in state and localStorage
      const updatedUser = { ...user, ...userData };
      localStorage.setItem("userData", JSON.stringify(updatedUser));
      setUser(updatedUser);
      return updatedUser;
    } catch (err) {
      setError(err.response?.data?.message || "Profile update failed");
      throw err;
    }
  };

  // Change password
  const changePassword = async (currentPassword, newPassword) => {
    try {
      setError(null);
      // Comment out the API call
      /*
      const token = localStorage.getItem("token")
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
      await axios.put("/api/auth/change-password", { currentPassword, newPassword }, config)
      */

      // Just return success for mock implementation
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Password change failed");
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
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
