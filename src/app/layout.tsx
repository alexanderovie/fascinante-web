import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/style.scss";
// import Head from "next/head"; // ✨ MEJORA 1: Ya no necesitamos importar 'Head' de 'next/head'

const inter = Inter({ subsets: ["latin"] });

// ✨ MEJORA 2: Centralizamos y expandimos el objeto 'metadata' para todas las etiquetas del <head>
export const metadata: Metadata = {
  // Título de la página (equivalente a <title>)
  title: "Fascinante Digital",
  // Descripción meta para SEO (equivalente a <meta name='description'>)
  description: "Digital marketing, SEO, and business growth solutions by Fascinante Digital.",

  // ✨ MEJORA 3: Configuración del viewport usando la propiedad 'viewport' de la API Metadata
  // Esto es crucial para el control del zoom y el diseño responsivo.
  viewport: {
    width: 'device-width', // Establece el ancho del viewport al ancho del dispositivo.
    initialScale: 1.0,    // Define el nivel de zoom inicial.
    maximumScale: 1.0,    // ✨ CLAVE: Previene el auto-zoom en inputs al limitar el zoom máximo.
    // userScalable: false, // OPCIONAL: Si lo descomentas, deshabilita el zoom del usuario por completo (usar con EXTREMA precaución por accesibilidad).
  },

  // ✨ MEJORA 4: Propiedad 'themeColor' para el color de la barra de estado del navegador en móviles
  // Equivalente a <meta name="theme-color" content="#ffffff" />
  themeColor: '#ffffff',

  // ✨ MEJORA 5: Propiedad 'icons' para manejar favicon y otros íconos
  // Equivalente a <link rel="icon" href="/favicon.ico" />
  icons: {
    icon: '/favicon.ico',
    // apple: '/apple-touch-icon.png', // Ejemplo: Si tienes un ícono específico para iOS
  },

  // ✨ MEJORA 6: Objeto 'openGraph' para meta etiquetas de Open Graph (Facebook, LinkedIn, etc.)
  // Esto reemplaza las etiquetas <meta property="og:..."> individuales.
  openGraph: {
    title: 'Fascinante Digital',
    description: 'Digital marketing, SEO, and business growth solutions by Fascinante Digital.',
    url: 'https://fascinantedigital.com', // URL can be relative if it's from the same domain as the base URL
    siteName: 'Fascinante Digital',
    images: [
      {
        url: '/images/og-image.jpg', // Asegúrate de que esta ruta sea accesible públicamente desde la raíz de tu proyecto
        width: 1200,
        height: 630,
        alt: 'Fascinante Digital Marketing Solutions', // Es bueno añadir un texto alternativo
      },
      // Puedes añadir más objetos de imagen si tienes múltiples imágenes OG
    ],
    locale: 'es_ES', // Reemplaza con el locale correcto si es necesario
    type: 'website',
  },

  // ✨ MEJORA 7: Objeto 'twitter' para meta etiquetas de Twitter Card
  // Esto reemplaza las etiquetas <meta name="twitter:..."> individuales.
  twitter: {
    card: 'summary_large_image', // Tipo de tarjeta de Twitter (summary, summary_large_image, app, player)
    title: 'Fascinante Digital',
    description: 'Digital marketing, SEO, and business growth solutions by Fascinante Digital.',
    images: ['/images/og-image.jpg'], // Asegúrate de que esta ruta sea accesible públicamente
    // creator: '@tu_handle_twitter', // Opcional: tu usuario de Twitter
  },

  // ✨ MEJORA 8: Propiedad 'appleWebApp' para la configuración de la aplicación web progresiva en iOS
  // Equivalente a <meta name="apple-mobile-web-app-title">
  appleWebApp: {
    title: 'Fascinante',
  },

  // Otras meta etiquetas que puedas necesitar (ej. canonical URL para SEO)
  // alternates: {
  //   canonical: 'https://fascinantedigital.com', // Reemplaza con tu URL canónica
  // },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* ✨ MEJORA 9: Eliminamos completamente el componente <Head> aquí */}
      {/* La API 'metadata' se encarga de todas las etiquetas del <head> que hemos definido arriba. */}
      <body className={inter.className}>{children}</body>
    </html>
  );
}