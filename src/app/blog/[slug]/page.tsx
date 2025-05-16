// src/app/blog/[slug]/page.tsx

// --- Lógica de datos del post (se mantiene igual) ---
import { getAllPostSlugs, getPostData, PostContent } from '../../../lib/posts'; // Ajusta la ruta si es necesario
import { notFound } from 'next/navigation';
import type { Metadata, ResolvingMetadata } from 'next';

// --- Componentes de Layout del estilo de BlogListStyleTwo ---
import Link from "next/link"; // Necesario para Breadcrumb y otros enlaces
import TopNavTwo from "@/components/Header/TopNav/TopNavTwo";
import MenuTwo from "@/components/Header/Menu/MenuTwo";
import BreadcrumbItem from "@/components/Breadcrumb/BreadcrumbItem"; // Lo usaremos para el post actual
import CtaOne from "@/components/Section/CTA/CtaOne";
import Footer from "@/components/Footer/Footer";
// import { Suspense } from "react"; // Suspense podría no ser necesario aquí ya que la data se carga en el Server Component

interface PostPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const paths = getAllPostSlugs();
  return paths;
}

export async function generateMetadata(
  { params }: PostPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  try {
    const post = await getPostData(params.slug);
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const postUrl = `${siteUrl}/blog/${params.slug}`;
    const previousImages = (await parent).openGraph?.images || [];
    const coverImageAbsoluteUrl = post.coverImage ? (post.coverImage.startsWith('http') ? post.coverImage : `${siteUrl}${post.coverImage}`) : undefined;


    return {
      title: post.title,
      description: post.excerpt || 'Un artículo fascinante',
      alternates: {
        canonical: postUrl,
      },
      openGraph: {
        title: post.title,
        description: post.excerpt,
        url: postUrl,
        type: 'article',
        publishedTime: post.date,
        authors: post.author ? [post.author] : [],
        images: coverImageAbsoluteUrl ? [coverImageAbsoluteUrl, ...previousImages] : previousImages,
        // Asegúrate que las rutas de las imágenes sean absolutas para Open Graph
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description: post.excerpt,
        images: coverImageAbsoluteUrl ? [coverImageAbsoluteUrl] : [],
      },
    };
  } catch (error) {
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
    console.error(`Error fetching post data for slug: ${slug}`, error);
    notFound();
  }

  const formattedDate = new Date(post.date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // --- Estructura visual basada en BlogListStyleTwo ---
  return (
    <>
      <div className="overflow-x-hidden">
        <header id="header">
          <TopNavTwo />
          <MenuTwo />
        </header>
        <main className="content">
          {/* Breadcrumb adaptado para el post individual */}
          {/* Puedes usar post.coverImage o una imagen genérica para el banner del breadcrumb */}
          <BreadcrumbItem 
            link="Blog" // Enlace a la página principal del blog
            title={post.title} // Título del post actual en el breadcrumb
            // Si quieres una jerarquía: title="Blog" y luego el título del post debajo o como subtítulo.
            // Esto depende de cómo esté diseñado tu BreadcrumbItem.
            // Por ahora, usamos el título del post como el título principal del Breadcrumb.
            img={"/images/banner/default-blog-banner.webp"} // <--- CAMBIO AQUÍ: Ruta a tu imagen fija
            desc={post.excerpt || "Detalles del artículo."} // Puedes usar el excerpt o una descripción genérica
            // Si tu BreadcrumbItem puede mostrar una jerarquía, podrías hacer algo como:
            // items={[{ href: "/blog", name: "Blog" }, { name: post.title }]}
          />

          {/* --- Contenido del Post Individual (lógica original adaptada) --- */}
          {/* El <Suspense> que envolvía LayoutListTwo puede no ser necesario aquí, 
              ya que PostPage es un Server Component y los datos se resuelven en el servidor. */}
          <div className="py-10 md:py-16 lg:py-20"> {/* Añadimos un padding para separar del breadcrumb y CTA */}
            <article style={{ maxWidth: '800px', margin: '0 auto', padding: '0 1rem' }}> {/* Mantenemos el estilo para legibilidad */}
              <header style={{ marginBottom: '2rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
                {/* El título principal ya está en el BreadcrumbItem o como H1 de la página (metadata) */}
                {/* Aquí podemos mostrar de nuevo el título si el diseño lo requiere, o enfocarnos en metadatos */}
                {/* <h1 style={{ fontSize: '2.5em', marginBottom: '0.5rem' }}>{post.title}</h1> */}
                <div style={{ color: '#555', marginBottom: '1rem', textAlign: 'center' }}>
                  <span>Publicado el: {formattedDate}</span>
                  {post.author && <span> por {post.author}</span>}
                </div>
                {post.category && <p style={{ fontStyle: 'italic', textAlign: 'center' }}>Categoría: {post.category}</p>}
              </header>
              
              <div
                className="post-content prose dark:prose-invert lg:prose-xl max-w-none" // Clase para estilizar el contenido Markdown
                dangerouslySetInnerHTML={{ __html: post.contentHtml }}
                // Eliminamos los estilos inline de aquí para que se controlen por CSS global o .post-content
              />
              
              {/* Pie del artículo como tags, autor, etc. podría ir aquí */}
              {post.tags && Array.isArray(post.tags) && post.tags.length > 0 && (
                <div className="mt-8 pt-4 border-t">
                  <span className="font-semibold">Etiquetas: </span>
                  {post.tags.map((tag: string) => (
                    <Link key={tag} href={`/blog/tag/${tag.toLowerCase().replace(/\s+/g, '-')}`} legacyBehavior>
                      <a className="ml-2 inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 hover:bg-gray-300">
                        #{tag}
                      </a>
                    </Link>
                  ))}
                </div>
              )}
            </article>
          </div>
          {/* --- Fin Contenido del Post Individual --- */}
          
          <CtaOne />
        </main>
        <footer id="footer">
          <Footer />
        </footer>
      </div >
    </>
  );
}