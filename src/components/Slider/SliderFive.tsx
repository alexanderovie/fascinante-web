// src/components/Slider/SliderFive.tsx (o la ruta correcta de tu componente)
'use client'

import React from "react"; // Import React
import Image from "next/image" // Import Next.js Image component for image optimization
import Link from "next/link" // Import Next.js Link component for navigation
import * as Icon from "@phosphor-icons/react/dist/ssr"; // Import icons from Phosphor-icons library
import { Swiper, SwiperSlide } from 'swiper/react'; // Import Swiper and SwiperSlide components
import { Autoplay, Navigation, Pagination } from 'swiper/modules'; // Import necessary Swiper modules
import 'swiper/css/bundle'; // Import Swiper CSS styles

// Functional component for the main Slider/Carousel
const SliderFive = () => {
    return (
        <>
            {/* Main container for the slider block */}
            <div className="slider-block style-one">
                {/* Previous navigation arrow */}
                <div className="prev-arrow flex items-center justify-center">
                    <Icon.CaretLeft className="text-white heading6" weight="bold" />
                </div>
                {/* Main Swiper container */}
                <div className="slider-main">
                    <Swiper
                        spaceBetween={0} // Space between slides
                        slidesPerView={1} // Number of slides visible at once
                        navigation={{ // Navigation arrows configuration
                            prevEl: '.prev-arrow', // Selector for the previous arrow
                            nextEl: '.next-arrow', // Selector for the next arrow
                        }}
                        loop={true} // Enable infinite loop
                        pagination={{ clickable: true }} // Enable clickable pagination dots
                        speed={400} // Transition speed
                        modules={[Pagination, Autoplay, Navigation]} // Modules to use
                        className='h-full relative' // Tailwind classes for Swiper styling
                        autoplay={{ // Autoplay configuration
                            delay: 4000, // Autoplay delay in milliseconds
                        }}
                    >
                        {/* --- Slide 1: Theme "SEO Audit" --- */}
                        {/* ASUMIENDO QUE ESTE ES EL PRIMER SLIDE VISIBLE Y ES IMPORTANTE PARA EL LCP */}
                        <SwiperSlide>
                            <div className="slider-item slider-first">
                                {/* Image hidden on mobile, shown on sm and above */}
                                <div className="bg-img hidden sm:block">
                                    <Image
                                        src={'/images/slider/client-smiling.webp'} // Image source
                                        width={4000} // Intrinsic width
                                        height={3000} // Intrinsic height
                                        alt="bgslider" // Alt text
                                        priority={true} // ¡MANTENER PARA LA PRIMERA IMAGEN SI ES LCP!
                                        className="w-full h-full object-cover" // Tailwind styles
                                    />
                                </div>
                                <div className="container">
                                    <div className="text-content flex flex-col justify-between">
                                        {/* Headline for SEO Audit */}
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
                                                <span className=" text-blue block relative overflow-hidden">Your Free Audit</span>
                                                <span className=" text-blue block absolute top-0 left-0 w-full h-full">Your Free Audit</span>
                                            </div>
                                        </div>
                                        {/* Description for SEO Audit */}
                                        <div className="body2 mt-3 text-secondary">Our comprehensive audit uncovers hidden issues and <br /> untapped strengths for top search rankings.</div>
                                        {/* CTA Button for SEO Audit - UPDATED LINK */}
                                        <div className="button-block md:mt-10 mt-6">
                                            <Link className="button-main bg-blue text-white" href="/services/website-audit">Start Your Audit</Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>

                        {/* --- Slide 2: Theme "Discover Opportunities" --- */}
                        <SwiperSlide>
                            <div className="slider-item slider-second">
                                {/* Image hidden on mobile, shown on sm and above */}
                                <div className="bg-img hidden sm:block">
                                    <Image
                                        src={'/images/slider/customer-happy.webp'} // Image source
                                        width={4000} // Intrinsic width
                                        height={3000} // Intrinsic height
                                        alt="bgslider" // Alt text
                                        // priority={true} // ¡ELIMINAR ESTA LÍNEA!
                                        loading="lazy" // O explícitamente añadir esto
                                        className="w-full h-full object-cover" // Tailwind styles
                                    />
                                </div>
                                <div className="container">
                                    <div className="text-content flex flex-col justify-between">
                                        {/* Headline for Discover Opportunities */}
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
                                        {/* Description for Discover Opportunities */}
                                        <div className="body2 mt-3 text-secondary">We pinpoint fresh strategies to expand your <br /> reach and drive more significant conversions.</div>
                                        {/* CTA Button for Discover Opportunities - UPDATED LINK */}
                                        <div className="button-block md:mt-10 mt-6">
                                            <Link className="button-main bg-blue text-white" href="https://book.fascinantedigital.com//aoviedo27/consulta-gratis">Explore Options</Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>

                        {/* --- Slide 3: Theme "Online Visibility" --- */}
                        <SwiperSlide>
                            <div className="slider-item slider-third">
                                {/* Image hidden on mobile, shown on sm and above */}
                                <div className="bg-img hidden sm:block">
                                    <Image
                                        src={'/images/slider/team-working.webp'} // Image source
                                        width={4000} // Intrinsic width
                                        height={3000} // Intrinsic height
                                        alt="bgslider" // Alt text
                                        // priority={true} // ¡ELIMINAR ESTA LÍNEA!
                                        loading="lazy" // O explícitamente añadir esto
                                        className="w-full h-full object-cover" // Tailwind styles
                                    />
                                </div>
                                <div className="container">
                                    <div className="text-content flex flex-col justify-between">
                                        {/* Headline for Online Visibility */}
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
                                        {/* Description for Online Visibility */}
                                        <div className="body2 mt-3 text-secondary">Ensure your business is seen by the right <br /> customers across all digital platforms.</div>
                                        {/* CTA Button for Online Visibility - UPDATED LINK */}
                                        <div className="button-block md:mt-10 mt-6">
                                            <Link className="button-main bg-blue text-white" href="/services/website-audit">Get Discovered</Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    </Swiper>
                </div>
                {/* Next navigation arrow */}
                <div className="next-arrow flex items-center justify-center">
                    <Icon.CaretRight className="text-white heading6" weight="bold" />
                </div>
            </div>
        </>
    )
}

// Export the component
export default SliderFive