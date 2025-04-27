"use client";

import { createContext, useState } from "react";

// Add mock listings data at the top of the file
const mockListings = [
  {
    _id: "1",
    title: "Healthy Bakra for Qurbani",
    description:
      "A healthy and strong goat perfect for Qurbani. Well-fed and vaccinated.",
    price: 45000,
    category: "goat",
    location: "Karachi",
    age: 2,
    weight: 40,
    features: ["Healthy", "Vaccinated", "Well-fed"],
    images: ["/placeholder.svg"],
    seller: {
      _id: "seller1",
      name: "Ali Farms",
      profileImage: null,
      createdAt: "2023-01-15T10:30:00Z",
    },
    createdAt: "2023-05-15T09:20:00Z",
  },
  {
    _id: "2",
    title: "Premium Cow for Eid",
    description:
      "A premium quality cow raised on our farm. Perfect for Qurbani.",
    price: 120000,
    category: "cow",
    location: "Lahore",
    age: 3,
    weight: 350,
    features: ["Premium Quality", "Farm Raised", "Healthy"],
    images: ["/placeholder.svg"],
    seller: {
      _id: "seller2",
      name: "Malik Farms",
      profileImage: null,
      createdAt: "2023-02-10T08:15:00Z",
    },
    createdAt: "2023-05-14T16:30:00Z",
  },
  {
    _id: "3",
    title: "Young Healthy Camel",
    description:
      "A young and healthy camel available for Qurbani. Well-maintained and cared for.",
    price: 180000,
    category: "camel",
    location: "Islamabad",
    age: 4,
    weight: 450,
    features: ["Young", "Healthy", "Well-maintained"],
    images: ["/placeholder.svg"],
    seller: {
      _id: "seller3",
      name: "Desert Farms",
      profileImage: null,
      createdAt: "2023-03-05T14:20:00Z",
    },
    createdAt: "2023-05-13T11:45:00Z",
  },
  {
    _id: "4",
    title: "Pair of Sheep for Qurbani",
    description:
      "A pair of healthy sheep available for Qurbani. Both are well-fed and vaccinated.",
    price: 60000,
    category: "sheep",
    location: "Peshawar",
    age: 1.5,
    weight: 35,
    features: ["Pair", "Vaccinated", "Well-fed"],
    images: ["/placeholder.svg"],
    seller: {
      _id: "seller4",
      name: "Mountain Farms",
      profileImage: null,
      createdAt: "2023-01-20T09:45:00Z",
    },
    createdAt: "2023-05-12T14:15:00Z",
  },
  {
    _id: "5",
    title: "Healthy Buffalo for Qurbani",
    description:
      "A strong and healthy buffalo perfect for Qurbani. Farm-raised and well-cared for.",
    price: 150000,
    category: "buffalo",
    location: "Multan",
    age: 4,
    weight: 500,
    features: ["Strong", "Healthy", "Farm-raised"],
    images: ["/placeholder.svg"],
    seller: {
      _id: "seller5",
      name: "River Farms",
      profileImage: null,
      createdAt: "2023-02-25T11:30:00Z",
    },
    createdAt: "2023-05-11T10:20:00Z",
  },
  {
    _id: "6",
    title: "Premium Quality Goat",
    description:
      "A premium quality goat with excellent features. Perfect for Qurbani.",
    price: 55000,
    category: "goat",
    location: "Faisalabad",
    age: 2.5,
    weight: 45,
    features: ["Premium Quality", "Excellent Features", "Healthy"],
    images: ["/placeholder.svg"],
    seller: {
      _id: "seller6",
      name: "Quality Farms",
      profileImage: null,
      createdAt: "2023-03-15T13:10:00Z",
    },
    createdAt: "2023-05-10T08:30:00Z",
  },
];

export const ListingContext = createContext();

export const ListingProvider = ({ children }) => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get all listings with filters
  const getListings = async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);

      // Comment out the API call
      /*
      let queryString = ""
      if (Object.keys(filters).length > 0) {
        queryString = "?" + new URLSearchParams(filters).toString()
      }

      const res = await axios.get(`/api/listings${queryString}`)
      setListings(res.data)
      return res.data
      */

      // Instead, return mock data
      // Filter the mock data based on the filters
      let filteredListings = mockListings;

      if (filters.category) {
        filteredListings = filteredListings.filter(
          (listing) => listing.category === filters.category
        );
      }

      if (filters.minPrice) {
        filteredListings = filteredListings.filter(
          (listing) => listing.price >= Number(filters.minPrice)
        );
      }

      if (filters.maxPrice) {
        filteredListings = filteredListings.filter(
          (listing) => listing.price <= Number(filters.maxPrice)
        );
      }

      if (filters.location) {
        filteredListings = filteredListings.filter(
          (listing) => listing.location === filters.location
        );
      }

      // Sort the listings
      if (filters.sort) {
        switch (filters.sort) {
          case "newest":
            filteredListings.sort(
              (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            );
            break;
          case "oldest":
            filteredListings.sort(
              (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
            );
            break;
          case "price_low":
            filteredListings.sort((a, b) => a.price - b.price);
            break;
          case "price_high":
            filteredListings.sort((a, b) => b.price - a.price);
            break;
        }
      }

      setListings(filteredListings);
      return { listings: filteredListings, total: filteredListings.length };
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch listings");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get featured listings
  const getFeaturedListings = async () => {
    try {
      setLoading(true);
      setError(null);
      // Comment out the API call
      /*
      const res = await axios.get("/api/listings/featured")
      return res.data
      */

      // Instead, return mock featured listings
      const featuredListings = mockListings.slice(0, 6);
      return featuredListings;
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to fetch featured listings"
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get single listing
  const getListing = async (id) => {
    try {
      setLoading(true);
      setError(null);
      // Comment out the API call
      /*
      const res = await axios.get(`/api/listings/${id}`)
      return res.data
      */

      // Instead, find the listing in mock data
      const listing = mockListings.find((listing) => listing._id === id);
      return listing || null;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch listing");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Create new listing
  const createListing = async (listingData) => {
    try {
      setLoading(true);
      setError(null);

      // Comment out the API call
      /*
      const token = localStorage.getItem("token")
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }

      const res = await axios.post("/api/listings", listingData, config)
      return res.data
      */

      // Instead, create a mock listing
      const newListing = {
        _id: `listing-${Date.now()}`,
        title: listingData.get("title"),
        description: listingData.get("description"),
        category: listingData.get("category"),
        price: Number(listingData.get("price")),
        location: listingData.get("location"),
        age: listingData.get("age") ? Number(listingData.get("age")) : null,
        weight: listingData.get("weight")
          ? Number(listingData.get("weight"))
          : null,
        features: JSON.parse(listingData.get("features") || "[]"),
        images: ["/placeholder.svg"],
        seller: {
          _id: "user123",
          name: "Demo User",
        },
        createdAt: new Date().toISOString(),
      };

      // Add to mock listings
      mockListings.unshift(newListing);

      return newListing;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create listing");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update listing
  // Update listing
  const updateListing = async (id, listingData) => {
    try {
      setLoading(true);
      setError(null);

      // Commented out real API call
      /*
    const token = localStorage.getItem("token")
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    }

    const res = await axios.put(`/api/listings/${id}`, listingData, config)
    return res.data
    */

      // Instead, update the mock listing
      const index = mockListings.findIndex((listing) => listing._id === id);
      if (index !== -1) {
        mockListings[index] = {
          ...mockListings[index],
          title: listingData.get("title"),
          description: listingData.get("description"),
          category: listingData.get("category"),
          price: Number(listingData.get("price")),
          location: listingData.get("location"),
          age: listingData.get("age") ? Number(listingData.get("age")) : null,
          weight: listingData.get("weight")
            ? Number(listingData.get("weight"))
            : null,
          features: JSON.parse(listingData.get("features") || "[]"),
          updatedAt: new Date().toISOString(),
        };
        return mockListings[index];
      } else {
        throw new Error("Listing not found");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update listing");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete listing
  const deleteListing = async (id) => {
    try {
      setLoading(true);
      setError(null);

      // Comment out the API call
      /*
      const token = localStorage.getItem("token")
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }

      await axios.delete(`/api/listings/${id}`, config)
      */

      // Instead, remove from mock listings
      const index = mockListings.findIndex((listing) => listing._id === id);
      if (index !== -1) {
        mockListings.splice(index, 1);
      }

      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete listing");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Toggle favorite listing
  const toggleFavorite = async (listingId) => {
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

      const res = await axios.post(`/api/listings/${listingId}/favorite`, {}, config)
      return res.data
      */

      // Instead, toggle favorite in local state
      const userData = JSON.parse(localStorage.getItem("userData")) || {
        favorites: [],
      };

      if (!userData.favorites) {
        userData.favorites = [];
      }

      const index = userData.favorites.indexOf(listingId);
      if (index === -1) {
        userData.favorites.push(listingId);
      } else {
        userData.favorites.splice(index, 1);
      }

      localStorage.setItem("userData", JSON.stringify(userData));

      // Update user in auth context if possible
      return { success: true };
    } catch (err) {
      setError(err.response?.data?.message || "Failed to toggle favorite");
      throw err;
    }
  };

  // Get user's listings
  const getUserListings = async () => {
    try {
      setLoading(true);
      setError(null);

      // Comment out the API call
      /*
      const token = localStorage.getItem("token")
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }

      const res = await axios.get("/api/listings/user", config)
      return res.data
      */

      // Instead, filter mock listings for the current user
      const userData = JSON.parse(localStorage.getItem("userData"));
      if (userData && userData._id) {
        const userListings = mockListings.filter(
          (listing) => listing.seller && listing.seller._id === userData._id
        );
        return userListings;
      }
      return [];
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch user listings");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get user's favorite listings
  const getFavoriteListings = async () => {
    try {
      setLoading(true);
      setError(null);

      // Comment out the API call
      /*
      const token = localStorage.getItem("token")
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }

      const res = await axios.get("/api/listings/favorites", config)
      return res.data
      */

      // Instead, filter mock listings based on user favorites
      const userData = JSON.parse(localStorage.getItem("userData"));
      if (userData && userData.favorites && userData.favorites.length > 0) {
        const favoriteListings = mockListings.filter((listing) =>
          userData.favorites.includes(listing._id)
        );
        return favoriteListings;
      }
      return [];
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to fetch favorite listings"
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <ListingContext.Provider
      value={{
        listings,
        loading,
        error,
        getListings,
        getFeaturedListings,
        getListing,
        createListing,
        updateListing,
        deleteListing,
        toggleFavorite,
        getUserListings,
        getFavoriteListings,
      }}
    >
      {children}
    </ListingContext.Provider>
  );
};
