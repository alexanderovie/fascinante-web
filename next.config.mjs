/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/",
        destination: "https://cal.com/fascinante-digital/15min",
      },
    ];
  },
};

export default nextConfig;