// src/app/not-found.tsx

import MenuTwo from "@/components/Header/Menu/MenuTwo";
import TopNavTwo from "@/components/Header/TopNav/TopNavTwo";
import Footer from "@/components/Footer/Footer";
import Link from 'next/link';

export default function NotFound() {
  return (
    <>
      <div className="overflow-x-hidden">
        <header id="header">
          <TopNavTwo />
          <MenuTwo />
        </header>
        <main className="content">
          <div className="container mx-auto px-4 flex flex-col items-center justify-center text-center min-h-[calc(100vh-var(--header-height,200px)-var(--footer-height,200px))] py-10">
            {/* Ajusta los valores de --header-height y --footer-height si es necesario,
                o define estas variables CSS en tu global.scss/css si no existen.
                Alternativamente, puedes usar una altura fija como min-h-[50vh] o similar. */}
            
            {/* Puedes usar una imagen o icono de error si tienes uno */}
            {/* <img src="/images/error-404.svg" alt="Error 404" className="w-64 h-64 mb-8" /> */}

            <h1 className="text-7xl sm:text-8xl md:text-9xl font-bold text-red-500 dark:text-red-400">
              404
            </h1>
            <h2 className="mt-4 text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-800 dark:text-white">
              Página No Encoontrada
            </h2>
            <p className="mt-6 text-md sm:text-lg text-gray-600 dark:text-gray-300 max-w-md">
              Lo sentimos, la página que estás buscando no existe, ha sido movida o no está disponible temporalmente.
            </p>
            <div className="mt-10">
              <Link 
                href="/" 
                className="px-6 py-3 text-lg font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-150"
              >
                Volver al Inicio
              </Link>
            </div>
            <p className="mt-8 text-sm text-gray-500 dark:text-gray-400">
              Si crees que esto es un error, por favor <Link href="/contact" className="text-blue-600 hover:underline dark:text-blue-400">contacta con nosotros</Link>.
            </p>
          </div>
        </main>
        <footer id="footer">
          <Footer />
        </footer>
      </div>
    </>
  );
}