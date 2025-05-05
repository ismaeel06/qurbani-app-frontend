"use client"

import { useState, useEffect, useContext } from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import { AuthContext } from "../context/authContext"
import { Menu, X, User, Heart, MessageCircle, ShoppingBag, LogOut, Globe } from "react-feather"
import { useTranslation } from 'react-i18next'
import { useLanguage } from "../i18n"

export default function Header() {
  const { user, logout } = useContext(AuthContext)
  const router = useRouter()
  const { t } = useTranslation()
  const { currentLanguage, changeLanguage } = useLanguage()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const handleLogout = () => {
    logout()
    router.push("/")
    setIsProfileMenuOpen(false)
    setIsMenuOpen(false)
  }

  const closeMenus = () => {
    setIsMenuOpen(false)
    setIsProfileMenuOpen(false)
    setIsLangMenuOpen(false)
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || router.pathname !== "/" ? "bg-white shadow-md" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-green-600">
            {t('app_name')}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className={`${
                router.pathname === "/"
                  ? "text-green-600 font-medium"
                  : scrolled || router.pathname !== "/"
                    ? "text-gray-700 hover:text-green-600"
                    : "text-white hover:text-green-200"
              }`}
            >
              {t('nav.home')}
            </Link>
            <Link
              href="/catalog"
              className={`${
                router.pathname === "/catalog"
                  ? "text-green-600 font-medium"
                  : scrolled || router.pathname !== "/"
                    ? "text-gray-700 hover:text-green-600"
                    : "text-white hover:text-green-200"
              }`}
            >
              {t('nav.catalog')}
            </Link>
            <Link
              href="/contact"
              className={`${
                router.pathname === "/contact"
                  ? "text-green-600 font-medium"
                  : scrolled || router.pathname !== "/"
                    ? "text-gray-700 hover:text-green-600"
                    : "text-white hover:text-green-200"
              }`}
            >
              {t('nav.contact')}
            </Link>

            {user && user.role === "seller" && (
              <Link
                href="/add-listing"
                className={`${
                  router.pathname === "/add-listing"
                    ? "text-green-600 font-medium"
                    : scrolled || router.pathname !== "/"
                      ? "text-gray-700 hover:text-green-600"
                      : "text-white hover:text-green-200"
                }`}
              >
                {t('nav.add_listing')}
              </Link>
            )}

            {user && user.role === "admin" && (
              <Link
                href="/admin"
                className={`${
                  router.pathname.startsWith("/admin")
                    ? "text-green-600 font-medium"
                    : scrolled || router.pathname !== "/"
                      ? "text-gray-700 hover:text-green-600"
                      : "text-white hover:text-green-200"
                }`}
              >
                {t('Admin')}
              </Link>
            )}
          </nav>

          {/* User Menu (Desktop) */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className={`flex items-center space-x-1 ${
                  scrolled || router.pathname !== "/"
                    ? "text-gray-700 hover:text-green-600"
                    : "text-white hover:text-green-200"
                }`}
              >
                <Globe size={18} />
                <span>{currentLanguage === 'en' ? 'English' : 'اردو'}</span>
              </button>
              
              {isLangMenuOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg py-1 z-10">
                  <button
                    onClick={() => {
                      changeLanguage('en');
                      setIsLangMenuOpen(false);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm ${
                      currentLanguage === 'en' ? 'bg-green-50 text-green-600' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => {
                      changeLanguage('ur');
                      setIsLangMenuOpen(false);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm ${
                      currentLanguage === 'ur' ? 'bg-green-50 text-green-600' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    اردو
                  </button>
                </div>
              )}
            </div>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    {user.profileImage ? (
                      <img
                        src={user.profileImage || "/placeholder.svg"}
                        alt={user.name}
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <User size={18} className="text-gray-500" />
                    )}
                  </div>
                  <span
                    className={`font-medium ${scrolled || router.pathname !== "/" ? "text-gray-700" : "text-white"}`}
                  >
                    {user.name.split(" ")[0]}
                  </span>
                </button>

                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={closeMenus}
                    >
                      <div className="flex items-center">
                        <User size={16} className="mr-2" />
                        <span>{t('nav.profile')}</span>
                      </div>
                    </Link>
                    <Link
                      href="/favorites"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={closeMenus}
                    >
                      <div className="flex items-center">
                        <Heart size={16} className="mr-2" />
                        <span>{t('nav.favorites')}</span>
                      </div>
                    </Link>
                    <Link
                      href="/chat"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={closeMenus}
                    >
                      <div className="flex items-center">
                        <MessageCircle size={16} className="mr-2" />
                        <span>{t('nav.chat')}</span>
                      </div>
                    </Link>
                    {user.role === "seller" && (
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={closeMenus}
                      >
                        <div className="flex items-center">
                          <ShoppingBag size={16} className="mr-2" />
                          <span>{t('profile.my_listings')}</span>
                        </div>
                      </Link>
                    )}
                    <Link
                      href="/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={closeMenus}
                    >
                      <div className="flex items-center">
                        <User size={16} className="mr-2" />
                        <span>{t('nav.settings')}</span>
                      </div>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <div className="flex items-center">
                        <LogOut size={16} className="mr-2" />
                        <span>{t('nav.logout')}</span>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className={`font-medium ${
                    scrolled || router.pathname !== "/"
                      ? "text-gray-700 hover:text-green-600"
                      : "text-white hover:text-green-200"
                  }`}
                >
                  {t('auth.login')}
                </Link>
                <Link
                  href="/login"
                  className={`px-4 py-2 rounded-lg font-medium ${
                    scrolled || router.pathname !== "/"
                      ? "bg-green-600 text-white hover:bg-green-700"
                      : "bg-white text-green-600 hover:bg-gray-100"
                  }`}
                >
                  {t('auth.register')}
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden focus:outline-none"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X size={24} className={scrolled || router.pathname !== "/" ? "text-gray-700" : "text-white"} />
            ) : (
              <Menu size={24} className={scrolled || router.pathname !== "/" ? "text-gray-700" : "text-white"} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <nav className="flex flex-col py-4">
            <Link
              href="/"
              className={`px-4 py-2 ${router.pathname === "/" ? "text-green-600 font-medium" : "text-gray-700"}`}
              onClick={closeMenus}
            >
              {t('nav.home')}
            </Link>
            <Link
              href="/catalog"
              className={`px-4 py-2 ${router.pathname === "/catalog" ? "text-green-600 font-medium" : "text-gray-700"}`}
              onClick={closeMenus}
            >
              {t('nav.catalog')}
            </Link>
            <Link
              href="/contact"
              className={`px-4 py-2 ${router.pathname === "/contact" ? "text-green-600 font-medium" : "text-gray-700"}`}
              onClick={closeMenus}
            >
              {t('nav.contact')}
            </Link>

            {user && user.role === "seller" && (
              <Link
                href="/add-listing"
                className={`px-4 py-2 ${
                  router.pathname === "/add-listing" ? "text-green-600 font-medium" : "text-gray-700"
                }`}
                onClick={closeMenus}
              >
                {t('nav.add_listing')}
              </Link>
            )}

            {user && user.role === "admin" && (
              <Link
                href="/admin"
                className={`px-4 py-2 ${
                  router.pathname.startsWith("/admin") ? "text-green-600 font-medium" : "text-gray-700"
                }`}
                onClick={closeMenus}
              >
                Admin
              </Link>
            )}

            {/* Language Switcher (Mobile) */}
            <div className="px-4 py-2 border-t border-gray-200 mt-2">
              <div className="flex items-center space-x-2 text-gray-700">
                <Globe size={18} />
                <span>{t('nav.language')}</span>
              </div>
              <div className="mt-2 flex space-x-4">
                <button
                  onClick={() => {
                    changeLanguage('en');
                    closeMenus();
                  }}
                  className={`px-3 py-1 rounded ${
                    currentLanguage === 'en'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                >
                  English
                </button>
                <button
                  onClick={() => {
                    changeLanguage('ur');
                    closeMenus();
                  }}
                  className={`px-3 py-1 rounded ${
                    currentLanguage === 'ur'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                >
                  اردو
                </button>
              </div>
            </div>

            {user ? (
              <>
                <div className="border-t border-gray-200 mt-2 pt-2">
                  <Link href="/profile" className="px-4 py-2 flex items-center text-gray-700" onClick={closeMenus}>
                    <User size={18} className="mr-2" />
                    <span>{t('nav.profile')}</span>
                  </Link>
                  <Link href="/favorites" className="px-4 py-2 flex items-center text-gray-700" onClick={closeMenus}>
                    <Heart size={18} className="mr-2" />
                    <span>{t('nav.favorites')}</span>
                  </Link>
                  <Link href="/chat" className="px-4 py-2 flex items-center text-gray-700" onClick={closeMenus}>
                    <MessageCircle size={18} className="mr-2" />
                    <span>{t('nav.chat')}</span>
                  </Link>
                  {user.role === "seller" && (
                    <Link href="/profile" className="px-4 py-2 flex items-center text-gray-700" onClick={closeMenus}>
                      <ShoppingBag size={18} className="mr-2" />
                      <span>{t('profile.my_listings')}</span>
                    </Link>
                  )}
                  <Link href="/settings" className="px-4 py-2 flex items-center text-gray-700" onClick={closeMenus}>
                    <User size={18} className="mr-2" />
                    <span>{t('nav.settings')}</span>
                  </Link>
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2 flex items-center text-gray-700">
                    <LogOut size={18} className="mr-2" />
                    <span>{t('nav.logout')}</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="border-t border-gray-200 mt-2 pt-2">
                <Link href="/login" className="block px-4 py-2 text-gray-700" onClick={closeMenus}>
                  {t('auth.login')}
                </Link>
                <Link
                  href="/login"
                  className="block mx-4 mt-2 px-4 py-2 bg-green-600 text-white text-center rounded-lg font-medium"
                  onClick={closeMenus}
                >
                  {t('auth.register')}
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
