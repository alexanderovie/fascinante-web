// components/CaseStudy/CaseStudyCarousel.tsx

'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import Image from 'next/image';
import { CaseStudyType } from '@/type/CaseStudyType';
import * as Icon from "@phosphor-icons/react/dist/ssr";
import { Swiper as SwiperType } from 'swiper';

// Función para seleccionar 4 casos aleatorios
const getRandomCases = (data: Array<CaseStudyType>, count: number) => {
    const shuffled = data.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
};

interface Props {
    data: Array<CaseStudyType>;
}

const CaseStudyCarousel: React.FC<Props> = ({ data }) => {
    // Selecciona 4 casos aleatorios
    const randomCases = getRandomCases(data, 4);
    const swiperRef = useRef<SwiperType | null>(null);

    return (
        <div className="case-study-carousel lg:py-[100px] sm:py-16 py-10">
            <div className="container relative">
                <div className="heading3 text-center mb-10">Our Featured Case Studies</div>

                {/* Flecha izquierda */}
                <div className="prev-arrow flex items-center justify-center cursor-pointer absolute left-0 top-1/2 -translate-y-1/2 z-10">
                    <Icon.CaretLeft className="text-black heading6" weight="bold" />
                </div>

                <Swiper
                    onSwiper={(swiper) => (swiperRef.current = swiper)}
                    spaceBetween={30}
                    slidesPerView={3}
                    loop={true}
                    centeredSlides={true}
                    pagination={{ clickable: true }}
                    navigation={{
                        prevEl: '.prev-arrow',
                        nextEl: '.next-arrow',
                    }}
                    autoplay={{
                        delay: 5000,
                        disableOnInteraction: false,
                    }}
                    modules={[Autoplay, Pagination, Navigation]}
                    className="h-full relative"
                >
                    {randomCases.map((item) => (
                        <SwiperSlide key={item.id} className="transition-transform duration-500 transform hover:scale-105">
                            <div className="relative bg-white shadow-lg rounded-lg overflow-hidden">
                                <Image
                                    src={item.img}
                                    alt={item.title}
                                    width={400}
                                    height={300}
                                    className="w-full h-48 object-cover"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                    <div className="text-center text-white px-4">
                                        <div className="text-xs mb-2">{item.subTitle.toUpperCase()}</div>
                                        <h3 className="text-lg font-bold">{item.title}</h3>
                                        <p className="text-sm mt-2">{item.shortDesc}</p>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* Flecha derecha */}
                <div className="next-arrow flex items-center justify-center cursor-pointer absolute right-0 top-1/2 -translate-y-1/2 z-10">
                    <Icon.CaretRight className="text-black heading6" weight="bold" />
                </div>
            </div>
        </div>
    );
};

export default CaseStudyCarousel;