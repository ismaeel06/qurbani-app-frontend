"use client"

import { useEffect, useState, useContext } from "react"
import Head from "next/head"
import Link from "next/link"
import { ListingContext } from "../context/listingContext"
import FeaturedListings from "../components/FeaturedListings"
import CategorySelector from "../components/CategorySelector"
import HeroSection from "../components/HeroSection"
import TestimonialSection from "../components/TestimonialSection"
import HowItWorks from "../components/HowItWorks"
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/router'

export default function Home() {
  const { getFeaturedListings } = useContext(ListingContext)
  const [featuredListings, setFeaturedListings] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { t } = useTranslation()
  const router = useRouter()

  useEffect(() => {
    const loadFeaturedListings = async () => {
      try {
        setIsLoading(true)
        const listings = await getFeaturedListings()
        setFeaturedListings(listings)
      } catch (error) {
        console.error("Error loading featured listings:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadFeaturedListings()
  }, []) //REMOVED DEPENDENCY ARRAY getFeaturedlistings

  return (
    <>
      <Head>
        <title>{t('app_name')} - {t('home.hero_title')}</title>
        <meta
          name="description"
          content={t('home.hero_subtitle')}
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen">
        <HeroSection />

        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">{t('category_selection.title')}</h2>
            <CategorySelector />
          </div>
        </section>

        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold">{t('home.featured_listings')}</h2>
              <Link href="/catalog" className="text-green-600 hover:text-green-700 font-medium">
                {t('catalog.title')}
              </Link>
            </div>
            <FeaturedListings listings={featuredListings} isLoading={isLoading} />
          </div>
        </section>

        <HowItWorks />
        <TestimonialSection />
      </main>
    </>
  )
}
