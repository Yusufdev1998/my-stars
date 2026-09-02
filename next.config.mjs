/** @type {import('next').NextConfig} */
const nextConfig = {
  // PWA configuration
  experimental: {
    pwa: {
      enabled: true,
      scope: "/",
      sw: "/sw.js",
    },
  },
};

export default nextConfig;
