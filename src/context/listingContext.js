"use client";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

import { createContext, useState, useContext } from "react";
import { AuthContext } from "./authContext";
import axios from "axios";

export const ListingContext = createContext();

export const ListingProvider = ({ children }) => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { user, setUser } = useContext(AuthContext);

  // Get all listings with filters
  const getListings = async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);

      let queryString = "";
      if (Object.keys(filters).length > 0) {
        queryString = "?" + new URLSearchParams(filters).toString();
      }

      console.log("Query String:", queryString); // Debugging line

      const res = await axios.get(`${API_URL}/api/listings${queryString}`);
      setListings(res.data.listings);
      return res.data;
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
      
      const res = await axios.get(`${API_URL}/api/listings/featured`);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch featured listings");
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
      
      const res = await axios.get(`${API_URL}/api/listings/${id}`);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch listing");
      throw err;
    } finally {
      setLoading(false);
    }
  };


  
  const createListing = async (listingData) => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      
      // Extract images from form data
      const images = listingData.getAll("images");
      const imageUrls = [];
      
      // Upload each image to Cloudinary
      for (const image of images) {
        const formData = new FormData();
        formData.append("file", image);
        formData.append("upload_preset", "qurbani_app"); // Create an unsigned upload preset in your Cloudinary dashboard
        
        const uploadRes = await axios.post(
          `https://api.cloudinary.com/v1_1/dyq48gxo5/image/upload`,
          formData
        );

        console.log(uploadRes)
        imageUrls.push(uploadRes.data.secure_url);

      
      }
      
      // Create a new FormData without the images
      const listingFormData = new FormData();
      
      // Add all text fields from original form data
      for (const [key, value] of listingData.entries()) {
        if (key !== "images") {
          listingFormData.append(key, value);
        }
      }
      
      // Add image URLs as JSON string
      listingFormData.append("imageUrls", JSON.stringify(imageUrls));

      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const res = await axios.post(`${API_URL}/api/listings`, listingFormData, config);
      
      // Add the new listing to state
      if (res.data) {
        setListings(prevListings => [...prevListings, res.data]);
      }
      
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create listing");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update listing
  const updateListing = async (id, listingData) => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      };

      const res = await axios.put(`${API_URL}/api/listings/${id}`, listingData, config);
      return res.data;
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

      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await axios.delete(`${API_URL}/api/listings/${id}`, config);
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

      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const res = await axios.post(`${API_URL}/api/listings/${listingId}/favorite`, {}, config);
      
      // Update user in auth context if possible
      if (res.data.isFavorite && setUser && user) {
        // If listing was added to favorites
        if (!user.favorites) user.favorites = [];
        if (!user.favorites.includes(listingId)) {
          setUser({ ...user, favorites: [...user.favorites, listingId] });
        }
      } else if (!res.data.isFavorite && setUser && user) {
        // If listing was removed from favorites
        if (user.favorites && user.favorites.includes(listingId)) {
          setUser({ 
            ...user, 
            favorites: user.favorites.filter(id => id !== listingId) 
          });
        }
      }
      
      return res.data;
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

      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const res = await axios.get(`${API_URL}/api/listings/user/listings`, config);
      return res.data;
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

      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const res = await axios.get( `${API_URL}/api/listings/user/favorites`, config); //FIXED THE URL BY adding /user/
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch favorite listings");
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