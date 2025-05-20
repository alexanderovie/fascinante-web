// src/app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "@/styles/style.scss";
import { Toaster } from "sonner";
import ExitIntentPopup from '@/components/Popups/ExitIntentPopup';

const inter = Inter({ subsets: ["latin"] });

const siteUrl = "https://www.fascinantedigital.com"; // Asegúrate que este sea tu dominio de producción
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

// --- METADATOS PRINCIPALES ---
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Fascinante Digital - Web Design & Digital Marketing",
  description: "Professional web design, digital marketing, SEO, and branding solutions to boost your online presence and drive business growth.",
  keywords: [
    "Fascinante Digital", "web design", "digital marketing", "SEO",
    "website development", "online presence", "business growth",
    "West Palm Beach web design", "Florida digital marketing"
  ],
  icons: {
    icon: "/favicon.ico",
    apple: "/icons/apple-touch-icon.png",
    shortcut: "/favicon.ico",
  },
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
    creator: "@fascinantedigital", // Reemplaza si tienes otro o elimínalo si no aplica
  },
  appleWebApp: {
    title: "Fascinante Digital",
    statusBarStyle: "black-translucent",
  },
  // Se eliminó la sección 'other' que contenía "facebook-domain-verification"
};

// --- CONFIGURACIÓN DEL VIEWPORT ---
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1.0,
  maximumScale: 1.0,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#2868D8' },
    { media: '(prefers-color-scheme: dark)', color: '#0F1E37' }
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {GTM_ID && (
          <Script
            id="gtm-base"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','${GTM_ID}');
              `,
            }}
          />
        )}

        {/* Se eliminó <meta property="fb:app_id" ... /> */}

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
              "telephone": "+18008864981",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "2054 Vista Pkwy #400",
                "addressLocality": "West Palm Beach",
                "addressRegion": "FL",
                "postalCode": "33411",
                "addressCountry": "US"
              },
              "sameAs": [
                "https://www.facebook.com/fascinantedigital", // Mantén tus redes sociales reales
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
                "target": {
                  "@type": "EntryPoint",
                  "urlTemplate": `${siteUrl}/search?q={search_term_string}`
                },
                "query-input": "required name=search_term_string"
              }
            }),
          }}
          strategy="afterInteractive"
        />

        {/* Se eliminó el script del Pixel de Facebook completo si no lo usas */}
        {/* Si SÍ usas el Pixel, asegúrate de que el ID '2110354466055010' sea el tuyo real,
            de lo contrario, elimina todo el bloque <Script id="facebook-pixel" ... > ... </Script>
            A continuación, lo he eliminado asumiendo que era un placeholder.
        */}

      </head>
      <body className={`${inter.className} antialiased`}>
          {GTM_ID && (
            <noscript
              dangerouslySetInnerHTML={{
                __html: `
                  <iframe src="https://www.googletagmanager.com/ns.html?id=${GTM_ID}"
                  height="0" width="0" style="display:none;visibility:hidden"></iframe>
                `,
              }}
            />
          )}
          {children}
          <Toaster richColors position="top-right" />
          <ExitIntentPopup />
      </body>
    </html>
  );
}