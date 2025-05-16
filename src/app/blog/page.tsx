// src/app/blog/page.tsx
import Link from 'next/link';
import { getSortedPostsData, PostData } from '../../lib/posts'; // Ajusta la ruta si es necesario

// --- Importa los componentes de Layout ---
import TopNavTwo from "@/components/Header/TopNav/TopNavTwo";   // Como en tu ejemplo BlogListStyleTwo
import MenuTwo from "@/components/Header/Menu/MenuTwo";       // Como en tu ejemplo BlogListStyleTwo
import BreadcrumbItem from "@/components/Breadcrumb/BreadcrumbItem";
import CtaOne from "@/components/Section/CTA/CtaOne";         // Opcional, si quieres un CTA en esta página
import Footer from "@/components/Footer/Footer";
import BlogItem from '@/components/Blog/BlogItem';             // ¡Tu componente para mostrar cada post!

export default function BlogIndexPage() {
  const allPostsData: PostData[] = getSortedPostsData();

  return (
    <>
      <div className="overflow-x-hidden">
        <header id="header">
          <TopNavTwo />
          <MenuTwo />
        </header>

        <main className="content">
          <BreadcrumbItem 
            link="Blog" // O el texto que quieras para el enlace de la miga de pan (ej. "Inicio")
            title="Nuestro Blog Fascinante" 
            img="/images/banner/Banner-Blog-Fascinante.webp" // Usa una imagen de banner adecuada para la sección del blog
            desc="Descubre nuestros últimos artículos, noticias y consejos sobre temas fascinantes." 
          />

          <section className="blog-list-section py-12 md:py-16 lg:py-20"> {/* Añade padding */}
            <div className="container"> {/* Usa tu clase .container para centrar y limitar el ancho */}
              
              {allPostsData.length === 0 ? (
                <p className="text-center text-xl text-gray-600 dark:text-gray-400">
                  Aún no hay artículos publicados. ¡Vuelve pronto!
                </p>
              ) : (
                // Aquí puedes usar una cuadrícula para mostrar los BlogItem
                // Ejemplo con Tailwind CSS Grid:
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {allPostsData.map((post) => (
                    <BlogItem key={post.slug} post={post} />
                  ))}
                </div>
                // Si no usas Tailwind, necesitarás una clase CSS para la cuadrícula:
                // <div className="blog-items-grid">
                //   {allPostsData.map((post) => (
                //     <BlogItem key={post.slug} post={post} />
                //   ))}
                // </div>
              )}

              {/* Aquí podrías añadir paginación si tienes muchos posts */}
            </div>
          </section>
          
          <CtaOne /> {/* Opcional, si quieres un Call to Action */}
        </main>

        <footer id="footer">
          <Footer />
        </footer>
      </div>
    </>
  );
}