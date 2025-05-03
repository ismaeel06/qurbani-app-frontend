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
  };
  
  export default nextConfig;