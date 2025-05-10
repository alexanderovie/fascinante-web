/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://fascinantedigital.com",
  generateRobotsTxt: true,
  exclude: ["/admin/*", "/dashboard/*", "/private/*", "/api/*"],
  robotsTxtOptions: {
    policies: [
      { userAgent: "*", allow: "/", disallow: ["/admin/", "/dashboard/", "/private/", "/api/"] },
    ],
  },
};