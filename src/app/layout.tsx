// app/layout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/style.scss"; // Asegúrate que la ruta a tus estilos globales sea correcta
import { Toaster } from "sonner";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

// Define la URL base para construir URLs absolutas en la metadata
const siteUrl = "https://fascinantedigital.com";

export const metadata: Metadata = {
  // metadataBase es crucial para que Next.js construya URLs absolutas para OpenGraph, sitemaps, canonicals, etc.
  metadataBase: new URL(siteUrl),
  title: "Fascinante Digital - Web Design & Digital Marketing",
  description: "Professional web design, digital marketing, and SEO solutions to boost your online presence and drive business growth.",
  // Es importante que cada página defina su propia URL canónica a través de 'alternates.canonical'.
  // Ejemplo para la página de inicio (en app/page.tsx): alternates: { canonical: '/' }
  // Ejemplo para otra página (en app/about/page.tsx): alternates: { canonical: '/about' }
  keywords: [ // Palabras clave relevantes para tu sitio
    "Fascinante Digital",
    "web design",
    "digital marketing",
    "SEO",
    "website development",
    "online presence",
    "business growth",
    "West Palm Beach web design", // Ejemplo de palabra clave local
    "Florida digital marketing"
  ],
  viewport: "width=device-width, initial-scale=1.0, maximum-scale=1.0", // Considera si 'maximum-scale=1.0' es estrictamente necesario para accesibilidad.
  themeColor: "#2868D8",
  icons: {
    icon: "/favicon.ico", // Ruta relativa a /public
    apple: "/icons/apple-touch-icon.png", // Ruta relativa a /public
    shortcut: "/favicon.ico", // Ruta relativa a /public
  },
  manifest: "/manifest.json", // Ruta relativa a /public
  robots: { // Directivas para robots de búsqueda
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
    url: siteUrl, // URL base del sitio
    siteName: "Fascinante Digital",
    images: [
      {
        url: "/icons/icon-512x512.png", // URL relativa, Next.js la hará absoluta usando metadataBase
        width: 512,
        height: 512,
        alt: "Fascinante Digital Logo",
      },
      {
        url: "/images/banner/fascinante-digital-seo-audit-banner.jpg", // URL relativa, Next.js la hará absoluta
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
    images: [`${siteUrl}/images/banner/fascinante-digital-seo-audit-banner.jpg`], // URL absoluta para Twitter
    creator: "@fascinantedigital",
  },
  appleWebApp: {
    title: "Fascinante Digital",
    statusBarStyle: "black-translucent",
  },
  other: {
    "fb:app_id": "2110354466055010",
    "facebook-domain-verification": "TU_CODIGO_DE_VERIFICACION_AQUI", // ¡IMPORTANTE! Reemplaza con tu código real
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en"> {/* Asegúrate que el idioma sea el correcto para tu audiencia principal */}
      <head>
        {/* La etiqueta canónica ahora se gestiona a través del objeto 'metadata' por página.
            Ya no es necesario un <link rel="canonical" /> codificado aquí. */}

        {/* JSON-LD para Schema.org - Organización (ya lo tenías y está bien) */}
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
              "telephone": "+1 800-886-4981", // Confirma si este es el teléfono principal de contacto
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "2054 Vista Pkwy #400",
                "addressLocality": "West Palm Beach",
                "addressRegion": "FL",
                "postalCode": "33411",
                "addressCountry": "US"
              },
              "sameAs": [ // Perfiles sociales
                "https://www.facebook.com/fascinantedigital",
                "https://www.instagram.com/fascinantedigital",
                "https://twitter.com/fascinantedigital"
                // Añade otros perfiles relevantes (LinkedIn, YouTube, etc.)
              ]
            }),
          }}
          strategy="afterInteractive" // Cargar después de que la página sea interactiva
        />

        {/* JSON-LD para Schema.org - WebSite (para Sitelinks Searchbox, etc.) */}
        <Script
          id="website-json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Fascinante Digital",
              "url": siteUrl,
              "potentialAction": { // Opcional: Para habilitar el Sitelinks Searchbox
                "@type": "SearchAction",
                "target": `${siteUrl}/search?q={search_term_string}`, // Cambia '/search?q=' por tu URL de búsqueda real
                "query-input": "required name=search_term_string"
              }
            }),
          }}
          strategy="afterInteractive"
        />

        {/* Facebook Pixel para analíticas (ya lo tenías y está bien) */}
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
        {/* Considera añadir Google Tag Manager aquí si lo usas para gestionar otros scripts */}
      </head>
      <body className={inter.className}>
          {children}
          <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
