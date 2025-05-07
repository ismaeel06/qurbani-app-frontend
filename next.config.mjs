/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: '**.cloudinary.com', // Allows any subdomain
            pathname: '/**', // Allows all paths
          },
        ],
    },
    i18n: {
        // These are all the locales you want to support in your application
        locales: ['en', 'ur'],
        // This is the default locale you want to be used when visiting
        // a page without a locale prefix e.g. `/about`
        defaultLocale: 'en',
        // This is a list of locale domains and the default locale they
        // should handle (these are only required when setting up domain routing)
        // Note: subdomains must be included in the domain value to be matched
        // e.g. 'example.com', 'sub.example.com', 'sub.example.com/blog'
    },
};
  
export default nextConfig;