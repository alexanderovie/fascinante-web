// Este es tu componente Project (Fascinante Digital) actualizado
'use client'

import Image from "next/image"
import Link from "next/link"
import * as Icon from "@phosphor-icons/react/dist/ssr";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css/bundle'; // Estilos base de Swiper

// Asumiendo que tienes un alias '@/' para tu carpeta 'src/'
// Si no, la ruta a projects.json podría ser algo como '../data/projects.json' o similar
import projectsData from '@/data/projects.json';
// Ajusta esta ruta según la ubicación real de tu archivo ProjectType.ts
import type { ProjectType } from '../../../type/ProjectType';

const Project = () => {
    const typedProjectsData: ProjectType[] = projectsData;

    return (
        <div className="our-project-block lg:mt-[100px] sm:mt-16 mt-10">
            <div className="container">
                <div className="heading3 text-center">Our Featured Prrojects</div>
                <div className="body2 text-secondary mt-3 text-center">Explore how Fascinante Digital has transformed businesses with innovative digital strategies.</div>
            </div>
            <div className="list-project md:mt-10 mt-7">
                <Swiper
                    spaceBetween={0}
                    slidesPerView={1} // Por defecto, 1 slide visible en pantallas pequeñas
                    loop={true}
                    pagination={{ clickable: true }} // Habilita la paginación clickeable
                    speed={400} // Velocidad de la transición
                    modules={[Pagination, Autoplay]} // Módulos a usar
                    className='h-full relative' // Clases para el contenedor de Swiper
                    autoplay={{
                        delay: 4000, // Autoplay cada 4 segundos
                        disableOnInteraction: false, // No detener autoplay en interacción manual
                    }}
                    breakpoints={{
                        // Cuando el ancho de la ventana es >= 640px
                        640: {
                            slidesPerView: 2,
                            spaceBetween: 10,
                        },
                        // Cuando el ancho de la ventana es >= 1024px
                        1024: {
                            slidesPerView: 3,
                            spaceBetween: 10,
                        },
                        // Cuando el ancho de la ventana es >= 1280px
                        1280: {
                            slidesPerView: 4,
                            spaceBetween: 10,
                        }
                    }}
                >
                    {typedProjectsData.map((project) => (
                        <SwiperSlide key={project.id}>
                            {/* El div con className="item" recibirá los estilos base y hover del SCSS */}
                            <div className="item">
                                <div className="bg-img overflow-hidden"> {/* Contenedor de la imagen */}
                                    <Image
                                        width={472} // Proporciona el ancho intrínseco o deseado
                                        height={354} // Proporciona el alto intrínseco o deseado
                                        className="w-full h-full" // La imagen llenará su contenedor 'bg-img'
                                        src={project.imageSrc}
                                        alt={project.imageAlt}
                                        // Considera añadir 'priority' a las primeras imágenes si son LCP
                                        // priority={index < 2} // Ejemplo, si 'index' está disponible
                                    />
                                    {/* El degradado se aplicará a través de .item::after o .bg-img::after en CSS */}
                                </div>
                                <Link className="text" href={project.link}>
                                    <div className="heading5 text-white">{project.title}</div>
                                    <div className="body3 text-white mt-1">{project.subtitle}</div>
                                </Link>
                                <Link
                                    className="arrow w-[52px] h-[52px] flex items-center justify-center bg-white rounded-full hover:text-white"
                                    href={project.link}
                                    aria-label={`Read more about ${project.title}`} // Mejor accesibilidad
                                >
                                    <Icon.ArrowRight className="text-3xl" />
                                </Link>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    )
}
export default Project;