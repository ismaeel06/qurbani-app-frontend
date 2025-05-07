"use client";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

import axios from "axios";
import { createContext, useState, useEffect } from "react";
import { useRouter } from "next/router";

export const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [stats, setStats] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentListings, setRecentListings] = useState([]);
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Fetch admin dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const statsResponse = await axios.get(
          `${API_URL}/api/admin/stats`,
          config
        );
        setStats(statsResponse.data);

        const usersResponse = await axios.get(
          `${API_URL}/api/admin/recent-users`,
          config
        );
        setRecentUsers(usersResponse.data);

        const listingsResponse = await axios.get(
          `${API_URL}/api/admin/recent-listings`,
          config
        );
        setRecentListings(listingsResponse.data);

        const reportsResponse = await axios.get(
          `${API_URL}/api/admin/recent-reports`,
          config
        );
        setReports(reportsResponse.data);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Error fetching data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <AdminContext.Provider
      value={{
        stats,
        recentUsers,
        recentListings,
        reports,
        isLoading,
        error,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};
