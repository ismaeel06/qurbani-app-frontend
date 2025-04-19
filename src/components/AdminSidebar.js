"use client"

import { useRouter } from "next/router"
import Link from "next/link"
import { Home, Users, ShoppingBag, AlertTriangle, Settings, LogOut } from "react-feather"
import { useContext } from "react"
import { AuthContext } from "../context/authContext"

export default function AdminSidebar() {
  const router = useRouter()
  const { logout } = useContext(AuthContext)

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const isActive = (path) => {
    return router.pathname === path
  }

  return (
    <div className="bg-gray-800 text-white w-64 flex-shrink-0 hidden md:block">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-xl font-bold">Qurbani Admin</h2>
      </div>

      <nav className="mt-4">
        <ul>
          <li>
            <Link href="/admin">
              <div
                className={`flex items-center px-4 py-3 ${isActive("/admin") ? "bg-gray-700" : "hover:bg-gray-700"}`}
              >
                <Home size={20} className="mr-3" />
                <span>Dashboard</span>
              </div>
            </Link>
          </li>
          <li>
            <Link href="/admin/users">
              <div
                className={`flex items-center px-4 py-3 ${isActive("/admin/users") ? "bg-gray-700" : "hover:bg-gray-700"}`}
              >
                <Users size={20} className="mr-3" />
                <span>Users</span>
              </div>
            </Link>
          </li>
          <li>
            <Link href="/admin/listings">
              <div
                className={`flex items-center px-4 py-3 ${isActive("/admin/listings") ? "bg-gray-700" : "hover:bg-gray-700"}`}
              >
                <ShoppingBag size={20} className="mr-3" />
                <span>Listings</span>
              </div>
            </Link>
          </li>
          <li>
            <Link href="/admin/reports">
              <div
                className={`flex items-center px-4 py-3 ${isActive("/admin/reports") ? "bg-gray-700" : "hover:bg-gray-700"}`}
              >
                <AlertTriangle size={20} className="mr-3" />
                <span>Reports</span>
              </div>
            </Link>
          </li>
          <li>
            <Link href="/admin/settings">
              <div
                className={`flex items-center px-4 py-3 ${isActive("/admin/settings") ? "bg-gray-700" : "hover:bg-gray-700"}`}
              >
                <Settings size={20} className="mr-3" />
                <span>Settings</span>
              </div>
            </Link>
          </li>
        </ul>
      </nav>

      <div className="absolute bottom-0 w-64 border-t border-gray-700">
        <button onClick={handleLogout} className="flex items-center px-4 py-3 w-full hover:bg-gray-700 text-left">
          <LogOut size={20} className="mr-3" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  )
}
