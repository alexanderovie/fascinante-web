// src/components/Section/Blog/BlogOne.tsx

import Link from 'next/link';
import Image from 'next/image'; // Para optimización de imágenes con Next.js
import { PostData } from '@/lib/posts'; // Ajusta la ruta si es necesario (si @/ no apunta a src/ o está en otro nivel)

interface BlogOneProps {
  data: PostData[]; // Ahora recibe un array de PostData
  title?: string;    // Título opcional para la sección
}

const BlogOne: React.FC<BlogOneProps> = ({ data, title = "Desde Nuestro Blog" }) => {
  if (!data || data.length === 0) {
    return (
      <section className="blog-one-section py-8 md:py-12 lg:py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12 text-gray-800 dark:text-white">{title}</h2>
          <p className="text-center text-gray-600 dark:text-gray-300">Próximamente compartiremos nuevos artículos aquí.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="blog-one-section py-8 md:py-12 lg:py-16 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">{title}</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">
            Descubre nuestras últimas reflexiones, noticias y consejos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.map((post) => (
            <article
              key={post.slug}
              className="bg-white dark:bg-gray-700 rounded-lg shadow-lg overflow-hidden flex flex-col transition-transform duration-300 hover:scale-105"
            >
              {post.coverImage && (
                <Link href={`/blog/${post.slug}`} legacyBehavior>
                  <a className="block relative h-56 w-full">
                    <Image
                      src={post.coverImage}
                      alt={post.title || 'Imagen de portada del blog'}
                      layout="fill"
                      objectFit="cover"
                      className="transition-opacity duration-300 hover:opacity-90"
                    />
                  </a>
                </Link>
              )}
              <div className="p-6 flex flex-col flex-grow">
                <header className="mb-4">
                  {post.category && (
                     <p className="text-sm text-blue-600 dark:text-blue-400 font-semibold mb-1 uppercase">
                        {post.category}
                     </p>
                  )}
                  <h3 className="text-xl lg:text-2xl font-bold text-gray-800 dark:text-white mb-2 leading-tight">
                    <Link href={`/blog/${post.slug}`} legacyBehavior>
                      <a className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">
                        {post.title}
                      </a>
                    </Link>
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(post.date).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                    {post.author && ` - por ${post.author}`}
                  </p>
                </header>
                {post.excerpt && (
                  <p className="text-gray-600 dark:text-gray-300 mb-4 text-base leading-relaxed flex-grow">
                    {post.excerpt}
                  </p>
                )}
                <footer className="mt-auto">
                  <Link href={`/blog/${post.slug}`} legacyBehavior>
                    <a className="inline-block text-blue-600 dark:text-blue-400 font-semibold hover:underline">
                      Leer más →
                    </a>
                  </Link>
                </footer>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogOne;