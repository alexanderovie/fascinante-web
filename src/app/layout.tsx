import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/style.scss";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Fascinante Digital",
  description: "Digital marketing, SEO, and business growth solutions by Fascinante Digital.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        {/* Meta Tags */}
        <meta name="apple-mobile-web-app-title" content="Fascinante" />
        
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#ffffff" />
        <link rel="icon" href="/favicon.ico" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:title" content="Fascinante Digital" />
        <meta property="og:description" content="Digital marketing, SEO, and business growth solutions by Fascinante Digital." />
        <meta property="og:image" content="/images/og-image.jpg" />
        <meta property="og:url" content="https://fascinantedigital.com" />
        <meta property="og:type" content="website" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Fascinante Digital" />
        <meta name="twitter:description" content="Digital marketing, SEO, and business growth solutions by Fascinante Digital." />
        <meta name="twitter:image" content="/images/og-image.jpg" />
      </Head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}