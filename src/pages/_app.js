"use client"

import { useEffect } from "react"
import { AuthProvider } from "../context/authContext"
import { ListingProvider } from "../context/listingContext"
import { ChatProvider } from "../context/chatContext"
import Layout from "../components/Layout"
import "../styles/globals.css"

function MyApp({ Component, pageProps }) {
  // Remove the server-side injected CSS when running on client
  useEffect(() => {
    const jssStyles = document.querySelector("#jss-server-side")
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles)
    }
  }, [])

  return (
    <AuthProvider>
      <ListingProvider>
        <ChatProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ChatProvider>
      </ListingProvider>
    </AuthProvider>
  )
}

export default MyApp
