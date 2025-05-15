import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/style.scss";
import { Toaster } from "sonner";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Fascinante Digital - Web Design & Digital Marketing",
  description: "Professional web design, digital marketing, and SEO solutions to boost your online presence and drive business growth.",
  viewport: "width=device-width, initial-scale=1.0, maximum-scale=1.0",
  themeColor: "#2868D8",
  icons: {
    icon: "/favicon.ico",
    apple: "/icons/apple-touch-icon.png",
    shortcut: "/favicon.ico",
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "Fascinante Digital - Web Design, SEO, and Digital Marketing",
    description: "Boost your business with expert web design, digital marketing, and SEO services.",
    url: "https://fascinantedigital.com",
    siteName: "Fascinante Digital",
    images: [
      {
        url: "https://fascinantedigital.com/icons/icon-512x512.png",
        width: 512,
        height: 512,
        alt: "Fascinante Digital Logo",
      },
      {
        url: "https://fascinantedigital.com/images/og-image.jpg",
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
    images: ["https://fascinantedigital.com/images/og-image.jpg"],
    creator: "@fascinantedigital",
  },
  appleWebApp: {
    title: "Fascinante Digital",
    statusBarStyle: "black-translucent",
  },
  other: {
    "fb:app_id": "2110354466055010",
    "facebook-domain-verification": "your-verification-code", // Reemplaza con tu código real
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
        {/* Etiqueta canónica para mejorar SEO */}
        <link rel="canonical" href="https://fascinantedigital.com" />

        {/* JSON-LD para Schema.org - Organización */}
        <Script
          id="organization-json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Fascinante Digital",
              "url": "https://fascinantedigital.com",
              "logo": "https://fascinantedigital.com/icons/icon-512x512.png",
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
        />

        {/* Facebook Pixel para analíticas */}
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