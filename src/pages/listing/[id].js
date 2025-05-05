"use client";

import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import axios from "axios";
import Image from "next/image";
import {
  Heart,
  MessageCircle,
  Share2,
  MapPin,
  Flag,
  Edit,
  Calendar,
  User,
  ChevronLeft,
  ChevronRight,
} from "react-feather";
import { ListingContext } from "../../context/listingContext.js";
import { AuthContext } from "../../context/authContext.js";
import { ChatContext } from "../../context/chatContext.js";
import RelatedListings from "../../components/RelatedListing.js";

export default function ListingDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { getListing, toggleFavorite } = useContext(ListingContext);
  const { user } = useContext(AuthContext);
  const { startChat, setCurrentChat } = useContext(ChatContext);
  const [isNavigating, setIsNavigating] = useState(false);

  const [listing, setListing] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  const [showReportModal, setShowReportModal] = useState(false);
  const [reportType, setReportType] = useState("Other");
  const [reportReason, setReportReason] = useState("");

  useEffect(() => {
    if (id) {
      const fetchListing = async () => {
        try {
          setIsLoading(true);
          const data = await getListing(id);
          console.log(data);
          setListing(data);

          // Check if listing is in user's favorites
          if (user && user.favorites) {
            setIsFavorite(user.favorites.includes(id));
          }
        } catch (error) {
          console.error("Error fetching listing:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchListing();
    }
  }, [id, user]); // removed getListing dependency array

  const handleFavoriteToggle = async () => {
    if (!user) {
      router.push("/login");
      return;
    }

    try {
      await toggleFavorite(id);
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const handleReport = () => {
    if (!user) {
      router.push("/login");
      return;
    }
    setShowReportModal(true);
  };

  const submitReport = async () => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/admin/listings/${id}/report`,
        { type: reportType, reason: reportReason },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (response.status === 201 || response.status === 200) {
        // Success

        setShowReportModal(false);
        // TODO: refresh stats or update UI as needed
      } else {
        // Unexpected status code
        console.error("Unexpected response:", response);
        alert(`Failed to submit report (status ${response.status}).`);
      }
    } catch (err) {
      // Network or server error
      console.error("Report failed:", err);
      if (err.response) {
        // Server responded with a status outside 2xx
        alert(
          `Error ${err.response.status}: ${
            err.response.data.message || "Unable to submit report."
          }`
        );
      } else {
        // No response received
        alert("Network error: Unable to reach the server.");
      }
    }
  };

  const handleContactSeller = async () => {
    if (!user) {
      router.push("/login");
      return;
    }

    if (user._id === listing.seller._id) {
      alert(
        "You cannot chat with yourself as you are the seller of this listing."
      );
      return;
    }

    try {
      const chat = await startChat(listing._id, listing.seller._id);
      setCurrentChat(chat);
      router.push(`/chat?id=${chat._id}`);
    } catch (error) {
      console.error("Error starting chat:", error);
    }
  };

  const handleShareListing = () => {
    if (navigator.share) {
      navigator.share({
        title: listing.title,
        text: `Check out this ${listing.category} for Qurbani!`,
        url: window.location.href,
      });
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const nextImage = () => {
    if (listing && listing.images.length > 0) {
      setActiveImageIndex(
        (prevIndex) => (prevIndex + 1) % listing.images.length
      );
    }
  };

  const prevImage = () => {
    if (listing && listing.images.length > 0) {
      setActiveImageIndex(
        (prevIndex) =>
          (prevIndex - 1 + listing.images.length) % listing.images.length
      );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
            <div className="h-96 bg-gray-300 rounded-lg mb-6"></div>
            <div className="h-8 bg-gray-300 rounded w-3/4 mb-4"></div>
            <div className="h-6 bg-gray-300 rounded w-1/2 mb-8"></div>
            <div className="h-32 bg-gray-300 rounded mb-6"></div>
            <div className="h-12 bg-gray-300 rounded w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Listing Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The listing you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => router.push("/catalog")}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Browse Listings
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{listing.title} | Qurbani App</title>
        <meta
          name="description"
          content={listing.description.substring(0, 160)}
        />
      </Head>

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <div className="mb-6">
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 md:space-x-3">
                <li className="inline-flex items-center">
                  <button
                    onClick={() => router.push("/")}
                    className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-green-600"
                  >
                    Home
                  </button>
                </li>
                <li>
                  <div className="flex items-center">
                    <span className="mx-2 text-gray-400">/</span>
                    <button
                      onClick={() => router.push("/catalog")}
                      className="text-sm font-medium text-gray-700 hover:text-green-600"
                    >
                      Catalog
                    </button>
                  </div>
                </li>
                <li aria-current="page">
                  <div className="flex items-center">
                    <span className="mx-2 text-gray-400">/</span>
                    <span className="text-sm font-medium text-gray-500 truncate max-w-xs">
                      {listing.title}
                    </span>
                  </div>
                </li>
              </ol>
            </nav>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Image Gallery */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="relative h-96">
                  {
                    <Image
                      src={
                        listing.images[activeImageIndex] || "/placeholder.svg"
                      }
                      alt={`${listing.title} - Image ${activeImageIndex + 1}`}
                      fill
                      className="object-contain"
                    />
                  }

                  {listing.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-2 text-gray-800 hover:bg-opacity-100"
                      >
                        <ChevronLeft size={24} />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-2 text-gray-800 hover:bg-opacity-100"
                      >
                        <ChevronRight size={24} />
                      </button>
                    </>
                  )}
                </div>

                {/* Thumbnail Gallery */}
                {listing.images.length > 1 && (
                  <div className="flex p-2 overflow-x-auto">
                    {listing.images.map((image, index) => (
                      <div
                        key={index}
                        onClick={() => setActiveImageIndex(index)}
                        className={`relative w-20 h-20 flex-shrink-0 mr-2 cursor-pointer rounded-md overflow-hidden ${
                          activeImageIndex === index
                            ? "ring-2 ring-green-500"
                            : "opacity-70"
                        }`}
                      >
                        <Image
                          src={image || "/placeholder.svg"}
                          alt={`Thumbnail ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Listing Details */}
              <div className="bg-white rounded-lg shadow-md p-6 mt-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                  {listing.title}
                </h1>

                <div className="flex items-center text-gray-600 mb-4">
                  <MapPin size={18} className="mr-1" />
                  <span>{listing.location}</span>
                </div>

                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
                    <Calendar size={16} className="mr-1 text-gray-600" />
                    <span className="text-sm">
                      Posted {new Date(listing.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
                    <span className="text-sm capitalize">
                      {listing.category}
                    </span>
                  </div>
                  {listing.weight && (
                    <div className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
                      <span className="text-sm">{listing.weight} kg</span>
                    </div>
                  )}
                  {listing.age && (
                    <div className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
                      <span className="text-sm">{listing.age} years old</span>
                    </div>
                  )}
                </div>

                <div className="border-t border-b border-gray-200 py-4 mb-6">
                  <h2 className="text-xl font-semibold mb-3">Description</h2>
                  <p className="text-gray-700 whitespace-pre-line">
                    {listing.description}
                  </p>
                </div>

                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-3">Features</h2>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {listing.features &&
                      listing.features.map((feature, index) => (
                        <li
                          key={index}
                          className="flex items-center text-gray-700"
                        >
                          <span className="mr-2 text-green-500">•</span>
                          {feature}
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Price Card */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-3xl font-bold text-green-600">
                    Rs. {listing.price.toLocaleString()}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={handleFavoriteToggle}
                      className={`p-2 rounded-full ${
                        isFavorite
                          ? "bg-red-100 text-red-500"
                          : "bg-gray-100 text-gray-500 hover:text-red-500"
                      }`}
                      aria-label={
                        isFavorite
                          ? "Remove from favorites"
                          : "Add to favorites"
                      }
                    >
                      <Heart
                        size={20}
                        fill={isFavorite ? "currentColor" : "none"}
                      />
                    </button>
                    <button
                      onClick={handleShareListing}
                      className="p-2 rounded-full bg-gray-100 text-gray-500 hover:text-green-600"
                      aria-label="Share listing"
                    >
                      <Share2 size={20} />
                    </button>
                    <button
                      onClick={handleReport}
                      className="p-2 rounded-full bg-red-100 text-red-500 hover:bg-red-200"
                      aria-label="Report listing"
                    >
                      <Flag size={20} />
                    </button>
                  </div>
                </div>

                {user && user._id === listing.seller._id ? (
                  <button
                    onClick={() => {
                      setIsNavigating(true);
                      // Use shallow routing to reduce page reload
                      router.push(`/edit-listing/${listing._id}`, undefined, {
                        shallow: false,
                      });
                    }}
                    className="w-full py-3 bg-green-600 text-white rounded-lg font-medium flex items-center justify-center hover:bg-green-700 transition-colors"
                    disabled={isNavigating}
                  >
                    {isNavigating ? (
                      <>
                        <span className="inline-block animate-pulse mr-2">
                          ⏳
                        </span>
                        Loading...
                      </>
                    ) : (
                      <>
                        <Edit size={20} className="mr-2" />
                        Edit Listing
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={handleContactSeller}
                    className="w-full py-3 bg-green-600 text-white rounded-lg font-medium flex items-center justify-center hover:bg-green-700 transition-colors"
                    disabled={!user}
                  >
                    <MessageCircle size={20} className="mr-2" />
                    {!user ? "Login to Contact" : "Contact Seller"}
                  </button>
                )}
              </div>

              {/* Seller Card */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">
                  Seller Information
                </h2>
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                    {listing.seller.profileImage ? (
                      <Image
                        src={listing.seller.profileImage || "/placeholder.svg"}
                        alt={listing.seller.name}
                        width={48}
                        height={48}
                        className="rounded-full"
                      />
                    ) : (
                      <User size={24} className="text-gray-500" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium">{listing.seller.name}</h3>
                    <p className="text-sm text-gray-600">
                      Member since{" "}
                      {new Date(listing.seller.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <span>Listings: {listing.seller.listingCount || 0}</span>
                  <span>Verified Seller</span>
                </div>

                {user && user._id !== listing.seller._id && (
                  <button
                    onClick={handleContactSeller}
                    className="w-full py-2 border border-green-600 text-green-600 rounded-lg font-medium hover:bg-green-50 transition-colors"
                  >
                    View Profile
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Related Listings */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Similar Listings</h2>
            <RelatedListings
              currentListingId={listing._id}
              category={listing.category}
            />
          </div>
        </div>
      </div>

      {showReportModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={() => setShowReportModal(false)}
        >
          <div
            className="bg-white p-6 rounded-lg w-1/3 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-semibold mb-4">Report Listing</h3>

            <div className="mb-4">
              <label className="block text-sm mb-1">Type</label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full border rounded px-3 py-2 focus:ring-red-200 focus:border-red-400"
              >
                <option>Spam</option>
                <option>Inappropriate</option>
                <option>False Information</option>
                <option>Other</option>
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-sm mb-1">Reason</label>
              <textarea
                rows={3}
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                className="w-full border rounded px-3 py-2 focus:ring-red-200 focus:border-red-400"
              />
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowReportModal(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={submitReport}
                disabled={!reportReason.trim()}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
