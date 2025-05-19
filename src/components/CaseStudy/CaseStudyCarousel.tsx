// components/CaseStudy/CaseStudyCarousel.tsx

'use client';

import Image from "next/image";
import Link from "next/link";
import * as Icon from "@phosphor-icons/react/dist/ssr";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css/bundle';
import { CaseStudyType } from '@/type/CaseStudyType';

interface Props {
    data: CaseStudyType[];
}

const CaseStudyCarousel: React.FC<Props> = ({ data }) => {
    // Selecciona 4 casos aleatorios
    const randomCases = data.sort(() => 0.5 - Math.random()).slice(0, 4);

    return (
        <div className="our-project-block lg:mt-[100px] sm:mt-16 mt-10">
            <div className="container">
                <div className="heading3 text-center">Our Featured Case Studies</div>
                <div className="body2 text-secondary mt-3 text-center">
                    Discover how Fascinante Digital has transformed businesses with impactful digital strategies.
                </div>
            </div>
            <div className="list-project md:mt-10 mt-7">
                <Swiper
                    spaceBetween={0}
                    slidesPerView={1}
                    loop={true}
                    pagination={{ clickable: true }}
                    speed={400}
                    modules={[Pagination, Autoplay]}
                    className='h-full relative'
                    autoplay={{
                        delay: 4000,
                        disableOnInteraction: false,
                    }}
                    breakpoints={{
                        640: {
                            slidesPerView: 2,
                            spaceBetween: 10,
                        },
                        1024: {
                            slidesPerView: 3,
                            spaceBetween: 10,
                        },
                        1280: {
                            slidesPerView: 4,
                            spaceBetween: 10,
                        }
                    }}
                >
                    {randomCases.map((caseStudy) => (
                        <SwiperSlide key={caseStudy.id}>
                            <div className="item">
                                <div className="bg-img overflow-hidden">
                                    <Image
                                        width={472}
                                        height={354}
                                        className="w-full h-full"
                                        src={caseStudy.img}
                                        alt={caseStudy.title}
                                    />
                                </div>
                                <Link className="text" href={`/case-studies/${caseStudy.id}`}>
                                    <div className="heading5 text-white">{caseStudy.title}</div>
                                    <div className="body3 text-white mt-1">{caseStudy.subTitle}</div>
                                </Link>
                                <Link
                                    className="arrow w-[52px] h-[52px] flex items-center justify-center bg-white rounded-full hover:text-white"
                                    href={`/case-studies/${caseStudy.id}`}
                                    aria-label={`Read more about ${caseStudy.title}`}
                                >
                                    <Icon.ArrowRight className="text-3xl" />
                                </Link>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
};

export default CaseStudyCarousel;