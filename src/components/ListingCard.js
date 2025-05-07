"use client"

import Link from "next/link"
import Image from "next/image"
import { Heart, MessageCircle } from "react-feather"
import { useContext } from "react"
import { AuthContext } from "../context/authContext"
import { ListingContext } from "../context/listingContext"
import { ChatContext } from "../context/chatContext"
import { useRouter } from "next/router"
import { useTranslation } from "react-i18next"

// Category image mapping
const categoryImages = {
  cow: "/images/cow.png",
  goat: "/images/goat.png",
  sheep: "/images/sheep.png",
  camel: "/images/camel.png",
  buffalo: "/images/buffalo.png",
}

export default function ListingCard({ listing, viewMode = "grid" }) {
  const { user } = useContext(AuthContext)
  const { toggleFavorite } = useContext(ListingContext)
  const { startChat, setCurrentChat } = useContext(ChatContext)
  const router = useRouter()
  const { t, i18n } = useTranslation()
  const isRTL = i18n.language === 'ur'

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
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-gray-200" 
          dir={isRTL ? "rtl" : "ltr"}>
          <div className="relative h-48">
            <Image src={listing.images[0] || "/placeholder.svg"} alt={listing.title} fill className="object-cover" />
            {/* Category image in the top-left corner */}
            {listing.category && categoryImages[listing.category] && (
              <div className={`absolute top-2 ${isRTL ? 'right-2' : 'left-2'} bg-white bg-opacity-80 rounded-full p-1 shadow`}>
                <Image src={categoryImages[listing.category]} alt={listing.category} width={28} height={28} />
              </div>
            )}
            <button
              onClick={handleFavoriteToggle}
              className={`absolute top-2 ${isRTL ? 'left-2' : 'right-2'} p-2 rounded-full ${
                user && user.favorites.includes(listing._id)
                  ? "bg-red-100 text-red-500"
                  : "bg-white text-gray-400 hover:text-red-500"
              }`}
            >
              <Heart size={20} fill={user && user.favorites.includes(listing._id) ? "currentColor" : "none"} />
            </button>
          </div>
          <div className="p-4">
            <h3 className={`text-lg font-semibold mb-1 text-gray-800 ${isRTL ? 'text-right' : ''}`}>{listing.title}</h3>
            <p className={`text-gray-600 mb-2 ${isRTL ? 'text-right' : ''}`}>{listing.location}</p>
            <div className={`flex justify-between items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
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
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-gray-200"
        dir={isRTL ? "rtl" : "ltr"}>
        <div className="flex flex-col sm:flex-row">
          <div className="relative h-48 sm:h-auto sm:w-48 md:w-64">
            <Image src={listing.images[0] || "/placeholder.svg"} alt={listing.title} fill className="object-cover" />
            {/* Category image in the top-left corner of image */}
            {listing.category && categoryImages[listing.category] && (
              <div className={`absolute top-2 ${isRTL ? 'right-2' : 'left-2'} bg-white bg-opacity-80 rounded-full p-1 shadow`}>
                <Image src={categoryImages[listing.category]} alt={listing.category} width={28} height={28} />
              </div>
            )}
          </div>
          <div className="flex-1 p-4">
            <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
              <h3 className={`text-lg font-semibold mb-1 text-gray-800 ${isRTL ? 'text-right' : ''}`}>{listing.title}</h3>
              <button
                onClick={handleFavoriteToggle}
                className={`p-2 rounded-full ${
                  user && user.favorites.includes(listing._id) ? "text-red-500" : "text-gray-400 hover:text-red-500"
                }`}
              >
                <Heart size={20} fill={user && user.favorites.includes(listing._id) ? "currentColor" : "none"} />
              </button>
            </div>
            <p className={`text-gray-600 mb-2 ${isRTL ? 'text-right' : ''}`}>{listing.location}</p>
            <p className={`text-gray-700 mb-4 line-clamp-2 ${isRTL ? 'text-right' : ''}`}>{listing.description}</p>
            <div className={`flex justify-between items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
              <span className="text-xl font-bold text-green-600">Rs. {listing.price.toLocaleString()}</span>
              <div className="flex items-center gap-2">
                {/* Remove category text, only show chat button */}
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
