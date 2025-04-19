"use client"

import { useState, useEffect, useContext } from "react"
import { useRouter } from "next/router"
import Head from "next/head"
import { ListingContext } from "../context/listingContext"
import ListingCard from "../components/ListingCard"
import FilterSidebar from "../components/FilterSidebar"
import { ChevronDown, Filter, Grid, List } from "react-feather"

export default function Catalog() {
  const router = useRouter()
  const { getListings } = useContext(ListingContext)
  const [listings, setListings] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState("grid")
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    category: "",
    minPrice: "",
    maxPrice: "",
    location: "",
    sort: "newest",
  })
  const [totalListings, setTotalListings] = useState(0)

  useEffect(() => {
    // Get category from query params if available
    if (router.query.category) {
      setFilters((prev) => ({ ...prev, category: router.query.category }))
    }
  }, [router.query])

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setIsLoading(true)

        // Create filter object for API
        const apiFilters = {}
        if (filters.category) apiFilters.category = filters.category
        if (filters.minPrice) apiFilters.minPrice = filters.minPrice
        if (filters.maxPrice) apiFilters.maxPrice = filters.maxPrice
        if (filters.location) apiFilters.location = filters.location
        if (filters.sort) apiFilters.sort = filters.sort

        const result = await getListings(apiFilters)
        setListings(result.listings)
        setTotalListings(result.total)
      } catch (error) {
        console.error("Error fetching listings:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchListings()
  }, [filters, getListings])

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }))
  }

  const clearFilters = () => {
    setFilters({
      category: "",
      minPrice: "",
      maxPrice: "",
      location: "",
      sort: "newest",
    })
  }

  const toggleFilters = () => {
    setShowFilters(!showFilters)
  }

  return (
    <>
      <Head>
        <title>Browse Cattle | Qurbani App</title>
        <meta name="description" content="Browse and find the perfect cattle for your Qurbani this Eid ul Adha." />
      </Head>

      <div className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Filter Sidebar - Desktop */}
            <div className="hidden md:block w-64 flex-shrink-0">
              <FilterSidebar filters={filters} onFilterChange={handleFilterChange} onClearFilters={clearFilters} />
            </div>

            {/* Main Content */}
            <div className="flex-1">
              {/* Header */}
              <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-800">Browse Cattle</h1>
                    <p className="text-gray-600">{totalListings} listings found</p>
                  </div>

                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    {/* Mobile Filter Button */}
                    <button
                      onClick={toggleFilters}
                      className="md:hidden flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                      <Filter size={18} />
                      <span>Filters</span>
                    </button>

                    {/* Sort Dropdown */}
                    <div className="relative flex-1 sm:flex-initial">
                      <select
                        value={filters.sort}
                        onChange={(e) => handleFilterChange("sort", e.target.value)}
                        className="appearance-none w-full bg-white border border-gray-300 rounded-lg py-2 px-4 pr-8 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      >
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="price_low">Price: Low to High</option>
                        <option value="price_high">Price: High to Low</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <ChevronDown size={16} />
                      </div>
                    </div>

                    {/* View Mode Toggles */}
                    <div className="hidden sm:flex items-center border border-gray-300 rounded-lg overflow-hidden">
                      <button
                        onClick={() => setViewMode("grid")}
                        className={`p-2 ${viewMode === "grid" ? "bg-green-100 text-green-600" : "bg-white text-gray-600"}`}
                      >
                        <Grid size={18} />
                      </button>
                      <button
                        onClick={() => setViewMode("list")}
                        className={`p-2 ${viewMode === "list" ? "bg-green-100 text-green-600" : "bg-white text-gray-600"}`}
                      >
                        <List size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile Filters */}
              {showFilters && (
                <div className="md:hidden bg-white p-4 rounded-lg shadow-sm mb-6">
                  <FilterSidebar
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onClearFilters={clearFilters}
                    isMobile={true}
                  />
                </div>
              )}

              {/* Listings */}
              {isLoading ? (
                <div
                  className={`grid ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"} gap-6`}
                >
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
              ) : listings.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                  <h3 className="text-xl font-medium text-gray-700 mb-2">No listings found</h3>
                  <p className="text-gray-500 mb-4">Try adjusting your filters or check back later for new listings.</p>
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                <div
                  className={`${
                    viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "flex flex-col gap-4"
                  }`}
                >
                  {listings.map((listing) => (
                    <ListingCard key={listing._id} listing={listing} viewMode={viewMode} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
