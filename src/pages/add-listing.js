"use client"

import { useState, useContext, useEffect } from "react"
import { useRouter } from "next/router"
import Head from "next/head"
import { Upload, X, Plus } from "react-feather"
import { ListingContext } from "../context/listingContext"
import { AuthContext } from "../context/authContext"

const categories = [
  { id: "cow", name: "Cow" },
  { id: "goat", name: "Goat" },
  { id: "sheep", name: "Sheep" },
  { id: "camel", name: "Camel" },
  { id: "buffalo", name: "Buffalo" },
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

export default function AddListing() {
  const { createListing } = useContext(ListingContext)
  const { user } = useContext(AuthContext)
  const router = useRouter()

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "cow",
    price: "",
    location: "",
    age: "",
    weight: "",
    features: [""],
  })

  const [images, setImages] = useState([])
  const [imagePreviewUrls, setImagePreviewUrls] = useState([])
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")

  // Redirect if not logged in or not a seller
  useEffect(() => {
    if (user) {
      if (user.role !== "seller" && user.role !== "admin") {
        router.push("/")
      }
    } else {
      router.push("/login")
    }
  }, [user, router])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })

    // Clear error when field is edited
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" })
    }
  }

  const handleFeatureChange = (index, value) => {
    const updatedFeatures = [...formData.features]
    updatedFeatures[index] = value
    setFormData({ ...formData, features: updatedFeatures })
  }

  const addFeatureField = () => {
    setFormData({ ...formData, features: [...formData.features, ""] })
  }

  const removeFeatureField = (index) => {
    const updatedFeatures = [...formData.features]
    updatedFeatures.splice(index, 1)
    setFormData({ ...formData, features: updatedFeatures })
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)

    if (files.length === 0) return

    // Limit to 5 images
    if (images.length + files.length > 5) {
      setErrors({ ...errors, images: "Maximum 5 images allowed" })
      return
    }

    // Check file types and sizes
    const validFiles = files.filter((file) => {
      const isValidType = file.type.startsWith("image/")
      const isValidSize = file.size <= 5 * 1024 * 1024 // 5MB

      if (!isValidType) {
        setErrors({ ...errors, images: "Only image files are allowed" })
      } else if (!isValidSize) {
        setErrors({ ...errors, images: "Image size should be less than 5MB" })
      }

      return isValidType && isValidSize
    })

    if (validFiles.length === 0) return

    setImages([...images, ...validFiles])

    // Create preview URLs
    const newPreviewUrls = validFiles.map((file) => URL.createObjectURL(file))
    setImagePreviewUrls([...imagePreviewUrls, ...newPreviewUrls])

    // Clear image error if it exists
    if (errors.images) {
      setErrors({ ...errors, images: "" })
    }
  }

  const removeImage = (index) => {
    const updatedImages = [...images]
    const updatedPreviewUrls = [...imagePreviewUrls]

    // Revoke object URL to avoid memory leaks
    URL.revokeObjectURL(updatedPreviewUrls[index])

    updatedImages.splice(index, 1)
    updatedPreviewUrls.splice(index, 1)

    setImages(updatedImages)
    setImagePreviewUrls(updatedPreviewUrls)
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.title.trim()) newErrors.title = "Title is required"
    if (!formData.description.trim()) newErrors.description = "Description is required"
    if (!formData.price) newErrors.price = "Price is required"
    if (isNaN(formData.price) || Number(formData.price) <= 0) {
      newErrors.price = "Price must be a positive number"
    }
    if (!formData.location) newErrors.location = "Location is required"

    if (images.length === 0) {
      newErrors.images = "At least one image is required"
    }

    // Filter out empty features
    const nonEmptyFeatures = formData.features.filter((feature) => feature.trim() !== "")
    setFormData({ ...formData, features: nonEmptyFeatures })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)
    setSubmitError("")

    try {
      // Create FormData object for file upload
      const listingFormData = new FormData()

      // Append text fields
      listingFormData.append("title", formData.title)
      listingFormData.append("description", formData.description)
      listingFormData.append("category", formData.category)
      listingFormData.append("price", formData.price)
      listingFormData.append("location", formData.location)

      if (formData.age) listingFormData.append("age", formData.age)
      if (formData.weight) listingFormData.append("weight", formData.weight)

      // Append features as JSON string
      const nonEmptyFeatures = formData.features.filter((feature) => feature.trim() !== "")
      listingFormData.append("features", JSON.stringify(nonEmptyFeatures))

      // Append images
      images.forEach((image) => {
        listingFormData.append("images", image)
      })

      const result = await createListing(listingFormData)

      // Redirect to the new listing page
      router.push(`/listing/${result._id}`)
    } catch (error) {
      console.error("Error creating listing:", error)
      setSubmitError(error.message || "Failed to create listing. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!user || (user.role !== "seller" && user.role !== "admin")) {
    return null // Will redirect in useEffect
  }

  return (
    <>
      <Head>
        <title>Add New Listing | Qurbani App</title>
      </Head>

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Add New Listing</h1>

            {submitError && (
              <div
                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-6"
                role="alert"
              >
                <span className="block sm:inline">{submitError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
              {/* Basic Information */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold mb-4">Basic Information</h2>

                <div className="mb-4">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className={`w-full p-2 border ${
                      errors.title ? "border-red-300" : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-green-500`}
                    placeholder="e.g., Healthy Bakra for Qurbani"
                  />
                  {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
                </div>

                <div className="mb-4">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className={`w-full p-2 border ${
                      errors.description ? "border-red-300" : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-green-500`}
                    placeholder="Provide detailed information about your animal..."
                  ></textarea>
                  {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                      Price (Rs.) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      className={`w-full p-2 border ${
                        errors.price ? "border-red-300" : "border-gray-300"
                      } rounded-md focus:outline-none focus:ring-2 focus:ring-green-500`}
                      placeholder="e.g., 50000"
                    />
                    {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
                  </div>
                </div>
              </div>

              {/* Additional Details */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold mb-4">Additional Details</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                      Location <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className={`w-full p-2 border ${
                        errors.location ? "border-red-300" : "border-gray-300"
                      } rounded-md focus:outline-none focus:ring-2 focus:ring-green-500`}
                    >
                      <option value="">Select Location</option>
                      {locations.map((location) => (
                        <option key={location} value={location}>
                          {location}
                        </option>
                      ))}
                    </select>
                    {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
                  </div>

                  <div>
                    <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                      Age (years)
                    </label>
                    <input
                      type="number"
                      id="age"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="e.g., 2"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    id="weight"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="e.g., 150"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Features</label>
                  {formData.features.map((feature, index) => (
                    <div key={index} className="flex items-center mb-2">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => handleFeatureChange(index, e.target.value)}
                        className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="e.g., Healthy, Vaccinated, etc."
                      />
                      {formData.features.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeFeatureField(index)}
                          className="ml-2 p-2 text-red-500 hover:text-red-700"
                        >
                          <X size={20} />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addFeatureField}
                    className="mt-1 flex items-center text-sm text-green-600 hover:text-green-700"
                  >
                    <Plus size={16} className="mr-1" /> Add Feature
                  </button>
                </div>
              </div>

              {/* Images */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold mb-4">
                  Images <span className="text-red-500">*</span>
                </h2>
                <p className="text-sm text-gray-600 mb-2">
                  Upload up to 5 images of your animal. First image will be the main image.
                </p>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <input
                    type="file"
                    id="images"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                  />

                  {imagePreviewUrls.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-4">
                      {imagePreviewUrls.map((url, index) => (
                        <div key={index} className="relative">
                          <img
                            src={url || "/placeholder.svg"}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-24 object-cover rounded-md"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <X size={16} />
                          </button>
                          {index === 0 && (
                            <span className="absolute bottom-1 left-1 bg-green-500 text-white text-xs px-2 py-1 rounded-md">
                              Main
                            </span>
                          )}
                        </div>
                      ))}

                      {imagePreviewUrls.length < 5 && (
                        <label
                          htmlFor="images"
                          className="flex flex-col items-center justify-center w-full h-24 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50"
                        >
                          <Upload size={24} className="text-gray-400 mb-1" />
                          <span className="text-sm text-gray-500">Add More</span>
                        </label>
                      )}
                    </div>
                  ) : (
                    <label
                      htmlFor="images"
                      className="flex flex-col items-center justify-center py-8 cursor-pointer hover:bg-gray-50"
                    >
                      <Upload size={36} className="text-gray-400 mb-2" />
                      <span className="text-gray-600">Click to upload images</span>
                      <span className="text-sm text-gray-500 mt-1">PNG, JPG, JPEG up to 5MB</span>
                    </label>
                  )}

                  {errors.images && <p className="mt-2 text-sm text-red-600">{errors.images}</p>}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    "Create Listing"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
