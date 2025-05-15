// app/layout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/style.scss";
import { Toaster } from "sonner";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

const siteUrl = "https://www.fascinantedigital.com"; // Añade www.

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Fascinante Digital - Web Design & Digital Marketing",
  description: "Professional web design, digital marketing, SEO, and branding solutions to boost your online presence and drive business growth.",
  keywords: [
    "Fascinante Digital",
    "web design",
    "digital marketing",
    "SEO",
    "website development",
    "online presence",
    "business growth",
    "West Palm Beach web design",
    "Florida digital marketing"
  ],
  viewport: "width=device-width, initial-scale=1.0, maximum-scale=1.0",
  themeColor: "#2868D8",
  icons: {
    icon: "/favicon.ico",
    apple: "/icons/apple-touch-icon.png",
    shortcut: "/favicon.ico",
  },
  manifest: "/manifest.json",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: "Fascinante Digital - Web Design, SEO, and Digital Marketing",
    description: "Boost your business with expert web design, digital marketing, and SEO services.",
    url: siteUrl,
    siteName: "Fascinante Digital",
    images: [
      {
        url: "/icons/icon-512x512.png",
        width: 512,
        height: 512,
        alt: "Fascinante Digital Logo",
      },
      {
        url: "/images/banner/fascinante-digital-seo-audit-banner.jpg",
        width: 1200,
        height: 630,
        alt: "Fascinante Digital - Expert Web Design, SEO, and Digital Marketing",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fascinante Digital - Web Design, SEO, and Digital Marketing",
    description: "Boost your business with expert web design, digital marketing, and SEO services.",
    images: [`${siteUrl}/images/banner/fascinante-digital-seo-audit-banner.jpg`],
    creator: "@fascinantedigital",
  },
  appleWebApp: {
    title: "Fascinante Digital",
    statusBarStyle: "black-translucent",
  },
  other: {
    // "fb:app_id": "2110354466055010", // <-- 1. ELIMINA ESTA LÍNEA
    "facebook-domain-verification": "TU_CODIGO_DE_VERIFICACION_AQUI", // ¡IMPORTANTE! Reemplaza con tu código real
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Los metadatos del objeto 'metadata' se inyectarán aquí automáticamente por Next.js */}

        {/* 2. AÑADE LA ETIQUETA CORRECTA AQUÍ 👇 */}
        <meta property="fb:app_id" content="2110354466055010" />

        <Script
          id="organization-json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Fascinante Digital",
              "url": siteUrl,
              "logo": `${siteUrl}/icons/icon-512x512.png`,
              "telephone": "+1 800-886-4981",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "2054 Vista Pkwy #400",
                "addressLocality": "West Palm Beach",
                "addressRegion": "FL",
                "postalCode": "33411",
                "addressCountry": "US"
              },
              "sameAs": [
                "https://www.facebook.com/fascinantedigital",
                "https://www.instagram.com/fascinantedigital",
                "https://twitter.com/fascinantedigital"
              ]
            }),
          }}
          strategy="afterInteractive"
        />
        <Script
          id="website-json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Fascinante Digital",
              "url": siteUrl,
              "potentialAction": {
                "@type": "SearchAction",
                "target": `${siteUrl}/search?q={search_term_string}`,
                "query-input": "required name=search_term_string"
              }
            }),
          }}
          strategy="afterInteractive"
        />
        <Script id="facebook-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;
          n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window,document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '2110354466055010'); 
          fbq('track', 'PageView');`}
        </Script>
      </head>
      <body className={inter.className}>
          {children}
          <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}