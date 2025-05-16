// src/components/Blog/LayoutListOne.tsx
'use client'

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation'; // useRouter para navegación
// import blogData from '@/data/blog.json'; // <<--- ELIMINADO
import BlogItem from '@/components/Blog/BlogItem';
import HandlePagination from '@/components/Other/HandlePagination';
import * as Icon from "@phosphor-icons/react/dist/ssr";
import Link from 'next/link';
import Image from 'next/image';
import { PostData } from '@/lib/posts'; // <<--- IMPORTANTE: Tipo para los datos del post desde Markdown

// Interfaz para los resúmenes de posts (para recientes)
// Puedes moverla a src/types/ si la usas en más sitios
interface PostSummary {
  slug: string;
  title: string;
  date?: string;
  coverImage?: string; // Campo para la imagen de portada desde frontmatter
}

interface LayoutListOneProps {
  posts: PostData[];          // Todos los posts (frontmatter)
  recentPosts: PostSummary[]; // Lista de posts recientes para la sidebar
  allCategories: string[];    // Lista de todas las categorías únicas para la sidebar
  allTags: string[];          // Lista de todas las etiquetas únicas para la sidebar
}

const LayoutListOne: React.FC<LayoutListOneProps> = ({
  posts,
  recentPosts,
  allCategories,
  allTags
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const productsPerPage = 5; // Ajusta según necesites
  const offset = currentPage * productsPerPage;

  const searchParams = useSearchParams();
  const router = useRouter(); // Para la navegación al hacer clic en categorías/tags

  // Estado local para los filtros activos (leídos de la URL)
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [tagFilter, setTagFilter] = useState<string | null>(null);

  // Sincronizar filtros con los query params de la URL
  useEffect(() => {
    const currentCategory = searchParams.get('category');
    const currentTag = searchParams.get('tag');
    setCategoryFilter(currentCategory ? decodeURIComponent(currentCategory) : null);
    setTagFilter(currentTag ? decodeURIComponent(currentTag) : null);
    setCurrentPage(0); // Resetear a la primera página cuando cambian los filtros
  }, [searchParams]);

  const handleCategoryClick = (category: string) => {
    // Actualiza la URL para reflejar el filtro de categoría
    const params = new URLSearchParams(searchParams.toString());
    if (categoryFilter === category.toLowerCase()) {
      params.delete('category'); // Deseleccionar si se hace clic de nuevo
    } else {
      params.set('category', category.toLowerCase());
    }
    router.push(`/blog?${params.toString()}`);
  };

  const handleTagClick = (tag: string) => {
    // Actualiza la URL para reflejar el filtro de tag
    const params = new URLSearchParams(searchParams.toString());
    if (tagFilter === tag.toLowerCase()) {
      params.delete('tag'); // Deseleccionar si se hace clic de nuevo
    } else {
      params.set('tag', tag.toLowerCase());
    }
    router.push(`/blog?${params.toString()}`);
  };

  // Filtrar los 'posts' recibidos por props
  let filteredData = posts.filter(post => {
    let isCategoryMatched = true;
    if (categoryFilter) {
      // Asegúrate que 'post.category' exista en tu frontmatter
      isCategoryMatched = post.category?.toLowerCase() === categoryFilter;
    }

    let isTagMatched = true;
    if (tagFilter) {
      // Asumiendo que 'post.tags' es un array en tu frontmatter
      isTagMatched = post.tags?.map(t => t.toLowerCase()).includes(tagFilter) || false;
    }
    return isCategoryMatched && isTagMatched;
  });

  const pageCount = Math.ceil(filteredData.length / productsPerPage);
  const currentBlogs = filteredData.slice(offset, offset + productsPerPage);

  const handlePageChange = (selectedPage: { selected: number }) => {
    setCurrentPage(selectedPage.selected);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className='list-blog lg:py-[100px] sm:py-16 py-10'>
      <div className="container">
        <div className="flex max-lg:flex-col gap-y-10">
          {/* --- LISTA DE POSTS --- */}
          <div className="w-full lg:w-2/3">
            {currentBlogs.length > 0 ? (
              <div className="list flex flex-col gap-y-10">
                {currentBlogs.map(item => (
                  // Usar item.slug (o item.originalId si lo tienes) como key
                  // Pasar el 'item' (PostData) a BlogItem
                  <BlogItem key={item.slug} data={item} type='list-one' />
                ))}
              </div>
            ) : (
              <div className="no-data-blog text-center py-10">
                No hay artículos que coincidan con los criterios seleccionados.
              </div>
            )}
            {pageCount > 1 && (
              <div className="list-pagination w-full flex items-center justify-center md:mt-10 mt-6">
                <HandlePagination pageCount={pageCount} onPageChange={handlePageChange} />
              </div>
            )}
          </div>

          {/* --- BARRA LATERAL --- */}
          <div className="w-full lg:w-1/3 lg:pl-[55px]">
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
                    className={`nav-item rounded-lg flex items-center justify-between p-3 cursor-pointer text-button text-secondary capitalize ${item.toLowerCase() === categoryFilter ? 'active bg-blue text-white' : ''}`}
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
                    href={`/blog/${item.slug}`} // Usar el slug del frontmatter
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
                    className={`caption2 py-2 px-4 rounded-2xl hover:bg-black hover:text-white duration-300 cursor-pointer capitalize ${item.toLowerCase() === tagFilter ? 'active bg-black text-white' : 'bg-surface'}`}
                    onClick={() => handleTagClick(item)}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LayoutListOne;
