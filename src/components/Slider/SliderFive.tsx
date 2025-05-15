// src/components/Slider/SliderFive.tsx (o la ruta correcta de tu componente)
'use client'

import React, { useState, useEffect, useRef } from "react"; // Importa los hooks de React necesarios
import Image from "next/image" // Importa el componente Image de Next.js para optimización de imágenes
import Link from "next/link" // Importa el componente Link de Next.js para navegación
import * as Icon from "@phosphor-icons/react/dist/ssr"; // Importa iconos de la librería Phosphor-icons
import SwiperCore from 'swiper'; // Importa SwiperCore para manipulación directa de Swiper
import { Swiper, SwiperSlide } from 'swiper/react'; // Importa los componentes Swiper y SwiperSlide
import { Autoplay, Navigation, Pagination } from 'swiper/modules'; // Importa los módulos necesarios de Swiper
import 'swiper/css/bundle'; // Importa los estilos CSS de Swiper

// Inicializa los módulos de Swiper que se van a utilizar
SwiperCore.use([Autoplay, Navigation, Pagination]);

// Componente funcional para el carrusel/slider principal
const SliderFive = () => {
    // Estado para gestionar si Swiper está listo para iniciar el autoplay
    const [isSwiperReadyForAutoplay, setIsSwiperReadyForAutoplay] = useState(false);
    // Ref para almacenar la instancia de Swiper y poder interactuar con ella
    const swiperRef = useRef<SwiperCore | null>(null);

    useEffect(() => {
        // Este efecto se ejecuta una vez después de que el componente se monta.
        // Introducimos un pequeño retraso para asegurar que la pintura inicial y los elementos LCP
        // probablemente estén establecidos antes de iniciar la función de autoplay del slider.
        const initialDelayTimer = setTimeout(() => {
            setIsSwiperReadyForAutoplay(true); // Indica que Swiper ya puede iniciar el autoplay
            // Si la instancia de Swiper existe y tiene la funcionalidad de autoplay, la inicia explícitamente.
            if (swiperRef.current && swiperRef.current.autoplay) {
                swiperRef.current.autoplay.start();
            }
        }, 500); // Retraso de 500ms antes de habilitar el autoplay. Ajusta este valor si es necesario.

        // Función de limpieza para limpiar el temporizador si el componente se desmonta
        return () => clearTimeout(initialDelayTimer);
    }, []); // El array de dependencias vacío significa que este efecto se ejecuta solo una vez (al montar)

    return (
        <>
            {/* Contenedor principal para el bloque del slider */}
            <div className="slider-block style-one">
                {/* Flecha de navegación previa */}
                <div className="prev-arrow flex items-center justify-center cursor-pointer">
                    <Icon.CaretLeft className="text-white heading6" weight="bold" />
                </div>

                {/* Contenedor principal de Swiper */}
                <div className="slider-main">
                    <Swiper
                        // Callback para obtener la instancia de Swiper cuando se inicializa
                        onSwiper={(swiper) => {
                            swiperRef.current = swiper; // Almacena la instancia en la ref
                        }}
                        spaceBetween={0} // Espacio entre slides
                        slidesPerView={1} // Número de slides visibles a la vez
                        navigation={{ // Configuración de las flechas de navegación
                            prevEl: '.prev-arrow', // Selector para la flecha previa
                            nextEl: '.next-arrow', // Selector para la flecha siguiente
                        }}
                        loop={true} // Habilita el bucle infinito del carrusel
                        pagination={{ clickable: true }} // Habilita los puntos de paginación clickeables
                        speed={600} // Velocidad de la transición entre slides (originalmente 400, puedes ajustarlo)
                        // Configuración del Autoplay:
                        // Inicialmente está configurado como 'false'.
                        // Se iniciará efectivamente a través del hook useEffect.
                        autoplay={isSwiperReadyForAutoplay ? {
                            delay: 6000, // Retraso del autoplay en milisegundos (aumentado desde 4000)
                            disableOnInteraction: false, // Mantenlo en 'false' si quieres que el autoplay continúe después de la interacción del usuario
                        } : false}
                        modules={[Pagination, Autoplay, Navigation]} // Módulos a utilizar por Swiper
                        className='h-full relative' // Clases de Tailwind para estilizar Swiper
                    >
                        {/* --- Slide 1: Tema "SEO Audit" --- */}
                        {/* Este es el primer slide, crítico para el LCP */}
                        <SwiperSlide>
                            <div className="slider-item slider-first">
                                {/* Imagen oculta en móviles, visible desde 'sm' (small screens) hacia arriba */}
                                <div className="bg-img hidden sm:block">
                                    <Image
                                        src={'/images/slider/client-smiling.webp'} // Fuente de la imagen
                                        width={4000} // Ancho intrínseco de la imagen
                                        height={3000} // Alto intrínseco de la imagen
                                        alt="Woman smiling, representing a happy client after an SEO audit." // Texto alternativo descriptivo (en inglés para el copy)
                                        priority={true} // CRÍTICO para LCP: Carga esta imagen con alta prioridad
                                        className="w-full h-full object-cover" // Estilos de Tailwind
                                    />
                                </div>
                                <div className="container">
                                    <div className="text-content flex flex-col justify-between">
                                        {/* Encabezado para Auditoría SEO - Considera convertir esto en un H1 si es el héroe principal de la página */}
                                        <div className="heading2"> {/* O una etiqueta H1 */}
                                            <div className="relative overflow-hidden">
                                                <span className="block relative overflow-hidden">Uncover Hidden</span>
                                                <span className="block absolute top-0 left-0 w-full h-full">Uncover Hidden</span>
                                            </div>
                                            <div className="relative overflow-hidden">
                                                <span className="block relative overflow-hidden">SEO Insights with</span>
                                                <span className="block absolute top-0 left-0 w-full h-full">SEO Insights with</span>
                                            </div>
                                            <div className="relative overflow-hidden">
                                                <span className=" text-blue block relative overflow-hidden">Your Free Audit</span>
                                                <span className=" text-blue block absolute top-0 left-0 w-full h-full">Your Free Audit</span>
                                            </div>
                                        </div>
                                        {/* Descripción para Auditoría SEO */}
                                        <div className="body2 mt-3 text-secondary">Our comprehensive audit uncovers hidden issues and <br /> untapped strengths for top search rankings.</div>
                                        {/* Botón CTA para Auditoría SEO */}
                                        <div className="button-block md:mt-10 mt-6">
                                            <Link className="button-main bg-blue text-white" href="/services/website-audit">Start Your Audit</Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>

                        {/* --- Slide 2: Tema "Discover Opportunities" --- */}
                        <SwiperSlide>
                            <div className="slider-item slider-second">
                                {/* Imagen oculta en móviles, visible desde 'sm' hacia arriba */}
                                <div className="bg-img hidden sm:block">
                                    <Image
                                        src={'/images/slider/customer-happy.webp'} // Fuente de la imagen
                                        width={4000} // Ancho intrínseco
                                        height={3000} // Alto intrínseco
                                        alt="Happy customer discovering growth opportunities online." // Texto alternativo descriptivo (en inglés)
                                        loading="lazy" // Carga diferida (lazy load) para imágenes subsecuentes
                                        className="w-full h-full object-cover" // Estilos de Tailwind
                                    />
                                </div>
                                <div className="container">
                                    <div className="text-content flex flex-col justify-between">
                                        {/* Encabezado para Descubrir Oportunidades */}
                                        <div className="heading2">
                                            <div className="relative overflow-hidden">
                                                <span className="block relative overflow-hidden">Discover Your</span>
                                                <span className="block absolute top-0 left-0 w-full h-full">Discover Your</span>
                                            </div>
                                            <div className="relative overflow-hidden">
                                                <span className="block relative overflow-hidden">Untapped Growth</span>
                                                <span className="block absolute top-0 left-0 w-full h-full">Untapped Growth</span>
                                            </div>
                                            <div className="relative overflow-hidden">
                                                <span className=" text-blue block relative overflow-hidden">Opportunities Online</span>
                                                <span className=" text-blue block absolute top-0 left-0 w-full h-full">Opportunities Online</span>
                                            </div>
                                        </div>
                                        {/* Descripción para Descubrir Oportunidades */}
                                        <div className="body2 mt-3 text-secondary">We pinpoint fresh strategies to expand your <br /> reach and drive more significant conversions.</div>
                                        {/* Botón CTA para Descubrir Oportunidades */}
                                        <div className="button-block md:mt-10 mt-6">
                                            <Link className="button-main bg-blue text-white" href="/services/website-audit">Explore Options</Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>

                        {/* --- Slide 3: Tema "Online Visibility" --- */}
                        <SwiperSlide>
                            <div className="slider-item slider-third">
                                {/* Imagen oculta en móviles, visible desde 'sm' hacia arriba */}
                                <div className="bg-img hidden sm:block">
                                    <Image
                                        src={'/images/slider/team-working.webp'} // Fuente de la imagen
                                        width={4000} // Ancho intrínseco
                                        height={3000} // Alto intrínseco
                                        alt="Digital marketing team working together to boost online visibility." // Texto alternativo descriptivo (en inglés)
                                        loading="lazy" // Carga diferida para imágenes subsecuentes
                                        className="w-full h-full object-cover" // Estilos de Tailwind
                                    />
                                </div>
                                <div className="container">
                                    <div className="text-content flex flex-col justify-between">
                                        {/* Encabezado para Visibilidad Online */}
                                        <div className="heading2">
                                            <div className="relative overflow-hidden">
                                                <span className="block relative overflow-hidden">Boost Your Online</span>
                                                <span className="block absolute top-0 left-0 w-full h-full">Boost Your Online</span>
                                            </div>
                                            <div className="relative overflow-hidden">
                                                <span className="block relative overflow-hidden">Visibility & Get</span>
                                                <span className="block absolute top-0 left-0 w-full h-full">Visibility & Get</span>
                                            </div>
                                            <div className="relative overflow-hidden">
                                                <span className=" text-blue block relative overflow-hidden">Noticed by More</span>
                                                <span className=" text-blue block absolute top-0 left-0 w-full h-full">Noticed by More</span>
                                            </div>
                                        </div>
                                        {/* Descripción para Visibilidad Online */}
                                        <div className="body2 mt-3 text-secondary">Ensure your business is seen by the right <br /> customers across all digital platforms.</div>
                                        {/* Botón CTA para Visibilidad Online */}
                                        <div className="button-block md:mt-10 mt-6">
                                            <Link className="button-main bg-blue text-white" href="/services/website-audit">Get Discovered</Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    </Swiper>
                </div>

                {/* Flecha de navegación siguiente */}
                <div className="next-arrow flex items-center justify-center cursor-pointer">
                    <Icon.CaretRight className="text-white heading6" weight="bold" />
                </div>
            </div>
        </>
    )
}

// Exporta el componente para que pueda ser usado en otras partes de la aplicación
export default SliderFive;
