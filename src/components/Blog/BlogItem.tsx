// src/components/Blog/BlogItem.tsx
import Link from 'next/link';
import Image from 'next/image';
import { PostData } from '@/lib/posts'; // Usando alias @/ que apunta a src/

interface BlogItemProps {
  post: PostData;
  className?: string; // Para pasar clases adicionales si es necesario
}

const BlogItem: React.FC<BlogItemProps> = ({ post, className }) => {
  const { slug, title, date, excerpt, coverImage, author, category } = post;

  const formattedDate = new Date(date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Un placeholder si no hay imagen de portada definida en el frontmatter
  const imageSrc = coverImage || "/images/blog/fascinante-blog-placeholder.webp"; // Ajusta esta ruta si es necesario

  return (
    <article 
      className={`blog-item flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out overflow-hidden ${className || ''}`}
    >
      {/* Imagen de Portada */}
      <Link href={`/blog/${slug}`} legacyBehavior>
        <a className="block relative w-full aspect-[16/9] group overflow-hidden"> {/* Proporción 16:9 para la imagen */}
          <Image
            src={imageSrc}
            alt={title || 'Imagen del artículo del blog'}
            layout="fill"
            objectFit="cover"
            className="transform group-hover:scale-105 transition-transform duration-500 ease-in-out"
          />
        </a>
      </Link>

      {/* Contenido de la Tarjeta del Post */}
      <div className="p-5 sm:p-6 flex flex-col flex-grow">
        <header className="mb-3">
          {/* Categoría */}
          {category && (
            <Link href={`/blog?category=${encodeURIComponent(category.toLowerCase())}`} legacyBehavior>
              <a className="inline-block mb-2 text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider hover:underline">
                {category}
              </a>
            </Link>
          )}

          {/* Título */}
          <h2 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white leading-tight">
            {/* Intenta usar una de tus clases .headingX aquí, ej. className="heading6 ..." */}
            <Link href={`/blog/${slug}`} legacyBehavior>
              <a className="hover:text-blue-700 dark:hover:text-blue-500 transition-colors">
                {title}
              </a>
            </Link>
          </h2>

          {/* Metadatos: Fecha y Autor */}
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            {/* Intenta usar una de tus clases .captionX aquí */}
            <span>{formattedDate}</span>
            {author && (
              <>
                <span className="mx-1">•</span>
                <span>Por {author}</span>
              </>
            )}
          </div>
        </header>

        {/* Extracto */}
        {excerpt && (
          <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base leading-relaxed mb-4 flex-grow">
            {/* Intenta usar una de tus clases .bodyX o .captionX aquí */}
            {excerpt}
          </p>
        )}

        {/* Enlace "Leer más" */}
        <footer className="mt-auto">
          <Link href={`/blog/${slug}`} legacyBehavior>
            <a className="inline-flex items-center text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 group">
              {/* Intenta usar una de tus clases .text-button-sm aquí */}
              Leer más
              <svg 
                className="ml-1 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
              </svg>
            </a>
          </Link>
        </footer>
      </div>
    </article>
  );
};

export default BlogItem;