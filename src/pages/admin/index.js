"use client"

import { useState, useEffect, useContext } from "react"
import { useRouter } from "next/router"
import Head from "next/head"
import { AuthContext } from "../../context/authContext"
import AdminSidebar from "../../components/AdminSidebar"
import { Users, ShoppingBag, AlertTriangle, DollarSign, Eye } from "react-feather"
import Link from "next/link"
import Image from "next/image"

// Mock data for frontend development
const mockStats = {
  totalUsers: 245,
  totalListings: 387,
  totalReports: 12,
  totalSales: 156,
}

const mockRecentUsers = [
  {
    _id: "1",
    name: "Ahmed Khan",
    email: "ahmed@example.com",
    role: "buyer",
    createdAt: "2023-05-15T10:30:00Z",
    profileImage: null,
  },
  {
    _id: "2",
    name: "Fatima Ali",
    email: "fatima@example.com",
    role: "seller",
    createdAt: "2023-05-14T08:20:00Z",
    profileImage: null,
  },
  {
    _id: "3",
    name: "Muhammad Usman",
    email: "usman@example.com",
    role: "buyer",
    createdAt: "2023-05-13T14:45:00Z",
    profileImage: null,
  },
  {
    _id: "4",
    name: "Ayesha Malik",
    email: "ayesha@example.com",
    role: "seller",
    createdAt: "2023-05-12T11:10:00Z",
    profileImage: null,
  },
]

const mockRecentListings = [
  {
    _id: "1",
    title: "Healthy Bakra for Qurbani",
    price: 45000,
    category: "goat",
    location: "Karachi",
    createdAt: "2023-05-15T09:20:00Z",
    seller: { name: "Ali Farms" },
    images: ["/placeholder.svg"],
  },
  {
    _id: "2",
    title: "Premium Cow for Eid",
    price: 120000,
    category: "cow",
    location: "Lahore",
    createdAt: "2023-05-14T16:30:00Z",
    seller: { name: "Malik Farms" },
    images: ["/placeholder.svg"],
  },
  {
    _id: "3",
    title: "Young Healthy Camel",
    price: 180000,
    category: "camel",
    location: "Islamabad",
    createdAt: "2023-05-13T11:45:00Z",
    seller: { name: "Desert Farms" },
    images: ["/placeholder.svg"],
  },
  {
    _id: "4",
    title: "Pair of Sheep for Qurbani",
    price: 60000,
    category: "sheep",
    location: "Peshawar",
    createdAt: "2023-05-12T14:15:00Z",
    seller: { name: "Mountain Farms" },
    images: ["/placeholder.svg"],
  },
]

const mockReports = [
  {
    _id: "1",
    type: "listing",
    reason: "Misleading information",
    status: "pending",
    createdAt: "2023-05-15T08:30:00Z",
    reporter: { name: "Imran Ahmed" },
    reportedItem: { title: "Premium Cow for Eid" },
  },
  {
    _id: "2",
    type: "user",
    reason: "Spam messages",
    status: "pending",
    createdAt: "2023-05-14T12:20:00Z",
    reporter: { name: "Sana Khan" },
    reportedItem: { title: "Ali Farms" },
  },
  {
    _id: "3",
    type: "listing",
    reason: "Fake listing",
    status: "resolved",
    createdAt: "2023-05-13T09:45:00Z",
    reporter: { name: "Zain Ali" },
    reportedItem: { title: "Young Healthy Camel" },
  },
]

export default function AdminDashboard() {
  const { user } = useContext(AuthContext)
  const router = useRouter()
  const [stats, setStats] = useState(mockStats)
  const [recentUsers, setRecentUsers] = useState(mockRecentUsers)
  const [recentListings, setRecentListings] = useState(mockRecentListings)
  const [reports, setReports] = useState(mockReports)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Check if user is admin
    if (user) {
      if (user.role !== "admin") {
        router.push("/")
      }
    } else {
      router.push("/login")
    }

    // In a real app, you would fetch data from your API here
    // For now, we're using mock data
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true)
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 500))

        // In a real app, you would fetch actual data here
        // setStats(response.data.stats)
        // setRecentUsers(response.data.recentUsers)
        // setRecentListings(response.data.recentListings)
        // setReports(response.data.reports)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [user, router])

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }

  if (!user || user.role !== "admin") {
    return null // Will redirect in useEffect
  }

  return (
    <>
      <Head>
        <title>Admin Dashboard | Qurbani App</title>
      </Head>

      <div className="flex min-h-screen bg-gray-100">
        <AdminSidebar />

        <div className="flex-1">
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                {[...Array(4)].map((_, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                    <div className="h-8 bg-gray-300 rounded w-1/2 mb-4"></div>
                    <div className="h-10 bg-gray-300 rounded w-1/3"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-blue-100 rounded-full mr-4">
                      <Users size={24} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Total Users</p>
                      <p className="text-2xl font-bold">{stats.totalUsers}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-green-100 rounded-full mr-4">
                      <ShoppingBag size={24} className="text-green-600" />
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Total Listings</p>
                      <p className="text-2xl font-bold">{stats.totalListings}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-red-100 rounded-full mr-4">
                      <AlertTriangle size={24} className="text-red-600" />
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Reports</p>
                      <p className="text-2xl font-bold">{stats.totalReports}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-yellow-100 rounded-full mr-4">
                      <DollarSign size={24} className="text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Total Sales</p>
                      <p className="text-2xl font-bold">{stats.totalSales}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Recent Users */}
              <div className="bg-white rounded-lg shadow-md">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="text-lg font-semibold">Recent Users</h2>
                  <Link href="/admin/users" className="text-sm text-blue-600 hover:text-blue-800">
                    View All
                  </Link>
                </div>
                <div className="p-6">
                  {isLoading ? (
                    <div className="space-y-4">
                      {[...Array(4)].map((_, index) => (
                        <div key={index} className="flex items-center animate-pulse">
                          <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                          <div className="flex-1">
                            <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                            <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {recentUsers.map((user) => (
                        <div key={user._id} className="flex items-center">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                            {user.profileImage ? (
                              <Image
                                src={user.profileImage || "/placeholder.svg"}
                                alt={user.name}
                                width={40}
                                height={40}
                                className="rounded-full"
                              />
                            ) : (
                              <Users size={20} className="text-gray-500" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-gray-500">
                              {user.email} • <span className="capitalize">{user.role}</span>
                            </p>
                          </div>
                          <div className="text-xs text-gray-500">{formatDate(user.createdAt)}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Listings */}
              <div className="bg-white rounded-lg shadow-md">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="text-lg font-semibold">Recent Listings</h2>
                  <Link href="/admin/listings" className="text-sm text-blue-600 hover:text-blue-800">
                    View All
                  </Link>
                </div>
                <div className="p-6">
                  {isLoading ? (
                    <div className="space-y-4">
                      {[...Array(4)].map((_, index) => (
                        <div key={index} className="flex items-center animate-pulse">
                          <div className="w-16 h-16 bg-gray-300 rounded mr-3"></div>
                          <div className="flex-1">
                            <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                            <div className="h-3 bg-gray-300 rounded w-1/2 mb-2"></div>
                            <div className="h-3 bg-gray-300 rounded w-1/4"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {recentListings.map((listing) => (
                        <div key={listing._id} className="flex items-center">
                          <div className="w-16 h-16 relative rounded overflow-hidden mr-3">
                            <Image
                              src={listing.images[0] || "/placeholder.svg"}
                              alt={listing.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{listing.title}</p>
                            <p className="text-sm text-gray-500">
                              Rs. {listing.price.toLocaleString()} • {listing.location}
                            </p>
                            <p className="text-xs text-gray-500">
                              By {listing.seller.name} • {formatDate(listing.createdAt)}
                            </p>
                          </div>
                          <Link href={`/admin/listings/${listing._id}`}>
                            <div className="p-2 text-gray-500 hover:text-blue-600">
                              <Eye size={18} />
                            </div>
                          </Link>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Recent Reports */}
            <div className="bg-white rounded-lg shadow-md">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-semibold">Recent Reports</h2>
                <Link href="/admin/reports" className="text-sm text-blue-600 hover:text-blue-800">
                  View All
                </Link>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Type
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Reported Item
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Reason
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Reporter
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Date
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Status
                      </th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {isLoading
                      ? [...Array(3)].map((_, index) => (
                          <tr key={index} className="animate-pulse">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="h-4 bg-gray-300 rounded w-16"></div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="h-4 bg-gray-300 rounded w-32"></div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="h-4 bg-gray-300 rounded w-24"></div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="h-4 bg-gray-300 rounded w-20"></div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="h-4 bg-gray-300 rounded w-16"></div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="h-4 bg-gray-300 rounded w-16"></div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                              <div className="h-4 bg-gray-300 rounded w-8 ml-auto"></div>
                            </td>
                          </tr>
                        ))
                      : reports.map((report) => (
                          <tr key={report._id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="capitalize">{report.type}</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">{report.reportedItem.title}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{report.reason}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{report.reporter.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{formatDate(report.createdAt)}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  report.status === "pending"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-green-100 text-green-800"
                                }`}
                              >
                                {report.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <Link href={`/admin/reports/${report._id}`} className="text-blue-600 hover:text-blue-900">
                                View
                              </Link>
                            </td>
                          </tr>
                        ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
