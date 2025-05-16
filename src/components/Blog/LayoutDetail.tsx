// src/components/Blog/LayoutDetailOne.tsx
'use client'

import React, { useState } from 'react';
// import blogData from '@/data/blog.json' // <<--- ELIMINADO
import * as Icon from "@phosphor-icons/react/dist/ssr";
import { useRouter } from 'next/navigation';
// import { BlogType } from '@/type/BlogType'; // <<--- ELIMINADO, usaremos PostData
import Link from 'next/link';
import Image from 'next/image';
import { PostData } from '@/lib/posts'; // <<--- IMPORTANTE: Tipo para los datos del post desde Markdown

// Interfaz para los resúmenes de posts (para recientes, siguiente, anterior)
interface PostSummary {
  slug: string;
  title: string;
  date?: string;
  coverImage?: string; // Campo para la imagen de portada desde frontmatter
  // Agrega otros campos que necesites para el resumen
}

interface LayoutDetailOneProps {
  post: PostData; // El post actual, incluye frontmatter y contentHtml
  recentPosts: PostSummary[]; // Lista de posts recientes
  allCategories: string[];    // Lista de todas las categorías únicas
  allTags: string[];          // Lista de todas las etiquetas únicas
  nextPost: PostSummary | null; // Información del post siguiente
  prevPost: PostSummary | null; // Información del post anterior
}

const LayoutDetailOne: React.FC<LayoutDetailOneProps> = ({
  post,
  recentPosts,
  allCategories,
  allTags,
  nextPost,
  prevPost
}) => {
  const [selectedCategoryUI, setSelectedCategoryUI] = useState<string | null>(''); // Para el estado visual del filtro
  const [selectedTagUI, setSelectedTagUI] = useState<string | null>(''); // Para el estado visual del filtro
  const router = useRouter();

  const handleCategoryClick = (category: string) => {
    setSelectedCategoryUI(category);
    router.push(`/blog?category=${encodeURIComponent(category.toLowerCase())}`);
  }

  const handleTagClick = (tag: string) => {
    setSelectedTagUI(tag);
    router.push(`/blog?tag=${encodeURIComponent(tag.toLowerCase())}`);
  }

  const handleGoToPrevPost = () => {
    if (prevPost) {
      router.push(`/blog/${prevPost.slug}`);
    }
  };

  const handleGoToNextPost = () => {
    if (nextPost) {
      router.push(`/blog/${nextPost.slug}`);
    }
  };

  // Formatear fecha (opcional, puedes hacerlo donde obtienes los datos también)
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Fecha no disponible';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className='list-blog lg:py-[100px] sm:py-16 py-10'>
      <div className="container">
        <div className="flex max-lg:flex-col-reverse gap-y-10">
          {/* --- BARRA LATERAL --- */}
          <div className="w-full lg:w-1/3 lg:pr-[55px]">
            <div className="search-block rounded-lg bg-surface h-[50px] relative">
              <input className="rounded-lg bg-surface w-full h-full pl-4 pr-12" type="text" placeholder="Search (funcionalidad pendiente)" />
              <Icon.MagnifyingGlass className='absolute top-1/2 -translate-y-1/2 right-4 text-xl cursor-pointer' />
            </div>

            <div className="cate-block md:mt-10 mt-6">
              <div className="heading7">Categories</div>
              <div className="list-nav mt-4">
                {allCategories.map(item => (
                  <div
                    key={item}
                    className={`nav-item rounded-lg flex items-center justify-between p-3 cursor-pointer text-button text-secondary capitalize ${item === selectedCategoryUI ? 'active' : ''}`}
                    onClick={() => handleCategoryClick(item)}
                  >
                    {item}
                    <Icon.CaretRight weight="bold" />
                  </div>
                ))}
              </div>
            </div>

            <div className="recent-post-block md:mt-10 mt-6">
              <div className="recent-post-heading heading7">Recent Posts</div>
              <div className="list-recent-post flex flex-col gap-6 mt-4">
                {recentPosts.slice(0, 3).map(item => ( // Mostrar, por ejemplo, los 3 más recientes
                  <Link
                    key={item.slug}
                    href={`/blog/${item.slug}`}
                    className="recent-post-item flex items-start gap-4 cursor-pointer"
                  >
                    <div className="item-img flex-shrink-0 w-20 h-20 rounded">
                      <Image width={80} height={80} src={item.coverImage || "/images/blog/fascinante-blog-placeholder.webp"} alt={item.title} className='w-full h-full object-cover' />
                    </div>
                    <div className="item-infor w-full">
                      {item.date && (
                        <div className="item-date flex items-center">
                          <Icon.CalendarBlank weight='bold' />
                          <span className="ml-1 caption2">{formatDate(item.date)}</span>
                        </div>
                      )}
                      <div className="item-title mt-1">{item.title}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="tags-popular-block md:mt-10 mt-6">
              <div className="tag-heading heading7">Popular Tags</div>
              <div className="list-tag mt-4 flex flex-wrap gap-3">
                {allTags.map(item => (
                  <div
                    key={item}
                    className={`caption2 py-2 px-4 bg-surface rounded-2xl hover:bg-black hover:text-white duration-300 cursor-pointer capitalize ${item === selectedTagUI ? 'active' : ''}`}
                    onClick={() => handleTagClick(item)}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* --- CONTENIDO PRINCIPAL DEL POST --- */}
          <div className="w-full lg:w-2/3">
            <div className="blog-paragraph">
              <div className="paragraph-heading">
                {/* Usar 'post.category' del frontmatter */}
                <span className="caption2 py-2 px-4 bg-surface rounded-2xl hover:bg-black hover:text-white capitalize">{post.category || 'General'}</span>
                <div className="heading4 mt-4">{post.title}</div>
                <div className="date flex items-center gap-4 mt-4">
                  {/* Usar 'post.author' del frontmatter */}
                  {post.author && <div className="author caption2 text-secondary">by <span className="text-black">{post.author}</span></div>}
                  <div className="item-date flex items-center">
                    <Icon.CalendarBlank weight='bold' />
                    {/* Usar 'post.date' del frontmatter */}
                    <span className="ml-1 caption2">{formatDate(post.date)}</span>
                  </div>
                </div>
                {/* Usar 'post.coverImage' del frontmatter */}
                {post.coverImage && (
                  <div className="bg-img mt-8">
                    <Image width={930} height={593} className="w-full rounded-2xl" src={post.coverImage} alt={post.title} priority />
                  </div>
                )}
              </div>

              {/* Renderizar el contenido HTML del Markdown */}
              {post.contentHtml && (
                <article
                  className="paragraph-content prose lg:prose-xl mt-8" // 'prose' de Tailwind Typography ayuda a estilizar
                  dangerouslySetInnerHTML={{ __html: post.contentHtml }}
                />
              )}
              {/*
                El contenido que antes estaba hardcodeado o venía de campos como `data.desc`, `data.listImg`,
                o las secciones "How to Saving Finacial", etc., ahora debería ser parte del contenido
                Markdown en tus archivos .md y se renderizará arriba con `post.contentHtml`.
                Si tienes elementos como `listImg` que son una galería específica y no parte del flujo
                de texto principal, deberías incluirlos en el frontmatter de tus archivos .md
                (ej. listImg: ['/path/to/img1.jpg', '/path/to/img2.jpg'])
                y luego iterar sobre `post.listImg` aquí para renderizarlos, similar a como lo hacías antes.
                Por ahora, este ejemplo asume que todo el contenido principal está en `post.contentHtml`.
              */}
            </div>

            <div className="blog-more-infor mt-8">
              <div className="infor-above flex items-center justify-between flex-wrap gap-6">
                <div className="tags-cloud-block flex items-center gap-3 max-sm:flex-wrap">
                  <div className="body3">Tag(s):</div>
                  <div className="list-nav flex items-center gap-3 max-sm:flex-wrap">
                    {/* Usar 'post.tags' del frontmatter (asumiendo que es un array) */}
                    {post.tags && post.tags.map(tag => (
                      <span
                        key={tag}
                        className="caption2 py-2 px-4 bg-surface rounded-2xl hover:bg-black hover:text-white duration-300 cursor-pointer capitalize"
                        onClick={() => handleTagClick(tag)}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="share-block flex items-center gap-4 max-sm:flex-wrap">
                  {/* Mantener tu lógica de compartir, o mejorarla */}
                  <div className="caption2 py-2 px-4 rounded-lg border border-line">Copy the link</div>
                  <div className="social-media flex items-center gap-3 max-sm:flex-wrap">
                    <a href="http://facebook.com" target="_blank" className='w-10 h-10 flex items-center justify-center bg-surface rounded-full hover-box-shadow hover:bg-white duration-300'><i className="icon-facebook text-black"></i></a>
                    <a href="http://linkedin.com" target="_blank" className='w-10 h-10 flex items-center justify-center bg-surface rounded-full hover-box-shadow hover:bg-white duration-300'><i className="icon-in text-black"></i></a>
                    <a href="http://twitter.com" target="_blank" className='w-10 h-10 flex items-center justify-center bg-surface rounded-full hover-box-shadow hover:bg-white duration-300'><i className="icon-twitter text-black text-sm"></i></a>
                    <a href="http://instagram.com" target="_blank" className='w-10 h-10 flex items-center justify-center bg-surface rounded-full hover-box-shadow hover:bg-white duration-300'><i className="icon-insta text-black text-sm"></i></a>
                    <a href="http://youtube.com" target="_blank" className='w-10 h-10 flex items-center justify-center bg-surface rounded-full hover-box-shadow hover:bg-white duration-300'><i className="icon-youtube text-black text-xs"></i></a>
                  </div>
                </div>
              </div>
              <div className="mt-8 border border-line"></div>
              <div className="infor-below flex max-sm:flex-wrap items-center justify-between gap-6 py-5">
                <div className="prev-block">
                  {prevPost ? (
                    <div className="text-left cursor-pointer" onClick={handleGoToPrevPost}>
                      <div className="text-button-uppercase text-blue">Previous</div>
                      <div className="heading7 mt-1">{prevPost.title}</div>
                    </div>
                  ) : (
                    <div>&nbsp;</div> {/* Placeholder si no hay post anterior */}
                  )}
                </div>
                <div className="next-block">
                  {nextPost ? (
                    <div className="sm:text-right cursor-pointer" onClick={handleGoToNextPost}>
                      <div className="text-button-uppercase text-blue">Next</div>
                      <div className="heading7 mt-1">{nextPost.title}</div>
                    </div>
                  ) : (
                    <div>&nbsp;</div> {/* Placeholder si no hay post siguiente */}
                  )}
                </div>
              </div>
              <div className="border border-line"></div>
            </div>

            {/* El formulario de comentarios se puede mantener como está,
                pero su lógica de envío necesitará ser implementada. */}
            <div className="blog-form-contact mt-8 md:p-10 p-7 bg-surface rounded-xl">
              <div className="heading7">Leave a Comment</div>
              <form className="form-contact-input mt-6">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="w-full">
                    <div className="body3 pb-3">Name</div>
                    <input className="bg-white rounded-lg p-4 w-full" type="text" placeholder="Alexander" required />
                  </div>
                  <div className="w-full">
                    <div className="body3 pb-3">Email</div>
                    <input className="bg-white rounded-lg p-4 w-full" type="email" placeholder="usuario@mail.com" required />
                  </div>
                  <div className="w-full sm:col-span-2">
                    <div className="body3 pb-3">Comment</div>
                    <textarea className="bg-white rounded-lg w-full p-4" rows={3} placeholder="Write comment..." required ></textarea>
                  </div>
                  <div className="w-full sm:col-span-2 flex items-center">
                    <input type="checkbox" id='check' name="check" />
                    <label htmlFor='check' className="caption1 pl-2">Save my name, email, and website in this browser for the next time I comment.</label>
                  </div>
                </div>
                <div className="button-block mt-8">
                  <button className="button-main hover:bg-black bg-blue text-white text-button rounded-full">Submit Comment</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LayoutDetailOne;
