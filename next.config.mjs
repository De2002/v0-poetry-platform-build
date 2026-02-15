/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'hebbkx1anhila5yf.public.blob.vercel-storage.com',
      },
    ],
    // Enable Next.js image optimization
    formats: ['image/avif', 'image/webp'],
    // Cache optimized images for 31 days
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Minimize image optimization latency
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year
  },
  // Enable swcMinify for better CSS/JS compression
  swcMinify: true,
}

export default nextConfig
