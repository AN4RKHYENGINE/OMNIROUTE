/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: ".build/next",
  output: "standalone",
  experimental: {
    turbopack: false,
  },
};

export default nextConfig;
