import type { NextConfig } from "next";

// Security headers (Content-Security-Policy, X-Frame-Options: DENY, X-Content-Type-Options: nosniff,
// Referrer-Policy, Permissions-Policy, Strict-Transport-Security) are centrally managed in middleware.ts.
const nextConfig: NextConfig = {
  images: {
    // Enable modern image formats — Next.js will serve WebP/AVIF automatically
    formats: ['image/avif', 'image/webp'],
    // Allow images from Supabase storage (public bucket)
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: '**.supabase.in',
        pathname: '/storage/v1/object/public/**',
      },
    ],
    // Reduce image sizes served to mobile devices
    deviceSizes: [390, 430, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
};

export default nextConfig;
