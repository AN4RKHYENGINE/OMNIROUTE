/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: ".build/next",
  output: "standalone",
  serverComponentsExternalPackages: ["@ngrok/ngrok", "keytar", "koffi", "tls-client-node"],
  webpack: (config, { isServer }) => {
    config.externals.push("@ngrok/ngrok", "keytar", "koffi", "tls-client-node");
    return config;
  },
};

export default nextConfig;
