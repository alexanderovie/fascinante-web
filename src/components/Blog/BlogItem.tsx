// src/components/Blog/BlogItem.tsx
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
// import { BlogType } from '@/type/BlogType'; // Ya no se usa BlogType
import { PostSummary, PostData } from '.././../type/posts'; // Usar los nuevos tipos
import * as Icon from "@phosphor-icons/react/dist/ssr";
// Ya no necesitas 'slugify' aquí si el slug viene del frontmatter

interface BlogItemProps {
    data: PostSummary | PostData; // Acepta cualquiera de los dos, o sé más específico
    type: 'grid' | 'list-one' | 'list-two'; // Tipos de layout
}

const BlogItem: React.FC<BlogItemProps> = ({ data, type }) => {
    // El slug ahora viene directamente de data.slug (frontmatter)
    const slug = data.slug;

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'Fecha no disponible';
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    // Renderizado condicional basado en 'type'
    // Asegúrate de que los campos que usas (data.coverImage, data.title, data.category, data.author, data.date, data.excerpt)
    // estén definidos en tu interfaz PostSummary/PostData y presentes en tu frontmatter.

    if (type === 'grid') {
        return (
            <div className="blog-item">
                <Link
                    className="blog-item-main h-full block bg-white border border-line overflow-hidden rounded-2xl hover-box-shadow duration-500"
                    href={`/blog/${slug}`} // Usar el slug directamente
                    // 'as' prop ya no es necesaria con App Router si href es la ruta canónica
                >
                    <div className="bg-img w-full overflow-hidden aspect-[4/3]"> {/* Añadido aspect-ratio para consistencia */}
                        <Image
                            width={400} height={300} // Tamaños representativos
                            className="w-full h-full block object-cover"
                            src={data.coverImage || "/images/blog/fascinante-blog-placeholder.webp"}
                            alt={data.title}
                        />
                    </div>
                    <div className="infor sm:p-6 p-4">
                        {data.category && (
                             <div className="caption2 py-1 px-3 bg-surface rounded-full inline-block capitalize">{data.category}</div>
                        )}
                        <div className="heading6 mt-2 line-clamp-2">{data.title}</div> {/* line-clamp para títulos largos */}
                        <div className="date flex items-center gap-4 mt-2">
                            {/* data.author ya no está en PostSummary, necesitarías añadirlo o pasarlo */}
                            {/* <div className="author caption2 text-secondary">by <span className="text-on-surface">{data.author}</span></div> */}
                            {data.date && (
                                <div className="item-date flex items-center">
                                    <Icon.CalendarBlank weight='bold' />
                                    <span className="ml-1 caption2">{formatDate(data.date)}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </Link>
            </div>
        );
    }

    if (type === 'list-one') {
        return (
            <Link
                className="blog-item flex max-md:flex-col md:items-center gap-7 gap-y-5"
                href={`/blog/${slug}`}
            >
                <div className="w-full md:w-1/2">
                    <div className="bg-img w-full overflow-hidden rounded-2xl aspect-video md:aspect-[4/3]">
                        <Image
                            width={500} height={375} // Tamaños representativos
                            className="w-full h-full block object-cover"
                            src={data.coverImage || "/images/blog/fascinante-blog-placeholder.webp"}
                            alt={data.title}
                        />
                    </div>
                </div>
                <div className="w-full md:w-1/2">
                    {data.category && (
                        <div className="caption2 py-1 px-3 bg-surface rounded-full inline-block capitalize">{data.category}</div>
                    )}
                    <div className="heading6 mt-2 line-clamp-2">{data.title}</div>
                    <div className="date flex items-center gap-4 mt-2">
                        {/* data.author no está en PostSummary por defecto */}
                        {/* <div className="author caption2 text-secondary">by <span className="text-on-surface">{data.author} </span></div> */}
                        {data.date && (
                            <div className="item-date flex items-center">
                                <Icon.CalendarBlank weight='bold' />
                                <span className="ml-1 caption2">{formatDate(data.date)}</span>
                            </div>
                        )}
                    </div>
                    {data.excerpt && (
                        <div className="body3 text-secondary mt-4 pb-4 line-clamp-3">{data.excerpt}</div>
                    )}
                    <div className="read font-bold underline">Read More</div>
                </div>
            </Link>
        );
    }

    // Puedes añadir 'list-two' si lo necesitas, similar a 'list-one'
    // if (type === 'list-two') { ... }

    return null; // Fallback si el tipo no es reconocido
};

export default BlogItem;