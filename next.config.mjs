// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/:path*",
        destination: "https://cal.com/fascinante-digital/15min/:path*",
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Forwarded-Host", value: "booking.fascinantedigital.com" },
          { key: "X-Forwarded-Proto", value: "https" },
        ],
      },
    ];
  },
};

export default nextConfig;