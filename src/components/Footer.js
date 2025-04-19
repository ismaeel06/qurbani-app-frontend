import Link from "next/link"
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "react-feather"

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-4">Qurbani App</h3>
            <p className="text-gray-300 mb-4">
              The premier platform for buying and selling cattle for Eid ul Adha. Connect directly with trusted sellers
              across Pakistan.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/catalog" className="text-gray-300 hover:text-white">
                  Browse Cattle
                </Link>
              </li>
              <li>
                <Link href="/add-listing" className="text-gray-300 hover:text-white">
                  Sell Cattle
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-gray-300 hover:text-white">
                  Login / Register
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/catalog?category=cow" className="text-gray-300 hover:text-white">
                  Cows
                </Link>
              </li>
              <li>
                <Link href="/catalog?category=goat" className="text-gray-300 hover:text-white">
                  Goats
                </Link>
              </li>
              <li>
                <Link href="/catalog?category=sheep" className="text-gray-300 hover:text-white">
                  Sheep
                </Link>
              </li>
              <li>
                <Link href="/catalog?category=camel" className="text-gray-300 hover:text-white">
                  Camels
                </Link>
              </li>
              <li>
                <Link href="/catalog?category=buffalo" className="text-gray-300 hover:text-white">
                  Buffaloes
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin size={18} className="mr-2 mt-1 flex-shrink-0" />
                <span className="text-gray-300">123 Main Street, Suite 456, Karachi, Pakistan</span>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="mr-2 flex-shrink-0" />
                <span className="text-gray-300">+92 300 1234567</span>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="mr-2 flex-shrink-0" />
                <span className="text-gray-300">info@qurbaniapp.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Qurbani App. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link href="/terms" className="text-gray-400 text-sm hover:text-white">
              Terms of Service
            </Link>
            <Link href="/privacy" className="text-gray-400 text-sm hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/faq" className="text-gray-400 text-sm hover:text-white">
              FAQ
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
