"use client"

import { useEffect } from "react"
import { AuthProvider } from "../context/authContext"
import { ListingProvider } from "../context/listingContext"
import { ChatProvider } from "../context/chatContext"
import Layout from "../components/Layout"
import "../styles/globals.css"
import { I18nextProvider } from 'react-i18next'
import i18n from '../i18n'

function MyApp({ Component, pageProps }) {
  // Remove the server-side injected CSS when running on client
  useEffect(() => {
    const jssStyles = document.querySelector("#jss-server-side")
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles)
    }
  }, [])

  return (
    <I18nextProvider i18n={i18n}>
      <AuthProvider>
        <ListingProvider>
          <ChatProvider>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </ChatProvider>
        </ListingProvider>
      </AuthProvider>
    </I18nextProvider>
  )
}

export default MyApp
