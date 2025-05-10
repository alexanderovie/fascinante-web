'use client'

import React from "react"; // Importa React
import Image from "next/image" // Importa el componente Image de Next.js para optimización de imágenes (aunque no se usará para el fondo, se mantiene por si se usa en otro lugar del componente)
import Link from "next/link" // Importa el componente Link de Next.js para la navegación en la aplicación
import * as Icon from "@phosphor-icons/react/dist/ssr"; // Importa todos los iconos de la biblioteca Phosphor-icons
import { Swiper, SwiperSlide } from 'swiper/react'; // Importa los componentes Swiper y SwiperSlide de Swiper
import { Autoplay, Navigation, Pagination } from 'swiper/modules'; // Importa los módulos necesarios de Swiper (Autoplay, Navigation, Pagination)
import 'swiper/css/bundle'; // Importa los estilos CSS de Swiper

// Componente funcional para el Slider/Carrusel principal
const SliderOne = () => {
    return (
        <>
            {/* Contenedor principal del bloque del slider */}
            <div className="slider-block style-one">
                {/* Flecha de navegación anterior */}
                <div className="prev-arrow flex items-center justify-center">
                    <Icon.CaretLeft className="text-white heading6" weight="bold" />
                </div>
                {/* Contenedor principal del Swiper */}
                <div className="slider-main">
                    <Swiper
                        spaceBetween={0} // Espacio entre diapositivas
                        slidesPerView={1} // Número de diapositivas visibles a la vez
                        navigation={{ // Configuración de la navegación con flechas
                            prevEl: '.prev-arrow', // Selector para la flecha anterior
                            nextEl: '.next-arrow', // Selector para la flecha siguiente
                        }}
                        loop={true} // Habilita el bucle infinito del slider
                        pagination={{ clickable: true }} // Habilita la paginación con puntos clicables
                        speed={400} // Velocidad de transición entre diapositivas
                        modules={[Pagination, Autoplay, Navigation]} // Módulos a utilizar
                        className='h-full relative' // Clases de Tailwind para el estilo del Swiper
                        autoplay={{ // Configuración del autoplay
                            delay: 4000, // Retraso en milisegundos entre transiciones automáticas
                        }}
                    >
                        {/* --- Diapositiva 1: Tema "Auditoría SEO" con Degradado 1 --- */}
                        <SwiperSlide>
                            {/* Eliminados estilos en línea de depuración */}
                            <div className="slider-item slider-first">
                                {/* Fondo con degradado moderno 1 */}
                                <div className="bg-img bg-gradient-to-r from-blue-500 to-purple-600"> {/* Ejemplo de degradado Tailwind */}
                                    {/* Las imágenes de fondo ya no están aquí */}
                                </div>
                                {/* Contenido de texto y botón */}
                                {/* Añadida clase 'mx-auto' para centrar horizontalmente el contenedor */}
                                {/* Eliminados estilos en línea de depuración */}
                                <div className="container mx-auto"> {/* Añadida clase mx-auto */}
                                    {/* Clases para centrar horizontalmente y alinear texto en TODAS las vistas */}
                                    {/* Eliminados estilos en línea de depuración */}
                                    <div className="text-content flex-columns-between items-center text-center"> {/* 'items-center' y 'text-center' */}
                                        {/* Título Principal (Adaptado para Auditoría SEO) */}
                                        <div className="heading2">
                                            <div className="relative overflow-hidden">
                                                <span className="block relative overflow-hidden">Uncover Hidden</span>
                                                <span className="block absolute top-0 left-0 w-full h-full">Uncover Hidden</span>
                                            </div>
                                            <div className="relative overflow-hidden">
                                                <span className="block relative overflow-hidden">SEO Insights with</span>
                                                <span className="block absolute top-0 left-0 w-full h-full">SEO Insights with</span>
                                            </div>
                                            <div className="relative overflow-hidden">
                                                <span className=" text-white block relative overflow-hidden">Your Free Audit</span> {/* Título en blanco para mejor contraste */}
                                                <span className=" text-white block absolute top-0 left-0 w-full h-full">Your Free Audit</span> {/* Título en blanco para mejor contraste */}
                                            </div>
                                        </div>
                                        {/* Descripción / Tagline (Adaptado para Auditoría SEO) - Color original */}
                                        <div className="body2 mt-3 text-secondary">Our comprehensive audit uncovers hidden issues and <br /> untapped strengths for top search rankings.</div> {/* Color original */}
                                        {/* Bloque del botón CTA */}
                                        <div className="button-block md:mt-10 mt-6">
                                            {/* Botón CTA (Adaptado para Auditoría SEO) - Estilo original */}
                                            <Link className="button-main bg-blue text-white" href="/audit">Start Your Audit</Link> {/* Enlace a la página de auditoría */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>

                        {/* --- Diapositiva 2: Tema "Descubrir Oportunidades" con Degradado 2 --- */}
                        <SwiperSlide>
                            {/* Eliminados estilos en línea de depuración */}
                            <div className="slider-item slider-second">
                                {/* Fondo con degradado moderno 2 */}
                                <div className="bg-img bg-gradient-to-r from-teal-500 to-cyan-600"> {/* Ejemplo de degradado Tailwind */}
                                    {/* Las imágenes de fondo ya no están aquí */}
                                </div>
                                {/* Contenido de texto y botón */}
                                {/* Añadida clase 'mx-auto' para centrar horizontalmente el contenedor */}
                                {/* Eliminados estilos en línea de depuración */}
                                <div className="container mx-auto"> {/* Añadida clase mx-auto */}
                                     {/* Clases para centrar horizontalmente y alinear texto en TODAS las vistas */}
                                    {/* Eliminados estilos en línea de depuración */}
                                    <div className="text-content flex-columns-between items-center text-center"> {/* 'items-center' y 'text-center' */}
                                        {/* Título Principal (Adaptado para Descubrir Oportunidades) */}
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
                                                <span className=" text-white block relative overflow-hidden">Opportunities Online</span> {/* Título en blanco */}
                                                <span className=" text-white block absolute top-0 left-0 w-full h-full">Opportunities Online</span> {/* Título en blanco */}
                                            </div>
                                        </div>
                                        {/* Descripción / Tagline (Adaptado para Descubrir Oportunidades) - Color original */}
                                        <div className="body2 mt-3 text-secondary">We pinpoint fresh strategies to expand your <br /> reach and drive more significant conversions.</div> {/* Color original */}
                                        {/* Bloque del botón CTA */}
                                        <div className="button-block md:mt-10 mt-6">
                                            {/* Botón CTA (Adaptado para Descubrir Oportunidades) - Estilo original */}
                                            <Link className="button-main bg-blue text-white" href="/services">Explore Options</Link> {/* Enlace a la página de servicios/oportunidades */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>

                        {/* --- Diapositiva 3: Tema "Visibilidad en Línea" con Degradado 3 --- */}
                        <SwiperSlide>
                            {/* Eliminados estilos en línea de depuración */}
                            <div className="slider-item slider-third">
                                {/* Fondo con degradado moderno 3 */}
                                <div className="bg-img bg-gradient-to-r from-orange-500 to-red-600"> {/* Ejemplo de degradado Tailwind */}
                                    {/* Las imágenes de fondo ya no están aquí */}
                                </div>
                                {/* Contenido de texto y botón */}
                                {/* Añadida clase 'mx-auto' para centrar horizontalmente el contenedor */}
                                {/* Eliminados estilos en línea de depuración */}
                                <div className="container mx-auto"> {/* Añadida clase mx-auto */}
                                     {/* Clases para centrar horizontalmente y alinear texto en TODAS las vistas */}
                                    {/* Eliminados estilos en línea de depuración */}
                                    <div className="text-content flex-columns-between items-center text-center"> {/* 'items-center' y 'text-center' */}
                                        {/* Título Principal (Adaptado para Visibilidad en Línea) */}
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
                                                <span className=" text-white block relative overflow-hidden">Noticed by More</span> {/* Título en blanco */}
                                                <span className=" text-white block absolute top-0 left-0 w-full h-full">Noticed by More</span> {/* Título en blanco */}
                                            </div>
                                        </div>
                                        {/* Descripción / Tagline (Adaptado para Visibilidad en Línea) - Color original */}
                                        <div className="body2 mt-3 text-secondary">Ensure your business is seen by the right <br /> customers across all digital platforms.</div> {/* Color original */}
                                        {/* Bloque del botón CTA */}
                                        <div className="button-block md:mt-10 mt-6">
                                            {/* Botón CTA (Adaptado para Visibilidad en Línea) - Estilo original */}
                                            <Link className="button-main bg-blue text-white" href="/contact">Get Discovered</Link> {/* Enlace a la página de contacto */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    </Swiper>
                </div>
                {/* Flecha de navegación siguiente */}
                <div className="next-arrow flex items-center justify-center">
                    <Icon.CaretRight className="text-white heading6" weight="bold" />
                </div>
            </div>
        </>
    )
}

// Exporta el componente por defecto
export default SliderOne
