"use client"

import { useState, useContext } from "react"
import { Menu, Bell, Search } from "react-feather"
import { AuthContext } from "../context/authContext"

export default function AdminHeader() {
  const { user } = useContext(AuthContext)
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  return (
    <header className="bg-white shadow-sm z-10">
      <div className="flex items-center justify-between h-16 px-4">
        <div className="flex items-center">
          <button
            className="text-gray-500 focus:outline-none md:hidden"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            <Menu size={24} />
          </button>

          <div className="relative mx-4 lg:mx-0">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <Search size={18} className="text-gray-400" />
            </span>
            <input
              className="w-32 sm:w-64 rounded-md pl-10 pr-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
              type="text"
              placeholder="Search..."
            />
          </div>
        </div>

        <div className="flex items-center">
          <div className="relative">
            <button className="flex mx-4 text-gray-600 focus:outline-none">
              <Bell size={24} />
              <span className="absolute top-0 right-0 inline-block w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>

          <div className="relative">
            <button className="flex items-center text-gray-700 focus:outline-none">
              <span className="mr-2">{user?.name}</span>
              <img
                className="h-8 w-8 rounded-full object-cover"
                src={user?.profileImage || "/placeholder.svg?height=32&width=32"}
                alt="Profile"
              />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
