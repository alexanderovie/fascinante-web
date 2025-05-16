// src/app/blog/[slug]/page.tsx
import { getAllPostSlugs, getPostData, PostContent } from '../../../lib/posts'; // Ajusta la ruta si es necesario
import { notFound } from 'next/navigation';
import type { Metadata, ResolvingMetadata } from 'next';

interface PostPageProps {
  params: {
    slug: string;
  };
}

// Esta función ayuda a Next.js a saber qué rutas generar estáticamente en tiempo de build.
export async function generateStaticParams() {
  const paths = getAllPostSlugs(); // [{ params: { slug: '...' } }, ...]
  return paths;
}

// Genera metadatos dinámicos para cada post (título de la página, descripción, etc.)
export async function generateMetadata(
  { params }: PostPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  try {
    const post = await getPostData(params.slug);
    const previousImages = (await parent).openGraph?.images || [];

    return {
      title: post.title,
      description: post.excerpt || 'Un artículo fascinante', // Usa el excerpt si está disponible
      openGraph: {
        title: post.title,
        description: post.excerpt,
        images: post.coverImage ? [post.coverImage, ...previousImages] : previousImages, // Añade imagen de portada si existe
      },
      // Puedes agregar más metadatos aquí (ej. keywords, author)
    };
  } catch (error) {
    // Si el post no se encuentra, los metadatos por defecto o de "not-found" se usarán.
    return {
      title: 'Artículo no encontrado',
      description: 'El artículo que buscas no existe o ha sido movido.'
    }
  }
}


export default async function PostPage({ params }: PostPageProps) {
  const { slug } = params;
  let post: PostContent;

  try {
    post = await getPostData(slug);
  } catch (error) {
    // Si getPostData lanza un error (ej. archivo no encontrado), redirige a not-found
    console.error(`Error fetching post data for slug: ${slug}`, error);
    notFound(); // Esto renderizará tu página not-found.tsx más cercana
  }

  return (
    <article style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <header style={{ marginBottom: '2rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
        <h1 style={{ fontSize: '2.5em', marginBottom: '0.5rem' }}>{post.title}</h1>
        <div style={{ color: '#555', marginBottom: '1rem' }}>
          <span>Publicado el: {new Date(post.date).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          {post.author && <span> por {post.author}</span>}
        </div>
        {post.category && <p style={{ fontStyle: 'italic' }}>Categoría: {post.category}</p>}
      </header>
      
      {/* Renderiza el contenido HTML del post */}
      {/* ¡CUIDADO! Usa dangerouslySetInnerHTML solo con contenido que confíes (como tu propio markdown convertido a HTML) */}
      <div
        className="post-content" // Puedes añadir una clase para estilizar el contenido del post
        dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        style={{ lineHeight: '1.7', fontSize: '1.1em' }}
      />
      
      {/* Aquí podrías añadir componentes de "posts relacionados", "comentarios", etc. */}
    </article>
  );
}

// Nota sobre la interfaz PostContent:
// Asegúrate de que la interfaz `PostContent` en `src/lib/posts.ts` incluya todos los campos
// del frontmatter que quieras usar (author, category, coverImage, excerpt, etc.).
// La definición actual con `[key: string]: any;` lo permite, pero ser explícito es mejor.
// export interface PostContent extends PostData { // PostData ya tiene slug, title, date, y [key: string]: any
//   contentHtml: string;
//   author?: string;       // Ejemplo
//   category?: string;     // Ejemplo
//   coverImage?: string;   // Ejemplo
//   excerpt?: string;      // Ejemplo
// }