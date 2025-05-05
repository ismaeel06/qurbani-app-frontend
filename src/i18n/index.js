// filepath: src/i18n/index.js
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import i18next from 'i18next';
import { initReactI18next, useTranslation } from 'react-i18next';

// Initialize i18next
i18next.use(initReactI18next).init({
  lng: 'en', // Default language
  fallbackLng: 'en',
  resources: {
    en: {
      translation: {} // Will be loaded dynamically
    },
    ur: {
      translation: {} // Will be loaded dynamically
    }
  },
  interpolation: {
    escapeValue: false // React already does escaping
  }
});

// Custom hook to handle language changes
export function useLanguage() {
  const router = useRouter();
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState('en');

  useEffect(() => {
    const locale = router.locale || 'en';
    setCurrentLanguage(locale);
    i18n.changeLanguage(locale);

    // Load translation files dynamically
    import(`../../public/locales/${locale}/common.json`)
      .then((translations) => {
        i18n.addResourceBundle(locale, 'translation', translations.default);
      })
      .catch((err) => {
        console.error(`Failed to load translations for ${locale}:`, err);
      });
  }, [router.locale, i18n]);

  const changeLanguage = (locale) => {
    router.push(router.pathname, router.asPath, { locale });
  };

  return { currentLanguage, changeLanguage };
}

export default i18next;