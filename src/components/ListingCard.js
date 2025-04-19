"use client"

import Link from "next/link"
import Image from "next/image"
import { Heart, MessageCircle } from "react-feather"
import { useContext } from "react"
import { AuthContext } from "../context/authContext"
import { ListingContext } from "../context/listingContext"
import { ChatContext } from "../context/chatContext"
import { useRouter } from "next/router"

export default function ListingCard({ listing, viewMode = "grid" }) {
  const { user } = useContext(AuthContext)
  const { toggleFavorite } = useContext(ListingContext)
  const { startChat, setCurrentChat } = useContext(ChatContext)
  const router = useRouter()

  const handleFavoriteToggle = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (!user) {
      router.push("/login")
      return
    }

    await toggleFavorite(listing._id)
  }

  const handleChatStart = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (!user) {
      router.push("/login")
      return
    }

    try {
      const chat = await startChat(listing._id, listing.seller._id)
      setCurrentChat(chat)
      router.push(`/chat?id=${chat._id}`)
    } catch (error) {
      console.error("Error starting chat:", error)
    }
  }

  if (viewMode === "grid") {
    return (
      <Link href={`/listing/${listing._id}`}>
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-gray-200">
          <div className="relative h-48">
            <Image src={listing.images[0] || "/placeholder.svg"} alt={listing.title} fill className="object-cover" />
            <button
              onClick={handleFavoriteToggle}
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
              <button onClick={handleChatStart} className="p-2 text-gray-500 hover:text-green-600">
                <MessageCircle size={20} />
              </button>
            </div>
          </div>
        </div>
      </Link>
    )
  }

  // List view
  return (
    <Link href={`/listing/${listing._id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-gray-200">
        <div className="flex flex-col sm:flex-row">
          <div className="relative h-48 sm:h-auto sm:w-48 md:w-64">
            <Image src={listing.images[0] || "/placeholder.svg"} alt={listing.title} fill className="object-cover" />
          </div>
          <div className="flex-1 p-4">
            <div className="flex justify-between">
              <h3 className="text-lg font-semibold mb-1 text-gray-800">{listing.title}</h3>
              <button
                onClick={handleFavoriteToggle}
                className={`p-2 rounded-full ${
                  user && user.favorites.includes(listing._id) ? "text-red-500" : "text-gray-400 hover:text-red-500"
                }`}
              >
                <Heart size={20} fill={user && user.favorites.includes(listing._id) ? "currentColor" : "none"} />
              </button>
            </div>
            <p className="text-gray-600 mb-2">{listing.location}</p>
            <p className="text-gray-700 mb-4 line-clamp-2">{listing.description}</p>
            <div className="flex justify-between items-center">
              <span className="text-xl font-bold text-green-600">Rs. {listing.price.toLocaleString()}</span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">{listing.category}</span>
                <button onClick={handleChatStart} className="p-2 text-gray-500 hover:text-green-600">
                  <MessageCircle size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
