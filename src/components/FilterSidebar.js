"use client"

import { useState, useEffect } from "react"
import { X } from "react-feather"

const categories = [
  { id: "cow", name: "Cows" },
  { id: "goat", name: "Goats" },
  { id: "sheep", name: "Sheep" },
  { id: "camel", name: "Camels" },
  { id: "buffalo", name: "Buffaloes" },
]

const locations = [
  "Karachi",
  "Lahore",
  "Islamabad",
  "Peshawar",
  "Quetta",
  "Multan",
  "Faisalabad",
  "Rawalpindi",
  "Hyderabad",
]

export default function FilterSidebar({ filters, onFilterChange, onClearFilters, isMobile = false }) {
  const [priceRange, setPriceRange] = useState({
    min: filters.minPrice || "",
    max: filters.maxPrice || "",
  })

  useEffect(() => {
    setPriceRange({
      min: filters.minPrice || "",
      max: filters.maxPrice || "",
    })
  }, [filters.minPrice, filters.maxPrice])

  const handlePriceChange = (e) => {
    const { name, value } = e.target
    setPriceRange((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const applyPriceRange = () => {
    onFilterChange("minPrice", priceRange.min)
    onFilterChange("maxPrice", priceRange.max)
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Filters</h3>
        {isMobile && (
          <button onClick={() => onClearFilters()} className="text-gray-500">
            <X size={20} />
          </button>
        )}
      </div>

      {/* Categories */}
      <div className="mb-6">
        <h4 className="font-medium mb-2">Category</h4>
        <div className="space-y-2">
          <div className="flex items-center">
            <input
              id="category-all"
              type="radio"
              name="category"
              checked={!filters.category}
              onChange={() => onFilterChange("category", "")}
              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
            />
            <label htmlFor="category-all" className="ml-2 text-gray-700">
              All Categories
            </label>
          </div>

          {categories.map((category) => (
            <div key={category.id} className="flex items-center">
              <input
                id={`category-${category.id}`}
                type="radio"
                name="category"
                checked={filters.category === category.id}
                onChange={() => onFilterChange("category", category.id)}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
              />
              <label htmlFor={`category-${category.id}`} className="ml-2 text-gray-700">
                {category.name}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <h4 className="font-medium mb-2">Price Range (Rs.)</h4>
        <div className="flex items-center gap-2">
          <input
            type="number"
            name="min"
            placeholder="Min"
            value={priceRange.min}
            onChange={handlePriceChange}
            className="w-full p-2 border border-gray-300 rounded-md text-sm"
          />
          <span className="text-gray-500">-</span>
          <input
            type="number"
            name="max"
            placeholder="Max"
            value={priceRange.max}
            onChange={handlePriceChange}
            className="w-full p-2 border border-gray-300 rounded-md text-sm"
          />
        </div>
        <button
          onClick={applyPriceRange}
          className="mt-2 w-full py-1 bg-gray-100 text-gray-700 rounded-md text-sm hover:bg-gray-200"
        >
          Apply
        </button>
      </div>

      {/* Location */}
      <div className="mb-6">
        <h4 className="font-medium mb-2">Location</h4>
        <select
          value={filters.location}
          onChange={(e) => onFilterChange("location", e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md text-sm"
        >
          <option value="">All Locations</option>
          {locations.map((location) => (
            <option key={location} value={location}>
              {location}
            </option>
          ))}
        </select>
      </div>

      {/* Clear Filters Button */}
      <button onClick={onClearFilters} className="w-full py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
        Clear All Filters
      </button>
    </div>
  )
}
