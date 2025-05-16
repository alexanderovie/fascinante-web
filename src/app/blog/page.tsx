// src/app/blog/page.tsx
import Link from 'next/link';
import { getSortedPostsData, PostData } from '../../lib/posts'; // Ajusta la ruta si es necesario

export default function BlogIndexPage() {
  const allPostsData: PostData[] = getSortedPostsData();

  return (
    <section style={{ padding: '2rem' }}>
      <h1>Blog Fascinante</h1>
      <p>Bienvenido a nuestro espacio de conocimiento y actualidad.</p>
      
      {allPostsData.length === 0 && (
        <p>Aún no hay artículos publicados. ¡Vuelve pronto!</p>
      )}

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {allPostsData.map(({ slug, date, title, excerpt }) => ( // Asumiendo que 'excerpt' está en tu frontmatter y PostData
          <li key={slug} style={{ marginBottom: '2rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
            <article>
              <h2>
                <Link href={`/blog/${slug}`} style={{ textDecoration: 'none', color: '#0070f3' }}>
                  {title}
                </Link>
              </h2>
              <small style={{ color: '#555', display: 'block', marginBottom: '0.5rem' }}>
                Publicado el: {new Date(date).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
              </small>
              {excerpt && <p style={{ color: '#333' }}>{excerpt}</p>} {/* Muestra el extracto si existe */}
              <Link href={`/blog/${slug}`} style={{ color: '#0070f3' }}>
                Leer más →
              </Link>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}

// Nota: Para que 'excerpt' esté disponible aquí, asegúrate de que:
// 1. Esté en el frontmatter de tus archivos .md
// 2. La interfaz `PostData` en `src/lib/posts.ts` incluya `excerpt?: string;` explícitamente
//    o que lo estés accediendo a través de `...matterResult.data` y lo trates como `any`.
//    Modificar PostData así sería más seguro:
//    export interface PostData {
//      slug: string;
//      title: string;
//      date: string;
//      excerpt?: string; // Añadido para claridad
//      coverImage?: string; // Si también quieres mostrar una imagen de portada
//      [key: string]: any;
//    }