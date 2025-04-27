"use client"

import Link from "next/link"
import { useContext } from "react"
import { AuthContext } from "../context/authContext"
import Image from "next/image"

export default function HeroSection() {
  const { user } = useContext(AuthContext)

  return (
    <div className="relative bg-gradient-to-r from-green-600 to-green-800 text-white">
      <div className="absolute inset-0 bg-black opacity-30"></div>
      <div className="container mx-auto px-4 py-24 relative z-10">
        <div className="max-w-3xl">
          <h1 className="text-5xl font-bold mb-6">Find the Perfect Cattle for Your Qurbani</h1>
          <p className="text-xl mb-8">
            Connect directly with trusted sellers to purchase cows, goats, sheep, and camels for Eid ul Adha.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/catalog"
              className="bg-white text-green-700 hover:bg-gray-100 px-6 py-3 rounded-lg font-medium text-lg transition-colors flex items-center gap-2"
            >
              <Image src="/images/browse-cattle-button.svg" alt="Browse Cattle" width={28} height={28} />
              Browse Cattle
            </Link>
            {!user ? (
              <Link
                href="/login"
                className="bg-transparent border-2 border-white hover:bg-white hover:text-green-700 px-6 py-3 rounded-lg font-medium text-lg transition-colors"
              >
                Sign Up / Login
              </Link>
            ) : (
              user.role === "seller" && (
                <Link
                  href="/add-listing"
                  className="bg-transparent border-2 border-white hover:bg-white hover:text-green-700 px-6 py-3 rounded-lg font-medium text-lg transition-colors flex items-center gap-2"
                >
                  <Image src="/images/cow.png" alt="Add Listing" width={28} height={28} />
                  Add Listing
                </Link>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
