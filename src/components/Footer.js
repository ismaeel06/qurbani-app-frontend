import Link from "next/link"
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "react-feather"
import { useTranslation } from "react-i18next"

export default function Footer() {
  const { t, i18n } = useTranslation()
  const isRTL = i18n.language === 'ur'

  return (
    <footer className="bg-gray-800 text-white" dir={isRTL ? "rtl" : "ltr"}>
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div className={isRTL ? 'text-right ml-auto' : 'text-left'}>
            <h3 className="text-xl font-bold mb-4">{t('app_name')}</h3>
            <p className="text-gray-300 mb-4">
              {t('footer.about_description') || "The premier platform for buying and selling cattle for Eid ul Adha. Connect directly with trusted sellers across Pakistan."}
            </p>
            <div className={`flex items-center space-x-4 ${isRTL ? 'flex-row-reverse space-x-reverse justify-end' : ''}`}>
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
          <div className={isRTL ? 'text-right' : 'text-left'}>
            <h3 className="text-lg font-semibold mb-4">
              {t('footer.quick_links') || "Quick Links"}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white">{t('nav.home')}</Link>
              </li>
              <li>
                <Link href="/catalog" className="text-gray-300 hover:text-white">{t('nav.catalog')}</Link>
              </li>
              <li>
                <Link href="/add-listing" className="text-gray-300 hover:text-white">{t('nav.add_listing')}</Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white">{t('nav.contact')}</Link>
              </li>
              <li>
                <Link href="/login" className="text-gray-300 hover:text-white">
                  {t('auth.login')} / {t('auth.register')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className={isRTL ? 'text-right' : 'text-left'}>
            <h3 className="text-lg font-semibold mb-4">{t('catalog.categories') || "Categories"}</h3>
            <ul className="space-y-2">
              <li><Link href="/catalog?category=cow" className="text-gray-300 hover:text-white">{t('categories.cow')}</Link></li>
              <li><Link href="/catalog?category=goat" className="text-gray-300 hover:text-white">{t('categories.goat')}</Link></li>
              <li><Link href="/catalog?category=sheep" className="text-gray-300 hover:text-white">{t('categories.sheep')}</Link></li>
              <li><Link href="/catalog?category=camel" className="text-gray-300 hover:text-white">{t('categories.camel')}</Link></li>
              <li><Link href="/catalog?category=buffalo" className="text-gray-300 hover:text-white">{t('categories.buffalo')}</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className={isRTL ? 'text-right' : 'text-left'}>
            <h3 className="text-lg font-semibold mb-4">{t('footer.contact_us')}</h3>
            <ul className="space-y-3">
              <li className={`flex items-start ${isRTL ? 'flex-row-reverse' : ''}`}>
                <MapPin size={18} className={`${isRTL ? 'ml-2' : 'mr-2'} mt-1`} />
                <span className="text-gray-300">{t('footer.address')}</span>
              </li>
              <li className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Phone size={18} className={`${isRTL ? 'ml-2' : 'mr-2'}`} />
                <span className="text-gray-300">+92 300 1234567</span>
              </li>
              <li className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Mail size={18} className={`${isRTL ? 'ml-2' : 'mr-2'}`} />
                <span className="text-gray-300">info@qurbaniapp.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Footer Row */}
        <div className={`border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row ${isRTL ? 'md:flex-row-reverse' : ''} justify-between items-center`}>
          <p className={`text-gray-400 text-sm mb-4 md:mb-0 ${isRTL ? 'text-right' : ''}`}>
            &copy; {new Date().getFullYear()} {t('app_name')}. {t('footer.copyright')}
          </p>
          <div className={`flex items-center space-x-6 ${isRTL ? 'flex-row-reverse space-x-reverse justify-end' : ''}`}>
            <Link href="/terms" className="text-gray-400 text-sm hover:text-white">{t('footer.terms')}</Link>
            <Link href="/privacy" className="text-gray-400 text-sm hover:text-white">{t('footer.privacy')}</Link>
            <Link href="/faq" className="text-gray-400 text-sm hover:text-white">{t('footer.faq')}</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
