// src/app/layout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script"; // Importado una sola vez
import "@/styles/style.scss";   // Asegúrate que la ruta a tus estilos es correcta
import { Toaster } from "sonner";
import ExitIntentPopup from '@/components/Popups/ExitIntentPopup';

const inter = Inter({ subsets: ["latin"] });

const siteUrl = "https://www.fascinantedigital.com";

// Accede a tu variable de entorno GTM (asegúrate que esté en .env.local)
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

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
  themeColor: "#2868D8", // Color principal de tu marca
  icons: {
    icon: "/favicon.ico", // En /public/favicon.ico
    apple: "/icons/apple-touch-icon.png", // En /public/icons/apple-touch-icon.png
    shortcut: "/favicon.ico",
  },
  manifest: "/manifest.json", // En /public/manifest.json
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
        url: "/icons/icon-512x512.png", // Relativo a /public
        width: 512,
        height: 512,
        alt: "Fascinante Digital Logo",
      },
      {
        url: "/images/banner/fascinante-digital-seo-audit-banner.jpg", // Relativo a /public
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
    // Para Twitter, es mejor usar URLs absolutas para las imágenes
    images: [`${siteUrl}/images/banner/fascinante-digital-seo-audit-banner.jpg`],
    creator: "@fascinantedigital", // Tu usuario de Twitter
  },
  appleWebApp: {
    title: "Fascinante Digital",
    statusBarStyle: "black-translucent",
  },
  other: {
    // Reemplaza con tu código real de verificación de dominio de Facebook
    "facebook-domain-verification": "TU_CODIGO_DE_VERIFICACION_DE_FB_AQUI",
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
        
        {/* Google Tag Manager - Script principal */}
        {GTM_ID && (
          <Script
            id="gtm-base"
            strategy="afterInteractive" // Carga GTM después de que la página sea interactiva
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

        {/* Meta de Facebook App ID (si la usas para SDK de JS de FB o Insights) */}
        <meta property="fb:app_id" content="2110354466055010" />

        {/* Scripts de Datos Estructurados (JSON-LD) */}
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
              "telephone": "+18008864981", // Formato sin guiones preferido para telephone
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
                // Añade otras redes sociales relevantes (LinkedIn, YouTube, etc.)
              ]
            }),
          }}
          strategy="afterInteractive" // Cargar después de la interacción para no bloquear
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

        {/* Facebook Pixel */}
        <Script id="facebook-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window,document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '2110354466055010'); 
            fbq('track', 'PageView');
          `}
        </Script>
      </head>
      <body className={`${inter.className} antialiased`}> {/* Añadido antialiased para suavizado de fuentes */}
          {/* Google Tag Manager (noscript) - Fallback */}
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