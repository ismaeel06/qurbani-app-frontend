"use client"

import Link from "next/link"
import Image from "next/image"
import { Heart } from "react-feather"
import { useContext } from "react"
import { AuthContext } from "../context/authContext"
import { ListingContext } from "../context/listingContext"

// Category image mapping
const categoryImages = {
  cow: "/images/cow.png",
  goat: "/images/goat.png",
  sheep: "/images/sheep.png",
  camel: "/images/camel.png",
  buffalo: "/images/buffalo.png",
}

export default function FeaturedListings({ listings, isLoading }) {
  const { user } = useContext(AuthContext)
  const { toggleFavorite } = useContext(ListingContext)

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
    )
  }

  if (!listings || listings.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 text-lg">No featured listings available at the moment.</p>
      </div>
    )
  }

  const handleFavoriteToggle = async (e, listingId) => {
    e.preventDefault()
    if (!user) return
    await toggleFavorite(listingId)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {listings.map((listing) => (
        <Link key={listing._id} href={`/listing/${listing._id}`}>
          <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-gray-200">
            <div className="relative h-48">
              {/* <Image src={listing.images[0] || "/placeholder.svg"} alt={listing.title} fill className="object-cover" /> */}
              <button
                onClick={(e) => handleFavoriteToggle(e, listing._id)}
                className={`absolute top-2 right-2 p-2 rounded-full ${
                  user && user.favorites.includes(listing._id)
                    ? "bg-red-100 text-red-500"
                    : "bg-white text-gray-400 hover:text-red-500"
                }`}
              >
                <Heart size={20} fill={user && user.favorites.includes(listing._id) ? "currentColor" : "none"} />
              </button>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-1 text-gray-800">{listing.title}</h3>
              <p className="text-gray-600 mb-2">{listing.location}</p>
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-green-600">Rs. {listing.price.toLocaleString()}</span>
                {/* Category image in bottom right corner */}
                {listing.category && categoryImages[listing.category] && (
                  <span className="inline-block ml-2 align-middle">
                    <Image src={categoryImages[listing.category]} alt={listing.category} width={28} height={28} />
                  </span>
                )}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
