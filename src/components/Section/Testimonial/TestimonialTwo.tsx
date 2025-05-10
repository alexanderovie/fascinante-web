'use client'

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css/bundle';

const TestimonialTwo = () => {
    return (
        <>
            <div className="testimonial-block style-one">
                <div className="container">
                    <div className="testimonial-main bg-surface lg:pt-20 sm:pt-16 pt-10 lg:pb-12 pb-8 lg:my-20 sm:my-16 my-10 lg:rounded-[40px] rounded-2xl flex items-center justify-center">
                        <div className="content sm:w-2/3 w-[85%]">
                            {/* Adapted Heading for Fascinante Digital */}
                            <div className="heading3 text-center">What Our Clients Say</div>
                            <Swiper
                                spaceBetween={16}
                                slidesPerView={1}
                                loop={true}
                                pagination={{ clickable: true }}
                                speed={400}
                                modules={[Pagination, Autoplay, Navigation]}
                                className='h-full relative lg:mt-10 mt-7'
                                autoplay={{
                                    delay: 4000,
                                }}
                            >
                                {/* Adapted Testimonial 1 */}
                                <SwiperSlide className="lg:pb-24 pb-20">
                                    <div className="text-2xl font-medium text-center">{String.raw`"`}Working with Fascinante Digital has been a game-changer for our online presence. Their team is knowledgeable, responsive, and always goes the extra mile to deliver results.{String.raw`"`}</div>
                                    <div className="text-button text-center mt-5">Sarah Johnson // Marketing Director, Tech Solutions Inc.</div>
                                </SwiperSlide>
                                {/* Adapted Testimonial 2 */}
                                <SwiperSlide className="lg:pb-24 pb-20">
                                    <div className="text-2xl font-medium text-center">{String.raw`"`}The digital strategies developed by Fascinante Digital significantly boosted our website traffic and conversions. We saw a remarkable improvement in just a few months!{String.raw`"`}</div>
                                    <div className="text-button text-center mt-5">David Lee // CEO, E-commerce Innovators</div>
                                </SwiperSlide>
                                {/* Adapted Testimonial 3 */}
                                <SwiperSlide className="lg:pb-24 pb-20">
                                    <div className="text-2xl font-medium text-center">{String.raw`"`}Fascinante Digital&apos;s expertise in social media marketing helped us connect with our audience on a deeper level. Their creative campaigns are truly fascinating and effective.{String.raw`"`}</div>
                                    <div className="text-button text-center mt-5">Emily Carter // Brand Manager, Creative Goods Co.</div>
                                </SwiperSlide>
                                {/* You can add more SwiperSlides here with adapted copy */}
                            </Swiper>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default TestimonialTwo
