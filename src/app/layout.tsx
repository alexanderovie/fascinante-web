import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/style.scss";
import { Toaster } from 'sonner'; // <-- 1. IMPORTAR Toaster

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Fascinante Digital - Web Design & Digital Marketing",
  description: "Professional Web Design, Digital Marketing, and Local Directory Services.",
  viewport: {
    width: 'device-width',
    initialScale: 1.0,
    maximumScale: 1.0,
  },
  themeColor: '#2868D8',
  icons: {
    icon: '/favicon.ico',
    apple: '/icons/apple-touch-icon.png',
    shortcut: '/favicon.ico',
  },
  manifest: '/manifest.json',
  openGraph: {
    title: 'Fascinante Digital - Web Design & Digital Marketing',
    description: 'Elevate your online presence with expert web design and digital marketing services.',
    url: 'https://fascinantedigital.com',
    siteName: 'Fascinante Digital',
    images: [
      {
        url: 'https://fascinantedigital.com/icons/icon-512x512.png',
        width: 512,
        height: 512,
        alt: 'Fascinante Digital Logo',
      },
      {
        url: 'https://fascinantedigital.com/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Fascinante Digital - Expert Web Design and Digital Marketing',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fascinante Digital - Web Design & Digital Marketing',
    description: 'Elevate your online presence with expert web design and digital marketing services.',
    images: ['https://fascinantedigital.com/images/og-image.jpg'],
    creator: '@fascinantedigital',
  },
  appleWebApp: {
    title: 'Fascinante Digital',
    statusBarStyle: 'black-translucent',
  },
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
      {/* El contenido del <head> es generado automáticamente por el objeto 'metadata' */}
      <body className={inter.className}>
        {children}
        <Toaster richColors position="top-right" /> {/* <-- 2. AÑADIR Toaster AQUÍ */}
      </body>
    </html>
  );
}