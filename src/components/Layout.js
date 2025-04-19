"use client"

import { useRouter } from "next/router"
import Header from "./Header"
import Footer from "./Footer"

export default function Layout({ children }) {
  const router = useRouter()

  // Don't show header and footer on admin pages
  const isAdminPage = router.pathname.startsWith("/admin")

  // Add padding to top for pages that need it (to account for fixed header)
  const needsPadding = !router.pathname.startsWith("/admin") && router.pathname !== "/"

  return (
    <>
      {!isAdminPage && <Header />}
      <main className={needsPadding ? "pt-16" : ""}>{children}</main>
      {!isAdminPage && <Footer />}
    </>
  )
}
