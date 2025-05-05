"use client";

import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Eye, Trash2 } from "react-feather";
import { AuthContext } from "../../context/authContext";
import AdminSidebar from "../../components/AdminSidebar";

export default function Reports() {
  const { user } = useContext(AuthContext);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        "http://localhost:5000/api/admin/recent-reports",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setReports(data);
    } catch (err) {
      console.error("Error fetching reports:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role !== "admin") return;
    fetchReports();
  }, [user]);

  const handleShowModal = (report) => {
    setSelectedReport(report);
    setShowModal(true);
  };
  const handleCloseModal = () => setShowModal(false);

  const handleDeleteReport = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/admin/reports/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetchReports();
      setShowModal(false);
      alert("Report deleted successfully.");
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
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      fetchReports();
      setShowModal(false);
      alert("Listing deleted successfully.");
    } catch (err) {
      console.error("Error deleting listing:", err);
      alert("Failed to delete listing.");
    }
  };

  const formatDate = (iso) => new Date(iso).toLocaleDateString();

  if (!user || user.role !== "admin") return null;

  // Only include reports with a valid reportedItem
  const validReports = reports.filter((r) => r.reportedItem);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />

      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6">Recent Reports</h1>

        {loading ? (
          <div className="text-gray-500">Loading...</div>
        ) : validReports.length === 0 ? (
          <div className="text-gray-700">No reports available.</div>
        ) : (
          <div className="overflow-x-auto bg-white shadow-md rounded-lg">
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
                        onClick={() => handleShowModal(r)}
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
                        onClick={() => handleDeleteListing(r.reportedItem._id)}
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

        {showModal && selectedReport && (
          <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
            onClick={handleCloseModal}
          >
            <div
              className="bg-white p-6 rounded-lg w-1/3 shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-semibold mb-4">Report Details</h3>
              <p className="mb-2">
                <span className="font-medium">Type:</span> {selectedReport.type}
              </p>
              <p className="mb-2">
                <span className="font-medium">Item:</span>{" "}
                {selectedReport.reportedItem?.title}
              </p>
              <p className="mb-2">
                <span className="font-medium">Reason:</span>{" "}
                {selectedReport.reason}
              </p>
              <p className="mb-2">
                <span className="font-medium">Reporter:</span>{" "}
                {selectedReport.reporter.name}
              </p>
              <p className="mb-2">
                <span className="font-medium">Date:</span>{" "}
                {formatDate(selectedReport.createdAt)}
              </p>
              <p className="mb-6">
                <span className="font-medium">Status:</span>{" "}
                <span
                  className={`px-2 inline-flex text-xs font-semibold rounded-full ${
                    selectedReport.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {selectedReport.status}
                </span>
              </p>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={handleCloseModal}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Close
                </button>
                <button
                  onClick={() => handleDeleteReport(selectedReport._id)}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Delete Report
                </button>
                <button
                  onClick={() =>
                    handleDeleteListing(selectedReport.reportedItem._id)
                  }
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Delete Listing
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
