"use client"

import { useState, useEffect, useContext } from "react"
import { useRouter } from "next/router"
import Head from "next/head"
import { ListingContext } from "../context/listingContext"
import { AuthContext } from "../context/authContext"
import ListingCard from "../components/ListingCard"
import { Heart } from "react-feather"

export default function Favorites() {
  const { getFavoriteListings } = useContext(ListingContext)
  const { user } = useContext(AuthContext)
  const router = useRouter()

  const [favoriteListings, setFavoriteListings] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    const fetchFavorites = async () => {
      try {
        setIsLoading(true)
        const listings = await getFavoriteListings()
        setFavoriteListings(listings)
      } catch (error) {
        console.error("Error fetching favorite listings:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchFavorites()
  }, [user, router]) // Removed getFavoriteListings from dependency array

  if (!user) {
    return null // Will redirect in useEffect
  }

  return (
    <>
      <Head>
        <title>My Favorites | Qurbani App</title>
      </Head>

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold mb-6">My Favorites</h1>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
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
          ) : favoriteListings.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="flex justify-center mb-4">
                <Heart size={48} className="text-gray-300" />
              </div>
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
              {favoriteListings.map((listing) => (
                <ListingCard key={listing._id} listing={listing} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
