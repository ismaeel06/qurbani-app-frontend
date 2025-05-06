"use client";

import Link from "next/link";
import { useContext } from "react";
import { AuthContext } from "../context/authContext";
import Image from "next/image";
import { useTranslation } from "react-i18next";

export default function HeroSection() {
  const { user } = useContext(AuthContext);
  const { t, i18n } = useTranslation();
  
  // Check if current language is Urdu to apply RTL
  const isRTL = i18n.language === "ur";

  return (
    <div className="relative bg-gradient-to-r from-green-600 to-green-800 text-white">
      <div className="absolute inset-0 bg-black opacity-30"></div>
      <div className="container mx-auto px-4 py-24 relative z-10">
        <div className={`max-w-3xl ${isRTL ? 'ml-auto text-right' : 'mr-auto text-left'}`}>
          <h1 className="text-5xl font-bold mb-6" dir={isRTL ? "rtl" : "ltr"}>
            {t('home.hero_title')}
          </h1>
          <p className="text-xl mb-8" dir={isRTL ? "rtl" : "ltr"}>
            {t('home.hero_subtitle')}
          </p>
          <div className={`flex flex-wrap gap-4 ${isRTL ? 'justify-end' : ''}`}>
            <Link
              href="/catalog"
              className={`bg-white text-green-700 hover:bg-gray-100 px-6 py-3 rounded-lg font-medium text-lg transition-colors flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
              dir={isRTL ? "rtl" : "ltr"}
            >
              <Image
                src="/images/browse-cattle-button.svg"
                alt="Browse Cattle"
                width={28}
                height={28}
              />
              {t('home.browse_button')}
            </Link>
            {!user ? (
              <Link
                href="/login"
                className="bg-transparent border-2 border-white hover:bg-white hover:text-green-700 px-6 py-3 rounded-lg font-medium text-lg transition-colors"
                dir={isRTL ? "rtl" : "ltr"}
              >
                {t('home.Sign Up / Login')}
              </Link>
            ) : (
              user.role === "seller" && (
                <Link
                  href="/add-listing"
                  className={`bg-transparent border-2 border-white hover:bg-white hover:text-green-700 px-6 py-3 rounded-lg font-medium text-lg transition-colors flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
                  dir={isRTL ? "rtl" : "ltr"}
                >
                  <Image
                    src="/images/cow.png"
                    alt="Add Listing"
                    width={28}
                    height={28}
                  />
                  {t('home.add_listing_button')}
                </Link>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
