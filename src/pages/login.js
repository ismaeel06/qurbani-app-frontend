"use client"

import { useState, useContext, useEffect } from "react"
import { useRouter } from "next/router"
import Head from "next/head"
import Link from "next/link"
import { AuthContext } from "../context/authContext"

export default function Login() {
  const [isLogin, setIsLogin] = useState(true)
  const [showOtpForm, setShowOtpForm] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "buyer",
    otp: "",
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [registeredPhone, setRegisteredPhone] = useState("")

  const { login, register, verifyOTP, user, error } = useContext(AuthContext)
  const router = useRouter()

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push("/")
    }
  }, [user, router])

  const validateForm = () => {
    const newErrors = {}

    if (!isLogin) {
      if (!formData.name.trim()) newErrors.name = "Name is required"
      if (!formData.phone.trim()) newErrors.phone = "Phone number is required"
      if (!/^\d{10,11}$/.test(formData.phone)) newErrors.phone = "Enter a valid phone number"
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match"
      }
    }

    if (!formData.email.trim()) newErrors.email = "Email is required"
    if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Enter a valid email"
    if (!formData.password) newErrors.password = "Password is required"
    if (!isLogin && formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    if (showOtpForm && !formData.otp.trim()) {
      newErrors.otp = "OTP is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      if (showOtpForm) {
        await verifyOTP(registeredPhone, formData.otp)
        router.push("/")
      } else if (isLogin) {
        await login(formData.email, formData.password)
        router.push("/")
      } else {
        const result = await register({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          role: formData.role,
        })

        setRegisteredPhone(formData.phone)
        setShowOtpForm(true)
      }
    } catch (err) {
      console.error("Error:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleForm = () => {
    setIsLogin(!isLogin)
    setShowOtpForm(false)
    setErrors({})
    setFormData({
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      role: "buyer",
      otp: "",
    })
  }

  return (
    <>
      <Head>
        <title>{isLogin ? "Login" : "Register"} | Qurbani App</title>
      </Head>

      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              {showOtpForm ? "Verify OTP" : isLogin ? "Sign in to your account" : "Create a new account"}
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              {showOtpForm
                ? "Enter the OTP sent to your phone"
                : isLogin
                  ? "Don't have an account?"
                  : "Already have an account?"}
              {!showOtpForm && (
                <button
                  type="button"
                  onClick={toggleForm}
                  className="ml-1 font-medium text-green-600 hover:text-green-500"
                >
                  {isLogin ? "Sign up" : "Sign in"}
                </button>
              )}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <input type="hidden" name="remember" value="true" />
            <div className="rounded-md shadow-sm -space-y-px">
              {showOtpForm ? (
                <div className="mb-4">
                  <label htmlFor="otp" className="sr-only">
                    OTP
                  </label>
                  <input
                    id="otp"
                    name="otp"
                    type="text"
                    autoComplete="one-time-code"
                    value={formData.otp}
                    onChange={handleChange}
                    className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${
                      errors.otp ? "border-red-300" : "border-gray-300"
                    } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm`}
                    placeholder="Enter OTP"
                  />
                  {errors.otp && <p className="mt-2 text-sm text-red-600">{errors.otp}</p>}
                </div>
              ) : (
                <>
                  {!isLogin && (
                    <div className="mb-4">
                      <label htmlFor="name" className="sr-only">
                        Full Name
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        autoComplete="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`appearance-none rounded-t-md relative block w-full px-3 py-2 border ${
                          errors.name ? "border-red-300" : "border-gray-300"
                        } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm`}
                        placeholder="Full Name"
                      />
                      {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name}</p>}
                    </div>
                  )}

                  <div className="mb-4">
                    <label htmlFor="email" className="sr-only">
                      Email address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`appearance-none rounded-t-md relative block w-full px-3 py-2 border ${
                        errors.email ? "border-red-300" : "border-gray-300"
                      } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm`}
                      placeholder="Email address"
                    />
                    {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email}</p>}
                  </div>

                  {!isLogin && (
                    <div className="mb-4">
                      <label htmlFor="phone" className="sr-only">
                        Phone Number
                      </label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        autoComplete="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`appearance-none relative block w-full px-3 py-2 border ${
                          errors.phone ? "border-red-300" : "border-gray-300"
                        } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm`}
                        placeholder="Phone Number"
                      />
                      {errors.phone && <p className="mt-2 text-sm text-red-600">{errors.phone}</p>}
                    </div>
                  )}

                  <div className="mb-4">
                    <label htmlFor="password" className="sr-only">
                      Password
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`appearance-none relative block w-full px-3 py-2 border ${
                        errors.password ? "border-red-300" : "border-gray-300"
                      } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm`}
                      placeholder="Password"
                    />
                    {errors.password && <p className="mt-2 text-sm text-red-600">{errors.password}</p>}
                  </div>

                  {!isLogin && (
                    <>
                      <div className="mb-4">
                        <label htmlFor="confirmPassword" className="sr-only">
                          Confirm Password
                        </label>
                        <input
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          autoComplete="new-password"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className={`appearance-none relative block w-full px-3 py-2 border ${
                            errors.confirmPassword ? "border-red-300" : "border-gray-300"
                          } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm`}
                          placeholder="Confirm Password"
                        />
                        {errors.confirmPassword && (
                          <p className="mt-2 text-sm text-red-600">{errors.confirmPassword}</p>
                        )}
                      </div>

                      <div className="mb-4">
                        <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                          I want to
                        </label>
                        <select
                          id="role"
                          name="role"
                          value={formData.role}
                          onChange={handleChange}
                          className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        >
                          <option value="buyer">Buy cattle</option>
                          <option value="seller">Sell cattle</option>
                        </select>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>

            {isLogin && !showOtpForm && (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <Link href="/forgot-password" className="font-medium text-green-600 hover:text-green-500">
                    Forgot your password?
                  </Link>
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
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
                ) : showOtpForm ? (
                  "Verify OTP"
                ) : isLogin ? (
                  "Sign in"
                ) : (
                  "Sign up"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
