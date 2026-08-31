/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push("wreq-js", "@ngrok/ngrok", "keytar", "koffi", "tls-client-node");
    }
    return config;
  },
};

export default nextConfig;
