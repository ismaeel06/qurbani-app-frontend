"use client"

import { useState, useEffect, useContext } from "react"
import { useRouter } from "next/router"
import Head from "next/head"
import Image from "next/image"
import { User, Edit, MapPin, Calendar, Package, Heart, MessageCircle } from "react-feather"
import { AuthContext } from "../context/authContext"
import { ListingContext } from "../context/listingContext"
import ListingCard from "../components/ListingCard"

export default function Profile() {
  const { user } = useContext(AuthContext)
  const { getUserListings } = useContext(ListingContext)
  const router = useRouter()

  const [activeTab, setActiveTab] = useState("listings")
  const [userListings, setUserListings] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    const fetchUserListings = async () => {
      try {
        setIsLoading(true)
        const listings = await getUserListings()
        setUserListings(listings)
      } catch (error) {
        console.error("Error fetching user listings:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserListings()
  }, [user, router]) //commneted getUserListings from dependency array

  if (!user) {
    return null // Will redirect in useEffect
  }

  return (
    <>
      <Head>
        <title>My Profile | Qurbani App</title>
      </Head>

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          {/* Profile Header */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                {user.profileImage ? (
                  <Image
                    src={user.profileImage || "/placeholder.svg"}
                    alt={user.name}
                    width={96}
                    height={96}
                    className="rounded-full"
                  />
                ) : (
                  <User size={40} className="text-gray-500" />
                )}
              </div>

              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                  <h1 className="text-2xl font-bold">{user.name}</h1>
                  <button
                    onClick={() => router.push("/settings")}
                    className="mt-2 md:mt-0 inline-flex items-center text-sm text-gray-600 hover:text-green-600"
                  >
                    <Edit size={16} className="mr-1" /> Edit Profile
                  </button>
                </div>

                <div className="flex flex-wrap justify-center md:justify-start gap-4 text-gray-600 mb-4">
                  {user.location && (
                    <div className="flex items-center">
                      <MapPin size={16} className="mr-1" />
                      <span>{user.location}</span>
                    </div>
                  )}
                  <div className="flex items-center">
                    <Calendar size={16} className="mr-1" />
                    <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="capitalize">{user.role}</span>
                  </div>
                </div>

                <p className="text-gray-700">{user.bio || "No bio provided"}</p>
              </div>
            </div>
          </div>

          {/* Dashboard Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-md p-4 flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                <Package size={24} className="text-green-600" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Total Listings</p>
                <p className="text-2xl font-bold">{userListings.length}</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-4 flex items-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                <Heart size={24} className="text-red-600" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Favorites</p>
                <p className="text-2xl font-bold">{user.favorites ? user.favorites.length : 0}</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-4 flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                <MessageCircle size={24} className="text-blue-600" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Active Chats</p>
                <p className="text-2xl font-bold">{user.activeChats || 0}</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow-md mb-6">
            <div className="flex border-b">
              <button
                onClick={() => setActiveTab("listings")}
                className={`flex-1 py-3 text-center font-medium ${
                  activeTab === "listings"
                    ? "text-green-600 border-b-2 border-green-600"
                    : "text-gray-600 hover:text-green-600"
                }`}
              >
                My Listings
              </button>
              <button
                onClick={() => setActiveTab("favorites")}
                className={`flex-1 py-3 text-center font-medium ${
                  activeTab === "favorites"
                    ? "text-green-600 border-b-2 border-green-600"
                    : "text-gray-600 hover:text-green-600"
                }`}
              >
                Favorites
              </button>
              <button
                onClick={() => router.push("/chat")}
                className="flex-1 py-3 text-center font-medium text-gray-600 hover:text-green-600"
              >
                Messages
              </button>
              <button
                onClick={() => router.push("/settings")}
                className="flex-1 py-3 text-center font-medium text-gray-600 hover:text-green-600"
              >
                Settings
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div>
            {activeTab === "listings" && (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">My Listings</h2>
                  {user.role === "seller" && (
                    <button
                      onClick={() => router.push("/add-listing")}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      Add New Listing
                    </button>
                  )}
                </div>

                {isLoading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(3)].map((_, index) => (
                      <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                        <div className="h-48 bg-gray-300"></div>
                        <div className="p-4">
                          <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
                          <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
                          <div className="h-8 bg-gray-300 rounded w-1/3"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : userListings.length === 0 ? (
                  <div className="bg-white rounded-lg shadow-md p-8 text-center">
                    <h3 className="text-xl font-medium text-gray-700 mb-2">No listings yet</h3>
                    {user.role === "seller" ? (
                      <>
                        <p className="text-gray-500 mb-4">Start selling by creating your first listing.</p>
                        <button
                          onClick={() => router.push("/add-listing")}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                        >
                          Add Listing
                        </button>
                      </>
                    ) : (
                      <p className="text-gray-500">You need to be a seller to create listings.</p>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {userListings.map((listing) => (
                      <ListingCard key={listing._id} listing={listing} />
                    ))}
                  </div>
                )}
              </>
            )}

            {activeTab === "favorites" && (
              <>
                <h2 className="text-xl font-bold mb-4">My Favorites</h2>

                {isLoading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(3)].map((_, index) => (
                      <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                        <div className="h-48 bg-gray-300"></div>
                        <div className="p-4">
                          <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
                          <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
                          <div className="h-8 bg-gray-300 rounded w-1/3"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : user.favorites && user.favorites.length === 0 ? (
                  <div className="bg-white rounded-lg shadow-md p-8 text-center">
                    <h3 className="text-xl font-medium text-gray-700 mb-2">No favorites yet</h3>
                    <p className="text-gray-500 mb-4">Browse listings and add them to your favorites.</p>
                    <button
                      onClick={() => router.push("/catalog")}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      Browse Listings
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Favorites will be loaded here */}
                    <p className="col-span-full text-center text-gray-600">Loading favorites...</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
