import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/style.scss";
// ✨ MEJORA: Eliminamos la importación de Head de 'next/head'
// Ya no es necesario en el App Router para gestionar las meta etiquetas.
// import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

// ✨ MEJORA: Centralizamos y estructuramos toda la configuración del <head> aquí
export const metadata: Metadata = {
  // Título del sitio (equivalente a <title>)
  title: "Fascinante Digital - Web Design & Digital Marketing",

  // Descripción meta para SEO (equivalente a <meta name='description'>)
  description: "Professional Web Design, Digital Marketing, and Local Directory Services.",

  // ✨ CORRECCIÓN y MEJORA: Configuración del viewport usando la propiedad 'viewport' de la API Metadata
  // Esto es crucial para el control del zoom y el diseño responsivo.
  // Incluimos maximumScale: 1.0 para ayudar a prevenir el auto-zoom en inputs.
  // Evitamos user-scalable=no aquí para mantener la accesibilidad.
  viewport: {
    width: 'device-width', // Establece el ancho del viewport al ancho del dispositivo.
    initialScale: 1.0,    // Define el nivel de zoom inicial.
    maximumScale: 1.0,    // CLAVE: Previene el auto-zoom en inputs al limitar el zoom máximo.
    // Si *realmente* necesitas deshabilitar el zoom del usuario por completo (con precaución para accesibilidad), descomenta la línea de abajo:
    // userScalable: false,
  },

  // ✨ MEJORA: Propiedad 'themeColor' para el color de la barra de estado del navegador en móviles
  // Equivalente a <meta name="theme-color" content="#2868D8" />
  themeColor: '#2868D8',

  // ✨ MEJORA: Propiedad 'icons' para manejar favicon y otros íconos
  // Equivalente a <link rel="icon" href="/favicon.ico" /> y <link rel="apple-touch-icon" ... />
  // La propiedad 'manifest' NO va aquí.
  icons: {
    icon: '/favicon.ico',
    apple: '/icons/apple-touch-icon.png', // Reemplaza con tu ícono de Apple
    shortcut: '/favicon.ico', // 'shortcut' es un alias obsoleto para 'icon', pero a veces se mantiene por compatibilidad
    // ✨ CORRECCIÓN: Eliminamos 'manifest' de dentro de 'icons'.
    // manifest: '/manifest.json', // ESTO CAUSABA EL ERROR DE TIPADO
  },

  // ✨ CORRECCIÓN y MEJORA: Propiedad 'manifest' como propiedad de nivel superior
  // Esto es equivalente a <link rel="manifest" href="/manifest.json" />
  manifest: '/manifest.json',

  // Configuración de OpenGraph (Facebook, LinkedIn, etc.)
  openGraph: {
    title: 'Fascinante Digital - Web Design & Digital Marketing',
    description: 'Elevate your online presence with expert web design and digital marketing services.',
    url: 'https://fascinantedigital.com', // Usa la URL canónica
    siteName: 'Fascinante Digital',
    images: [
      {
        url: 'https://fascinantedigital.com/icons/icon-512x512.png', // Asegúrate de que sea una URL absoluta o ruta pública correcta
        width: 512,
        height: 512,
        alt: 'Fascinante Digital Logo',
      },
      {
        url: 'https://fascinantedigital.com/images/og-image.jpg', // Asegúrate de que sea una URL absoluta o ruta pública correcta
        width: 1200,
        height: 630,
        alt: 'Fascinante Digital - Expert Web Design and Digital Marketing',
      },
    ],
    locale: 'en_US', // Asegúrate de que este sea el locale correcto
    type: 'website',
  },

  // Configuración de Twitter Cards
  twitter: {
    card: 'summary_large_image', // Tipo de tarjeta de Twitter
    title: 'Fascinante Digital - Web Design & Digital Marketing',
    description: 'Elevate your online presence with expert web design and digital marketing services.',
    images: ['https://fascinantedigital.com/images/og-image.jpg'], // Asegúrate de que sea una URL absoluta o ruta pública correcta
    creator: '@fascinantedigital', // Reemplaza con tu usuario de Twitter si tienes uno
  },

  // Configuración de Apple Web App
  appleWebApp: {
    title: 'Fascinante Digital',
    statusBarStyle: 'black-translucent', // Estilo de la barra de estado en iOS
    // startupImage: ['/icons/startup-image.png'], // Opcional: Imagen de inicio para iOS
  },

  // ✨ MEJORA: Puedes añadir otras meta tags directamente aquí si la API de metadata las soporta
  // Por ejemplo, canonical URL (aunque alternates es más común para esto)
  // alternates: {
  //   canonical: 'https://fascinantedigital.com', // URL canónica para SEO
  // },

  // ✨ NOTA: Algunas meta tags como fb:app_id o facebook-domain-verification
  // pueden no tener una propiedad directa en la API Metadata.
  // Para estas, puedes usar la propiedad 'other'.
  other: {
    'fb:app_id': '2110354466055010',
    'facebook-domain-verification': 'your-verification-code', // Reemplaza con tu código real
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* ✨ MEJORA: Eliminamos completamente el componente <head> manual */}
      {/* La API 'metadata' se encarga de generar todo el contenido del <head> */}
      {/* Esto evita conflictos y aprovecha las optimizaciones de Next.js App Router */}
      {/* <head>
        // Meta tag para Facebook App ID
        <meta property="fb:app_id" content="2110354466055010" />

        // Meta tag para verificación de dominio en Facebook
        <meta name="facebook-domain-verification" content="your-verification-code" />

        // Meta tag para eliminar zoom en móviles (REDUNDANTE con viewport en metadata)
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />

        // Meta tag para color del tema (REDUNDANTE con themeColor en metadata)
        <meta name="theme-color" content="#2868D8" />

        // Favicon y manifest (REDUNDANTE con icons y manifest en metadata)
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
      </head> */}
      <body className={inter.className}>{children}</body>
    </html>
  );
}
