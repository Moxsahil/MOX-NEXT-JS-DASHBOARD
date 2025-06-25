/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ hostname: "res.cloudinary.com" }],
  },

  // ✅ Disable TypeScript type checking during `next build`
  typescript: {
    ignoreBuildErrors: true,
  },

  // ✅ Disable ESLint during `next build`
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
