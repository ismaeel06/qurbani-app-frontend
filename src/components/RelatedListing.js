"use client"

import { useState, useEffect, useContext } from "react"
import { ListingContext } from "../context/listingContext"
import ListingCard from "./ListingCard"

export default function RelatedListings({ currentListingId, category }) {
  const { getListings } = useContext(ListingContext)
  const [listings, setListings] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchRelatedListings = async () => {
      try {
        setIsLoading(true)
        const result = await getListings({ category, limit: 4 })
        // Filter out the current listing
        const filteredListings = result.listings.filter((listing) => listing._id !== currentListingId)
        setListings(filteredListings.slice(0, 3)) // Show max 3 related listings
      } catch (error) {
        console.error("Error fetching related listings:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (category) {
      fetchRelatedListings()
    }
  }, [category, currentListingId, getListings])

  if (isLoading) {
    return (
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
    )
  }

  if (listings.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No similar listings found.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {listings.map((listing) => (
        <ListingCard key={listing._id} listing={listing} />
      ))}
    </div>
  )
}
