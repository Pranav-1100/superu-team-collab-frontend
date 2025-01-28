/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
      domains: ['localhost', 'vercel.app'],
    },
    async redirects() {
      return [
        {
          source: '/',
          destination: '/auth/login',
          permanent: false,
        },
      ]
    },
  }
  
  export default nextConfig;