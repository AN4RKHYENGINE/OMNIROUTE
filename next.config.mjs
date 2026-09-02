/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    serverExternalPackages: ["@ngrok/ngrok", "keytar", "koffi", "tls-client-node"],
  },
  webpack(config, { isServer }) {
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push(({ request }, callback) => {
        if (
          request === "@ngrok/ngrok" ||
          request === "keytar" ||
          request === "koffi" ||
          request === "tls-client-node"
        ) {
          return callback(null, `commonjs ${request}`);
        }
        callback();
      });
    }
    return config;
  },
};

export default nextConfig;
