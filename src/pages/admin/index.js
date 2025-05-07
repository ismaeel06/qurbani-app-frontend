"use client";

import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import axios from "axios";
import { Users, ShoppingBag, AlertTriangle, Eye, Trash2 } from "react-feather";
import Image from "next/image";
import { AuthContext } from "../../context/authContext";
import AdminSidebar from "../../components/AdminSidebar";

export default function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const router = useRouter();

  const [stats, setStats] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentListings, setRecentListings] = useState([]);
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);

      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      const [statsRes, usersRes, listingsRes, reportsRes] = await Promise.all([
        fetch("http://localhost:5000/api/admin/stats", { headers }).then((r) =>
          r.json()
        ),
        fetch("http://localhost:5000/api/admin/recent-users", { headers }).then(
          (r) => r.json()
        ),
        fetch("http://localhost:5000/api/admin/recent-listings", {
          headers,
        }).then((r) => r.json()),
        fetch("http://localhost:5000/api/admin/recent-reports", {
          headers,
        }).then((r) => r.json()),
      ]);

      setStats(statsRes);
      setRecentUsers(usersRes);
      setRecentListings(listingsRes);
      setReports(reportsRes);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      if (user.role !== "admin") {
        router.push("/");
      } else {
        fetchDashboardData();
      }
    } else {
      router.push("/login");
    }
  }, [user, router]);

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString();

  // Handlers for deleting report and deleting listing
  const handleDeleteReport = async (reportId) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/admin/reports/${reportId}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      fetchDashboardData();
      alert("Report deleted.");
    } catch (err) {
      console.error("Error deleting report:", err);
      alert("Failed to delete report.");
    }
  };

  const handleDeleteListing = async (listingId) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/admin/listings/${listingId}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      fetchDashboardData();
      alert("Listing deleted.");
    } catch (err) {
      console.error("Error deleting listing:", err);
      alert("Failed to delete listing.");
    }
  };

  if (!user || user.role !== "admin") return null;

  // filter out any reports missing their reportedItem
  const validReports = reports.filter((r) => r.reportedItem);

  return (
    <>
      <Head>
        <title>Admin Dashboard | Qurbani App</title>
      </Head>

      <div className="flex min-h-screen bg-gray-100">
        <AdminSidebar />

        <div className="flex-1 p-6">
          <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

          {/* Stats */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-lg shadow-md p-6 animate-pulse"
                >
                  <div className="h-8 bg-gray-300 rounded w-1/2 mb-4"></div>
                  <div className="h-10 bg-gray-300 rounded w-1/3"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
                <div className="p-3 bg-blue-100 rounded-full mr-4">
                  <Users size={24} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Total Users</p>
                  <p className="text-2xl font-bold">{stats?.totalUsers}</p>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
                <div className="p-3 bg-green-100 rounded-full mr-4">
                  <ShoppingBag size={24} className="text-green-600" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Total Listings</p>
                  <p className="text-2xl font-bold">{stats?.totalListings}</p>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
                <div className="p-3 bg-red-100 rounded-full mr-4">
                  <AlertTriangle size={24} className="text-red-600" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Reports</p>
                  <p className="text-2xl font-bold">{stats?.totalReports}</p>
                </div>
              </div>
            </div>
          )}

          {/* Recent Users & Listings */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Recent Users */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b flex justify-between items-center">
                <h2 className="font-semibold">Recent Users</h2>
                <Link href="/admin/users" className="text-blue-600">
                  View All
                </Link>
              </div>
              <div className="p-6">
                {isLoading ? (
                  <p>Loading...</p>
                ) : recentUsers.length === 0 ? (
                  <p>No recent users.</p>
                ) : (
                  recentUsers.map((u) => (
                    <div
                      key={u._id}
                      className="flex items-center mb-4 last:mb-0"
                    >
                      <div className="w-10 h-10 bg-gray-200 rounded-full mr-3">
                        {u.profileImage && (
                          <Image
                            src={u.profileImage}
                            alt={u.name}
                            width={40}
                            height={40}
                            className="rounded-full"
                          />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{u.name}</p>
                        <p className="text-sm text-gray-500">
                          {u.email} •{" "}
                          <span className="capitalize">{u.role}</span>
                        </p>
                      </div>
                      <p className="text-xs text-gray-500">
                        {formatDate(u.createdAt)}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Recent Listings */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b flex justify-between items-center">
                <h2 className="font-semibold">Recent Listings</h2>
                <Link href="/admin/listings" className="text-blue-600">
                  View All
                </Link>
              </div>
              <div className="p-6 space-y-4">
                {isLoading ? (
                  <p>Loading...</p>
                ) : recentListings.length === 0 ? (
                  <p>No recent listings.</p>
                ) : (
                  recentListings.map((l) => (
                    <div key={l._id} className="flex items-center">
                      <div className="w-16 h-16 rounded overflow-hidden mr-3 relative">
                        <Image
                          src={l.images[0] || "/placeholder.svg"}
                          alt={l.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{l.title}</p>
                        <p className="text-sm text-gray-500">
                          Rs. {l.price.toLocaleString()} • {l.location}
                        </p>
                        <p className="text-xs text-gray-500">
                          By {l.seller.name} • {formatDate(l.createdAt)}
                        </p>
                      </div>
                      <Link href={`/admin/listings/${l._id}`}>
                        <Eye className="text-gray-500 hover:text-blue-600" />
                      </Link>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Recent Reports */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b flex justify-between items-center">
              <h2 className="font-semibold">Recent Reports</h2>
              <Link href="/admin/reports" className="text-blue-600">
                View All
              </Link>
            </div>

            {isLoading ? (
              <p className="p-6">Loading...</p>
            ) : validReports.length === 0 ? (
              <p className="p-6 text-gray-700">No reports available.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {[
                        "Type",
                        "Item",
                        "Reason",
                        "Reporter",
                        "Date",
                        "Status",
                        "Actions",
                      ].map((h) => (
                        <th
                          key={h}
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {validReports.map((r) => (
                      <tr key={r._id}>
                        <td className="px-6 py-4">{r.type}</td>
                        <td className="px-6 py-4">{r.reportedItem?.title}</td>
                        <td className="px-6 py-4">{r.reason}</td>
                        <td className="px-6 py-4">{r.reporter.name}</td>
                        <td className="px-6 py-4">{formatDate(r.createdAt)}</td>
                        <td className="px-6 py-4 capitalize">{r.status}</td>
                        <td className="px-6 py-4 flex space-x-2">
                          <button
                            onClick={() =>
                              router.push(`/admin/reports/${r._id}`)
                            }
                            className="p-2 text-gray-500 hover:text-blue-600"
                            aria-label="View report"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteReport(r._id)}
                            className="p-2 text-gray-500 hover:text-red-600"
                            aria-label="Delete report"
                          >
                            <Trash2 size={18} />
                          </button>
                          <button
                            onClick={() =>
                              handleDeleteListing(r.reportedItem._id)
                            }
                            className="p-2 text-gray-500 hover:text-red-600"
                            aria-label="Delete listing"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
