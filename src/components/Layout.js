"use client"

import { useRouter } from "next/router"
import Header from "./Header"
import Footer from "./Footer"
import { useTranslation } from "react-i18next"

export default function Layout({ children }) {
  const router = useRouter()
  const { i18n } = useTranslation()
  const isRTL = i18n.language === 'ur'

  // Don't show header and footer on admin pages
  const isAdminPage = router.pathname.startsWith("/admin")

  // Add padding to top for pages that need it (to account for fixed header)
  const needsPadding = !router.pathname.startsWith("/admin") && router.pathname !== "/"

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className={isRTL ? "font-urdu" : ""}>
      {!isAdminPage && <Header />}
      <main className={needsPadding ? "pt-16" : ""}>{children}</main>
      {!isAdminPage && <Footer />}
    </div>
  )
}
