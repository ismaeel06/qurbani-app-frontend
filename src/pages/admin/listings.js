"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import AdminSidebar from "../../components/AdminSidebar";

export default function Listings() {
  const [recentListings, setRecentListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedListing, setSelectedListing] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Move this out so we can re-use it
  const fetchRecentListings = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:5000/api/admin/recent-listings",
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setRecentListings(data);
    } catch (err) {
      console.error("Error fetching recent listings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentListings();
  }, []);

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = (listing) => {
    setSelectedListing(listing);
    setShowModal(true);
  };

  const handleUpdateListing = async (id, updates) => {
    try {
      await axios.put(
        `http://localhost:5000/api/admin/listings/${id}`,
        updates,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      fetchRecentListings();
      setShowModal(false);
    } catch (err) {
      console.error("Error updating listing:", err);
    }
  };

  const handleDeleteListing = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/admin/listings/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      fetchRecentListings();
    } catch (err) {
      console.error("Error deleting listing:", err);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="w-1/4 bg-gray-800">
        <AdminSidebar />
      </div>
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6">Manage Listings</h1>

        {loading ? (
          <div className="text-gray-500">Loading...</div>
        ) : (
          <table className="min-w-full table-auto bg-white shadow rounded-lg">
            <thead>
              <tr>
                {["Title", "Price", "Seller", "Actions"].map((h) => (
                  <th
                    key={h}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentListings.map((listing) => (
                <tr key={listing._id} className="border-t">
                  <td className="px-6 py-4">{listing.title}</td>
                  <td className="px-6 py-4">
                    Rs. {listing.price.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">{listing.seller.name}</td>
                  <td className="px-6 py-4 space-x-2">
                    <button
                      onClick={() => handleShowModal(listing)}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      View/Edit
                    </button>
                    <button
                      onClick={() => handleDeleteListing(listing._id)}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Custom centered modal */}
        {showModal && selectedListing && (
          <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
            onClick={handleCloseModal}
          >
            <div
              className="bg-white p-6 rounded-lg w-1/3 shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold mb-4">Update Listing</h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleUpdateListing(selectedListing._id, {
                    title: e.target.title.value,
                    price: e.target.price.value,
                    description: e.target.description.value,
                  });
                }}
              >
                <div className="mb-4">
                  <label className="block text-sm font-medium">Title</label>
                  <input
                    name="title"
                    defaultValue={selectedListing.title}
                    className="mt-1 block w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium">Price</label>
                  <input
                    name="price"
                    type="number"
                    defaultValue={selectedListing.price}
                    className="mt-1 block w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium">
                    Description
                  </label>
                  <textarea
                    name="description"
                    rows="4"
                    defaultValue={selectedListing.description}
                    className="mt-1 block w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
