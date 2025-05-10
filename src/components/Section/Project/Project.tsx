'use client'

import Image from "next/image"
import Link from "next/link"
import * as Icon from "@phosphor-icons/react/dist/ssr";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css/bundle';

const Project = () => {
    return (
        <div className="our-project-block lg:mt-[100px] sm:mt-16 mt-10">
            <div className="container">
                <div className="heading3 text-center">Our Featured Projects</div> {/* Adaptado el título principal */}
                <div className="body2 text-secondary mt-3 text-center">Explore how Fascinante Digital has transformed businesses with innovative digital strategies.</div> {/* Adaptada la descripción */}
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
                    <SwiperSlide>
                        <div className="item">
                            <div className="bg-img overflow-hidden">
                                <Image
                                    width={5000}
                                    height={5000}
                                    className="w-full h-full"
                                    src="/images/component/472x354.png"
                                    alt="SEO Strategy & Organic Growth Case Study" // Alt text adaptado
                                />
                            </div>
                            <Link className="text" href="/case-studies/case-studies-one">
                                <div className="heading5 text-white">SEO Strategy & Organic Growth</div> {/* Título adaptado */}
                                <div className="body3 text-white mt-1">Boosting Online Visibility</div> {/* Subtítulo adaptado */}
                            </Link>
                            <Link className="arrow w-[52px] h-[52px] flex items-center justify-center bg-white rounded-full hover:text-white" href="/case-studies/case-studies-one">
                                <Icon.ArrowRight className="text-3xl" />
                            </Link>
                        </div>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div className="item">
                            <div className="bg-img overflow-hidden">
                                <Image
                                    width={5000}
                                    height={5000}
                                    className="w-full h-full"
                                    src="/images/component/472x354.png"
                                    alt="Social Media Engagement Campaign Case Study" // Alt text adaptado
                                />
                            </div>
                            <Link className="text" href="/case-studies/case-studies-one">
                                <div className="heading5 text-white">Social Media Engagement Campaign</div> {/* Título adaptado */}
                                <div className="body3 text-white mt-1">Building Community & Brand Loyalty</div> {/* Subtítulo adaptado */}
                            </Link>
                            <Link className="arrow w-[52px] h-[52px] flex items-center justify-center bg-white rounded-full hover:text-white" href="/case-studies/case-studies-one">
                                <Icon.ArrowRight className="text-3xl" />
                            </Link>
                        </div>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div className="item">
                            <div className="bg-img overflow-hidden">
                                <Image
                                    width={5000}
                                    height={5000}
                                    className="w-full h-full"
                                    src="/images/component/472x354.png"
                                    alt="E-commerce Conversion Optimization Case Study" // Alt text adaptado
                                />
                            </div>
                            <Link className="text" href="/case-studies/case-studies-one">
                                <div className="heading5 text-white">E-commerce Conversion Optimization</div> {/* Título adaptado */}
                                <div className="body3 text-white mt-1">Maximizing Sales & ROI</div> {/* Subtítulo adaptado */}
                            </Link>
                            <Link className="arrow w-[52px] h-[52px] flex items-center justify-center bg-white rounded-full hover:text-white" href="/case-studies/case-studies-one">
                                <Icon.ArrowRight className="text-3xl" />
                            </Link>
                        </div>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div className="item">
                            <div className="bg-img overflow-hidden">
                                <Image
                                    width={5000}
                                    height={5000}
                                    className="w-full h-full"
                                    src="/images/component/472x354.png"
                                    alt="Targeted PPC Advertising Case Study" // Alt text adaptado
                                />
                            </div>
                            <Link className="text" href="/case-studies/case-studies-one">
                                <div className="heading5 text-white">Targeted PPC Advertising</div> {/* Título adaptado */}
                                <div className="body3 text-white mt-1">Driving Qualified Leads</div> {/* Subtítulo adaptado */}
                            </Link>
                            <Link className="arrow w-[52px] h-[52px] flex items-center justify-center bg-white rounded-full hover:text-white" href="/case-studies/case-studies-one">
                                <Icon.ArrowRight className="text-3xl" />
                            </Link>
                        </div>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div className="item">
                            <div className="bg-img overflow-hidden">
                                <Image
                                    width={5000}
                                    height={5000}
                                    className="w-full h-full"
                                    src="/images/component/472x354.png"
                                    alt="Responsive Web Design & Development Case Study" // Alt text adaptado
                                />
                            </div>
                            <Link className="text" href="/case-studies/case-studies-one">
                                <div className="heading5 text-white">Responsive Web Design & Development</div> {/* Título adaptado */}
                                <div className="body3 text-white mt-1">Crafting Engaging User Experiences</div> {/* Subtítulo adaptado */}
                            </Link>
                            <Link className="arrow w-[52px] h-[52px] flex items-center justify-center bg-white rounded-full hover:text-white" href="/case-studies/case-studies-one">
                                <Icon.ArrowRight className="text-3xl" />
                            </Link>
                        </div>
                    </SwiperSlide>
                </Swiper>
            </div>
        </div>
    )
}
export default Project