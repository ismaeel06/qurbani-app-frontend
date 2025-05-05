"use client";

import { useEffect, useState, useContext } from "react";
import { Modal, Button } from "react-bootstrap";
import axios from "axios";
import { AuthContext } from "../../context/authContext"; // Assuming AuthContext is at the right path
import AdminSidebar from "../../components/AdminSidebar"; // Assuming you have this component

export default function Users() {
  const {
    user,
    updateProfile,
    loading: authLoading,
    error: authError,
  } = useContext(AuthContext);
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true); // State for loading
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [updatedUserData, setUpdatedUserData] = useState({
    name: "",
    email: "",
    role: "",
  });

  // Fetch recent users from API
  useEffect(() => {
    const fetchRecentUsers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/admin/recent-users",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setRecentUsers(response.data); // Store fetched users in state
      } catch (error) {
        console.error("Error fetching recent users:", error);
      } finally {
        setLoading(false); // Set loading to false once the data is fetched
      }
    };

    fetchRecentUsers(); // Call the function when component mounts
  }, []); // Empty dependency array means it will run only once on mount

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = (user) => {
    setSelectedUser(user);
    setUpdatedUserData({
      name: user.name,
      email: user.email,
      role: user.role,
    });
    setShowModal(true);
  };

  const handleUpdateUser = async () => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/admin/users/${selectedUser._id}`,
        updatedUserData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const updatedUser = response.data;

      // Update the users list in state after the update
      setRecentUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === updatedUser._id ? updatedUser : user
        )
      );

      handleCloseModal(); // Close modal after update
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Admin Sidebar */}
      <div className="w-1/4 bg-gray-800 text-white">
        <AdminSidebar /> {/* Assuming you have an AdminSidebar component */}
      </div>

      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6">All Users</h1>

        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : (
          <div className="overflow-x-auto bg-white shadow-md rounded-lg">
            <table className="min-w-full table-auto">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentUsers.map((user) => (
                  <tr key={user._id} className="border-t border-gray-200">
                    <td className="px-6 py-4 text-sm text-gray-800">
                      {user.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      {user.role}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      <button
                        onClick={() => handleShowModal(user)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        View/Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal */}
        {showModal && selectedUser && (
          <div
            className="fixed inset-0 flex items-center justify-center z-50"
            onClick={handleCloseModal}
          >
            <div
              className="bg-white p-6 rounded-lg w-1/3 shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold mb-4">{selectedUser.name}</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Name:
                </label>
                <input
                  type="text"
                  value={updatedUserData.name}
                  onChange={(e) =>
                    setUpdatedUserData({
                      ...updatedUserData,
                      name: e.target.value,
                    })
                  }
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Email:
                </label>
                <input
                  type="email"
                  value={updatedUserData.email}
                  onChange={(e) =>
                    setUpdatedUserData({
                      ...updatedUserData,
                      email: e.target.value,
                    })
                  }
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Role:
                </label>
                <select
                  value={updatedUserData.role}
                  onChange={(e) =>
                    setUpdatedUserData({
                      ...updatedUserData,
                      role: e.target.value,
                    })
                  }
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleCloseModal}
                  className="px-4 py-2 mr-2 text-sm text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Close
                </button>
                <button
                  onClick={handleUpdateUser}
                  className="px-4 py-2 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
                >
                  Update User
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
