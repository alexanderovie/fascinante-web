'use client'

import { useState } from "react"
import Link from 'next/link'
import TopNavTwo from "@/components/Header/TopNav/TopNavTwo"
import MenuOne from "@/components/Header/Menu/MenuTwo"
import BreadcrumbItem from "@/components/Breadcrumb/BreadcrumbItem"
import ServiceFilter from "@/components/Section/Service/ServiceFilter" // This component is imported but not used in the provided code.
import serviceData from '@/data/service.json' // This data is imported but not used in the provided code.
import CtaOne from "@/components/Section/CTA/CtaOne"
import Footer from "@/components/Footer/Footer"
import * as Icon from "@phosphor-icons/react/dist/ssr";
import faqData from '@/data/faqs.json' // This data is imported and used for the FAQ section.
import Image from "next/image"

export default function ServiceStyleOne() {
    const [faq, setFaq] = useState<number | null>(1)

    const handleFaq = (id: number) => {
        setFaq(prevId => prevId === id ? null : id)
    }

    return (
        <>
            <div className="overflow-x-hidden">
                <header id="header">
                    <TopNavTwo />
                    <MenuOne />
                </header>
                <main className="content">
                    {/* Breadcrumb updated for Web Design */}
                    <BreadcrumbItem link="Our Services" img="/images/banner/websites-design.webp" title="Web Design Services" desc="Crafting visually stunning and highly functional websites that convert." />
                    <div className="content-detail-block lg:py-[100px] sm:py-16 py-10">
                        <div className="container">
                            <div className="flex max-xl:flex-col gap-y-8">
                                <div className="col-12 xl:w-3/4">
                                    <div className="content-para xl:pr-[80px]">
                                        {/* Main heading updated for Web Design */}
                                        <div className="heading3">Creating Impactful Web Experiences</div>
                                        {/* First paragraph updated for Web Design */}
                                        <div className="body2 text-secondary mt-4">Our goal for every web design project is to build a digital presence that not only looks great but also performs exceptionally. We focus on creating user-centric designs that provide intuitive navigation and engaging experiences, ensuring your visitors stay longer and convert into customers. We combine aesthetics with functionality to deliver websites that are both beautiful and effective.</div>
                                        {/* Image remains the same, assuming it's a placeholder or relevant visual */}
                                        <div className="bg-img mt-8 mb-8"><Image width={5000} height={5000} className="w-full h-full rounded-xl" src="/images/component/Website-Design.webp" alt="Web Design Placeholder Image" /></div>
                                        {/* Second heading updated for Web Design */}
                                        <div className="heading6">We offer comprehensive web design solutions.</div>
                                        {/* Second paragraph updated for Web Design */}
                                        <div className="body2 text-secondary mt-4">{`We provide a full spectrum of web design services, from initial concept and wireframing to final development and deployment. Our team works closely with you to understand your brand, target audience, and business objectives, ensuring the final product aligns perfectly with your vision. We specialize in responsive design, e-commerce solutions, content management systems, and custom web applications, all built with modern technologies and best practices.`}</div>
                                        {/* List of features updated for Web Design */}
                                        <div className="list-feature mt-8">
                                            <div className="flex max-lg:flex-col gap-y-3">
                                                <div className="w-full lg:w-1/2 gap-y-3 flex flex-col">
                                                    <div className="item flex items-center gap-4"> <Icon.CheckCircle weight="fill" className="text-xl text-blue flex-shrink-0" />
                                                        <div className="text-button">Custom Website Design</div>
                                                    </div>
                                                    <div className="item flex items-center gap-4"> <Icon.CheckCircle weight="fill" className="text-xl text-blue flex-shrink-0" />
                                                        <div className="text-button">Responsive Development</div>
                                                    </div>
                                                    <div className="item flex items-center gap-4"> <Icon.CheckCircle weight="fill" className="text-xl text-blue flex-shrink-0" />
                                                        <div className="text-button">User Experience (UX) Design</div>
                                                    </div>
                                                </div>
                                                <div className="w-full lg:w-1/2 gap-y-3 flex flex-col">
                                                    <div className="item flex items-center gap-4"> <Icon.CheckCircle weight="fill" className="text-xl text-blue flex-shrink-0" />
                                                        <div className="text-button">Search Engine Optimization (SEO) Basics</div>
                                                    </div>
                                                    <div className="item flex items-center gap-4"> <Icon.CheckCircle weight="fill" className="text-xl text-blue flex-shrink-0" />
                                                        <div className="text-button">E-commerce Solutions</div>
                                                    </div>
                                                    <div className="item flex items-center gap-4"> <Icon.CheckCircle weight="fill" className="text-xl text-blue flex-shrink-0" />
                                                        <div className="text-button">Ongoing Support & Maintenance</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {/* FAQ section remains the same, using the imported faqData */}
                                        <div className="list-question lg:mt-[60px] mt-8">
                                            <div className="heading6">Questions about service</div>
                                            {faqData.slice(0, 4).map(item => (
                                                <div
                                                    key={item.id}
                                                    className={`question-item hover-box-shadow pointer mt-5 px-7 rounded-lg border border-line cursor-pointer ${faq === item.id ? 'open' : ''}`}
                                                    onClick={() => handleFaq(item.id)}
                                                >
                                                    <div className="question-item-main flex items-center justify-between py-4 heading7">{item.title}
                                                        {faq === item.id ? (
                                                            <Icon.Minus weight="bold" className="text-xl" />
                                                        ) : (
                                                            <Icon.Plus weight="bold" className="text-xl" />
                                                        )}
                                                    </div>
                                                    <div className="content-question">
                                                        <div className="border-line w-full"></div>
                                                        <div className="body3 text-secondary pb-4">{item.desc}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                {/* Sidebar content updated for Web Design services */}
                                <div className="w-full xl:w-1/4">
                                    <div className="more-infor border border-line rounded-xl py-8 px-6">
                                        <div className="heading6">Our Web Design Services</div>
                                        <div className="body3 text-secondary mt-2">Explore our specialized web design offerings tailored to elevate your online presence.</div>
                                        <div className="list-nav mt-4">
                                            {/* Updated sidebar links and text */}
                                            <Link className="nav-item rounded-lg flex-between p-12"
                                                href={"/service/service-detail/[slug]"}
                                                as={"/service/service-detail/custom-web-design"} // Example slug
                                            >
                                                <div className="text-button text-secondary">
                                                    Custom Web Design
                                                </div>
                                                <i className="ph-bold ph-caret-right hidden"></i>
                                            </Link>
                                            <Link className="nav-item rounded-lg flex-between p-12 mt-12"
                                                href={"/service/service-detail/[slug]"}
                                                as={"/service/service-detail/responsive-development"} // Example slug
                                            >
                                                <div className="text-button text-secondary">
                                                    Responsive Development
                                                </div><i className="ph-bold ph-caret-right hidden"></i>
                                            </Link>
                                            <Link className="nav-item rounded-lg flex-between p-12 mt-12"
                                                href={"/service/service-detail/[slug]"}
                                                as={"/service/service-detail/e-commerce-solutions"} // Example slug
                                            >
                                                <div className="text-button text-secondary">
                                                    E-commerce Solutions
                                                </div><i className="ph-bold ph-caret-right hidden"></i>
                                            </Link>
                                            <Link className="nav-item rounded-lg flex-between p-12 mt-12"
                                                href={"/service/service-detail/[slug]"}
                                                as={"/service/service-detail/ux-ui-design"} // Example slug
                                            >
                                                <div className="text-button text-secondary">
                                                    UX/UI Design
                                                </div><i className="ph-bold ph-caret-right hidden"></i>
                                            </Link>
                                            <Link className="nav-item rounded-lg flex-between p-12 mt-12"
                                                href={"/service/service-detail/[slug]"}
                                                as={"/service/service-detail/website-maintenance"} // Example slug
                                            >
                                                <div className="text-button text-secondary">
                                                    Website Maintenance
                                                </div><i className="ph-bold ph-caret-right hidden"></i>
                                            </Link>
                                            <Link className="nav-item rounded-lg flex-between p-12 mt-12 active"
                                                href={"/service/service-detail/[slug]"}
                                                as={"/service/service-detail/landing-page-design"} // Example slug
                                            >
                                                <div className="text-button text-secondary">
                                                    Landing Page Design</div><i className="ph-bold ph-caret-right hidden"></i></Link></div>
                                    </div>
                                    {/* Ads block updated for Web Design context */}
                                    <div className="ads-block rounded-lg md:mt-10 mt-6 relative">
                                        <div className="bg-img"> <Image width={5000} height={5000} src="/images/component/ads.png" alt="Advertisement" /></div>
                                        <div className="text flex flex-col justify-between absolute left-0 top-0 w-full h-full p-8">
                                            <div className="title">
                                                <div className="heading5 text-white">Ready to start your project?</div>
                                                <div className="body3 text-white mt-4">Let&apos;s create something amazing<br />together!</div>
                                            </div>
                                            <div className="button-block md:mt-10 mt-6">
                                                {/* Link updated to a contact page, assuming 'contact-style-one.html' is correct */}
                                                <a className="button-main hover:bg-black hover:text-white inline-block bg-white text-button" href="contact-style-one.html">Get a Quote</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <CtaOne />
                </main>
                <footer id="footer">
                    <Footer />
                </footer>
            </div >
        </>
    )
}
