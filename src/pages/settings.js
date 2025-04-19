"use client"

import { useState, useContext, useEffect } from "react"
import { useRouter } from "next/router"
import Head from "next/head"
import { User, Lock, Phone, Mail, Info } from "react-feather"
import { AuthContext } from "../context/authContext"

export default function Settings() {
  const { user, updateProfile, changePassword, logout } = useContext(AuthContext)
  const router = useRouter()

  const [activeTab, setActiveTab] = useState("profile")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  // Profile form state
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
  })

  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  // Profile image state
  const [profileImage, setProfileImage] = useState(null)
  const [profileImagePreview, setProfileImagePreview] = useState("")

  // Initialize form data with user data
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        location: user.location || "",
        bio: user.bio || "",
      })

      if (user.profileImage) {
        setProfileImagePreview(user.profileImage)
      }
    } else {
      router.push("/login")
    }
  }, [user, router])

  const handleProfileChange = (e) => {
    const { name, value } = e.target
    setProfileData({ ...profileData, [name]: value })
  }

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordData({ ...passwordData, [name]: value })
  }

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Check file type and size
    const isValidType = file.type.startsWith("image/")
    const isValidSize = file.size <= 2 * 1024 * 1024 // 2MB

    if (!isValidType) {
      setErrorMessage("Please upload an image file")
      return
    }

    if (!isValidSize) {
      setErrorMessage("Image size should be less than 2MB")
      return
    }

    setProfileImage(file)
    setProfileImagePreview(URL.createObjectURL(file))
    setErrorMessage("")
  }

  const validateProfileForm = () => {
    if (!profileData.name.trim()) {
      setErrorMessage("Name is required")
      return false
    }

    if (!profileData.email.trim()) {
      setErrorMessage("Email is required")
      return false
    }

    if (!/\S+@\S+\.\S+/.test(profileData.email)) {
      setErrorMessage("Please enter a valid email")
      return false
    }

    if (profileData.phone && !/^\d{10,11}$/.test(profileData.phone)) {
      setErrorMessage("Please enter a valid phone number")
      return false
    }

    return true
  }

  const validatePasswordForm = () => {
    if (!passwordData.currentPassword) {
      setErrorMessage("Current password is required")
      return false
    }

    if (!passwordData.newPassword) {
      setErrorMessage("New password is required")
      return false
    }

    if (passwordData.newPassword.length < 6) {
      setErrorMessage("New password must be at least 6 characters")
      return false
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setErrorMessage("Passwords do not match")
      return false
    }

    return true
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault()

    if (!validateProfileForm()) return

    setIsSubmitting(true)
    setErrorMessage("")
    setSuccessMessage("")

    try {
      // Create FormData for profile image upload
      const formData = new FormData()
      formData.append("name", profileData.name)
      formData.append("email", profileData.email)
      formData.append("phone", profileData.phone)
      formData.append("location", profileData.location)
      formData.append("bio", profileData.bio)

      if (profileImage) {
        formData.append("profileImage", profileImage)
      }

      await updateProfile(formData)
      setSuccessMessage("Profile updated successfully")
    } catch (error) {
      console.error("Error updating profile:", error)
      setErrorMessage(error.message || "Failed to update profile")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()

    if (!validatePasswordForm()) return

    setIsSubmitting(true)
    setErrorMessage("")
    setSuccessMessage("")

    try {
      await changePassword(passwordData.currentPassword, passwordData.newPassword)
      setSuccessMessage("Password changed successfully")

      // Reset password form
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
    } catch (error) {
      console.error("Error changing password:", error)
      setErrorMessage(error.message || "Failed to change password")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  if (!user) {
    return null // Will redirect in useEffect
  }

  return (
    <>
      <Head>
        <title>Settings | Qurbani App</title>
      </Head>

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Account Settings</h1>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="flex flex-col md:flex-row">
                {/* Sidebar */}
                <div className="w-full md:w-64 bg-gray-50 p-4 border-r border-gray-200">
                  <nav className="space-y-1">
                    <button
                      onClick={() => setActiveTab("profile")}
                      className={`flex items-center px-3 py-2 w-full text-left rounded-md ${
                        activeTab === "profile" ? "bg-green-100 text-green-700" : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <User size={18} className="mr-3" />
                      Profile Information
                    </button>

                    <button
                      onClick={() => setActiveTab("password")}
                      className={`flex items-center px-3 py-2 w-full text-left rounded-md ${
                        activeTab === "password" ? "bg-green-100 text-green-700" : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <Lock size={18} className="mr-3" />
                      Change Password
                    </button>

                    <button
                      onClick={() => setActiveTab("phone")}
                      className={`flex items-center px-3 py-2 w-full text-left rounded-md ${
                        activeTab === "phone" ? "bg-green-100 text-green-700" : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <Phone size={18} className="mr-3" />
                      Phone Number
                    </button>

                    <button
                      onClick={() => setActiveTab("email")}
                      className={`flex items-center px-3 py-2 w-full text-left rounded-md ${
                        activeTab === "email" ? "bg-green-100 text-green-700" : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <Mail size={18} className="mr-3" />
                      Email Address
                    </button>

                    <button
                      onClick={() => setActiveTab("account")}
                      className={`flex items-center px-3 py-2 w-full text-left rounded-md ${
                        activeTab === "account" ? "bg-green-100 text-green-700" : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <Info size={18} className="mr-3" />
                      Account
                    </button>
                  </nav>
                </div>

                {/* Content */}
                <div className="flex-1 p-6">
                  {successMessage && (
                    <div
                      className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded relative mb-4"
                      role="alert"
                    >
                      <span className="block sm:inline">{successMessage}</span>
                    </div>
                  )}

                  {errorMessage && (
                    <div
                      className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-4"
                      role="alert"
                    >
                      <span className="block sm:inline">{errorMessage}</span>
                    </div>
                  )}

                  {/* Profile Information */}
                  {activeTab === "profile" && (
                    <div>
                      <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
                      <form onSubmit={handleProfileSubmit}>
                        <div className="mb-6">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Profile Picture</label>
                          <div className="flex items-center">
                            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mr-4 overflow-hidden">
                              {profileImagePreview ? (
                                <img
                                  src={profileImagePreview || "/placeholder.svg"}
                                  alt="Profile Preview"
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <User size={32} className="text-gray-500" />
                              )}
                            </div>
                            <div>
                              <input
                                type="file"
                                id="profileImage"
                                accept="image/*"
                                onChange={handleProfileImageChange}
                                className="hidden"
                              />
                              <label
                                htmlFor="profileImage"
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md cursor-pointer hover:bg-gray-300"
                              >
                                Change Photo
                              </label>
                              <p className="text-xs text-gray-500 mt-1">JPG, PNG or GIF (Max. 2MB)</p>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                              Full Name
                            </label>
                            <input
                              type="text"
                              id="name"
                              name="name"
                              value={profileData.name}
                              onChange={handleProfileChange}
                              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                          </div>

                          <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                              Email Address
                            </label>
                            <input
                              type="email"
                              id="email"
                              name="email"
                              value={profileData.email}
                              onChange={handleProfileChange}
                              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                              Phone Number
                            </label>
                            <input
                              type="tel"
                              id="phone"
                              name="phone"
                              value={profileData.phone}
                              onChange={handleProfileChange}
                              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                          </div>

                          <div>
                            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                              Location
                            </label>
                            <input
                              type="text"
                              id="location"
                              name="location"
                              value={profileData.location}
                              onChange={handleProfileChange}
                              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                              placeholder="e.g., Karachi, Pakistan"
                            />
                          </div>
                        </div>

                        <div className="mb-4">
                          <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                            Bio
                          </label>
                          <textarea
                            id="bio"
                            name="bio"
                            value={profileData.bio}
                            onChange={handleProfileChange}
                            rows={3}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Tell others about yourself..."
                          ></textarea>
                        </div>

                        <div className="flex justify-end">
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
                          >
                            {isSubmitting ? "Saving..." : "Save Changes"}
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Change Password */}
                  {activeTab === "password" && (
                    <div>
                      <h2 className="text-xl font-semibold mb-4">Change Password</h2>
                      <form onSubmit={handlePasswordSubmit}>
                        <div className="mb-4">
                          <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                            Current Password
                          </label>
                          <input
                            type="password"
                            id="currentPassword"
                            name="currentPassword"
                            value={passwordData.currentPassword}
                            onChange={handlePasswordChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                          />
                        </div>

                        <div className="mb-4">
                          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                            New Password
                          </label>
                          <input
                            type="password"
                            id="newPassword"
                            name="newPassword"
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                          />
                          <p className="text-xs text-gray-500 mt-1">Password must be at least 6 characters long</p>
                        </div>

                        <div className="mb-6">
                          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                            Confirm New Password
                          </label>
                          <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                          />
                        </div>

                        <div className="flex justify-end">
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
                          >
                            {isSubmitting ? "Changing..." : "Change Password"}
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Phone Number */}
                  {activeTab === "phone" && (
                    <div>
                      <h2 className="text-xl font-semibold mb-4">Phone Number</h2>
                      <p className="text-gray-600 mb-4">
                        Your current phone number is <strong>{user.phone || "Not set"}</strong>
                      </p>
                      <p className="text-gray-600 mb-6">
                        To change your phone number, you need to verify your identity with an OTP.
                      </p>
                      <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
                        Change Phone Number
                      </button>
                    </div>
                  )}

                  {/* Email Address */}
                  {activeTab === "email" && (
                    <div>
                      <h2 className="text-xl font-semibold mb-4">Email Address</h2>
                      <p className="text-gray-600 mb-4">
                        Your current email address is <strong>{user.email}</strong>
                      </p>
                      <p className="text-gray-600 mb-6">
                        To change your email address, enter your new email below. We'll send a verification link to
                        confirm the change.
                      </p>
                      <form className="mb-6">
                        <div className="mb-4">
                          <label htmlFor="newEmail" className="block text-sm font-medium text-gray-700 mb-1">
                            New Email Address
                          </label>
                          <input
                            type="email"
                            id="newEmail"
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                          />
                        </div>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                        >
                          Change Email
                        </button>
                      </form>
                    </div>
                  )}

                  {/* Account */}
                  {activeTab === "account" && (
                    <div>
                      <h2 className="text-xl font-semibold mb-4">Account</h2>
                      <div className="mb-6">
                        <h3 className="text-lg font-medium mb-2">Account Type</h3>
                        <p className="text-gray-600">
                          You are currently registered as a <strong className="capitalize">{user.role}</strong>
                        </p>
                      </div>

                      <div className="mb-6">
                        <h3 className="text-lg font-medium mb-2">Delete Account</h3>
                        <p className="text-gray-600 mb-4">
                          Once you delete your account, there is no going back. Please be certain.
                        </p>
                        <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                          Delete Account
                        </button>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium mb-2">Logout</h3>
                        <p className="text-gray-600 mb-4">Sign out from all devices.</p>
                        <button
                          onClick={handleLogout}
                          className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
