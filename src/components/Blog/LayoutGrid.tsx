// src/components/Blog/LayoutGrid.tsx
'use client'

import React, { useState, useEffect } from 'react'; // useEffect puede ser necesario si los filtros se resetean de alguna forma más compleja o si interactúas con el router para los query params
import { useSearchParams } from 'next/navigation';
// import blogData from '@/data/blog.json' // <<--- YA NO IMPORTAMOS blogData.json DIRECTAMENTE
import BlogItem from '@/components/Blog/BlogItem';
import HandlePagination from '@/components/Other/HandlePagination';
import { PostData } from '@/lib/posts'; // <<--- IMPORTAMOS LA INTERFAZ PostData

interface LayoutGridProps {
  posts: PostData[]; // <<--- 1. ACEPTAMOS 'posts' COMO PROP
}

const LayoutGrid: React.FC<LayoutGridProps> = ({ posts }) => { // <<--- 1. DESESTRUCTURAMOS 'posts' DE LAS PROPS
  const [currentPage, setCurrentPage] = useState(0);
  const productsPerPage = 9; // Puedes ajustar esto
  const offset = currentPage * productsPerPage;

  const searchParams = useSearchParams();
  // Obtenemos los parámetros de la URL para el filtrado
  // Es importante que los valores de 'category' y 'tag' en tu frontmatter coincidan con lo que esperas aquí.
  const dataCategory = searchParams.get('category');
  const dataTag = searchParams.get('tag');

  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [tagFilter, setTagFilter] = useState<string | null>(null);

  // Actualizar filtros si cambian los searchParams (esto es opcional, depende de cómo quieras que funcionen los filtros)
  // Si los filtros solo se establecen por botones en esta página, este useEffect podría no ser necesario
  // o podría necesitar lógica adicional para sincronizar con la URL si los botones actualizan la URL.
  useEffect(() => {
    setCategoryFilter(dataCategory);
    setTagFilter(dataTag);
    setCurrentPage(0); // Resetear a la primera página cuando cambian los filtros
  }, [dataCategory, dataTag]);


  // Lógica para manejar el click en un botón de categoría (ejemplo, si tienes botones de filtro)
  // Esta función es un ejemplo, necesitarías botones que la llamen.
  // Por ahora, el filtrado se basa en los query params de la URL.
  // const handleCategory = (category: string) => {
  //   setCategoryFilter(prevCategory => prevCategory === category ? null : category);
  //   setCurrentPage(0);
  // }

  // const handleTag = (tag: string) => {
  //   setTagFilter(prevTag => prevTag === tag ? null : tag);
  //   setCurrentPage(0);
  // }

  // 2. FILTRAMOS LOS 'posts' RECIBIDOS POR PROPS
  let filteredData = posts.filter(post => {
    let isCategoryMatched = true;
    if (categoryFilter) {
      // Asegúrate que 'post.category' exista en tu frontmatter y coincida con categoryFilter
      isCategoryMatched = post.category?.toLowerCase() === categoryFilter.toLowerCase();
    }

    let isTagMatched = true;
    if (tagFilter) {
      // Para tags, si un post puede tener múltiples tags, la lógica sería diferente.
      // Asumiendo que 'post.tags' es un array en tu frontmatter:
      // isTagMatched = post.tags?.map(t => t.toLowerCase()).includes(tagFilter.toLowerCase());
      // Si 'post.tags' es un solo string (como en tu JSON original 'item.tag'):
      isTagMatched = post.tags?.some(t => t.toLowerCase() === tagFilter.toLowerCase()) || post.category?.toLowerCase() === tagFilter.toLowerCase(); // Ajusta según tu estructura de 'tags' en frontmatter
    }

    return isCategoryMatched && isTagMatched;
  });

  // Manejo si no hay datos después de filtrar
  // No crearemos un item 'no-data' artificial, simplemente mostraremos un mensaje si currentBlogs está vacío.

  const pageCount = Math.ceil(filteredData.length / productsPerPage);

  // Si pageCount es 0 (no hay datos filtrados), currentPage debe ser 0.
  // Esto ya se maneja al resetear currentPage a 0 cuando cambian los filtros.
  // Y si filteredData está vacío, currentBlogs también lo estará.

  const currentBlogs = filteredData.slice(offset, offset + productsPerPage);

  const handlePageChange = (selectedPage: { selected: number }) => {
    setCurrentPage(selectedPage.selected);
  };

  return (
    <div className='list-blog lg:py-[100px] sm:py-16 py-10'>
      <div className="container">
        {currentBlogs.length > 0 ? (
          <div className="list grid lg:grid-cols-3 sm:grid-cols-2 gap-8">
            {currentBlogs.map(item => (
              // 3. PASAMOS EL 'item' (que ahora es PostData) A BlogItem
              //    El 'key' debería ser único, 'item.slug' es una buena opción si es único.
              //    O si tienes un 'id' en tu frontmatter, úsalo.
              <BlogItem key={item.slug || item.originalId} data={item} type='grid' />
            ))}
          </div>
        ) : (
          <div className="no-data-blog text-center py-10">
            No hay artículos que coincidan con los criterios seleccionados.
          </div>
        )}

        {pageCount > 1 && (
          <div className="list-pagination w-full flex items-center justify-center md:mt-10 mt-6">
            {/* Asegúrate que HandlePagination espera 'onPageChange' con el formato correcto */}
            <HandlePagination pageCount={pageCount} onPageChange={handlePageChange} />
          </div>
        )}
      </div>
    </div>
  );
}

export default LayoutGrid;
