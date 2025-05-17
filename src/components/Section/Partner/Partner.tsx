'use client'

import React from 'react'
import Image from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css/bundle'
import { partnerLogos } from '@/data/partnerLogos'

interface Props {
    classname: string
}

const Partner: React.FC<Props> = ({ classname }) => {
    return (
        <>
            <div className={`brand-block py-9 ${classname}`}>
                <div className="container">
                    <div className="list-brand">
                        <Swiper
                            spaceBetween={16}
                            slidesPerView={2}
                            loop={false}
                            breakpoints={{
                                500: {
                                    slidesPerView: 3,
                                    spaceBetween: 16,
                                },
                                680: {
                                    slidesPerView: 3,
                                    spaceBetween: 16,
                                },
                                992: {
                                    slidesPerView: 4,
                                    spaceBetween: 16,
                                },
                                1200: {
                                    slidesPerView: 5,
                                    spaceBetween: 16,
                                },
                            }}
                        >
                            {partnerLogos.map((logo, index) => (
                                <SwiperSlide key={index}>
                                    <div className="brand-item relative flex items-center justify-center h-[34px]">
                                        <Image
                                            src={logo.src}
                                            width={300}
                                            height={100}
                                            alt={logo.alt}
                                            className="h-full w-auto duration-500 relative object-cover"
                                        />
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Partner