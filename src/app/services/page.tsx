// src/app/ruta-a-tu-pagina/ServiceStyleOne.tsx (o como se llame el archivo)
'use client'

import TopNavTwo from "@/components/Header/TopNav/TopNavTwo";
import MenuOne from "@/components/Header/Menu/Menu";
import BreadcrumbItem from "@/components/Breadcrumb/BreadcrumbItem";
import ServiceFive from "@/components/Section/Service/ServiceFive";
import serviceData from '@/data/service.json';
import Partner from "@/components/Section/Partner/PartnerAbout";
import CtaOne from "@/components/Section/CTA/CtaOne";
import Footer from "@/components/Footer/Footer";
import Image from "next/image";

export default function ServiceStyleOne() {
    return (
        <>
            <div className="overflow-x-hidden">
                <header id="header">
                    <TopNavTwo />
                    <MenuOne />
                </header>
                <main className="content">
                    <BreadcrumbItem
                        link="Our Services"
                        img="/images/banner/about1.webp"
                        title="Our Digital Services"
                        desc="Explore our range of digital marketing services designed to elevate your brand and drive growth."
                    />
                    <div className="mt-[100px]">
                        <div className="container">
                            <div className="flex gap-8 max-lg:flex-col-reverse">
                                <div className="w-full lg:w-1/2 flex flex-col justify-between gap-5 pr-10">
                                    <div className="heading3">Innovative Digital Solutions for Sustainable Growth</div>
                                    <div className="body2 text-secondary">We offer cutting-edge digital marketing services to safeguard your brand&apos;s online presence, ensure sustainable growth, and navigate the rapidly changing digital landscape. We understand that implementing effective digital strategies is crucial for the success of your enterprise.</div>
                                    <div className="button-block">
                                        <a className="button-main hover:bg-black text-white bg-blue text-button inline-block py-3 px-9 rounded-full" href="/contact">Get Started</a>
                                        
                                        {/* ----- INICIO DEL EJEMPLO HIPOTÉTICO DE INPUT ----- */}
                                        <div className="mt-8"> {/* Contenedor para el input de ejemplo */}
                                            <label htmlFor="service-email-subscribe" className="block text-sm font-medium text-secondary dark:text-gray-300 mb-2">
                                                Suscríbete para más información:
                                            </label>
                                            <input
                                                type="email"
                                                id="service-email-subscribe"
                                                placeholder="tuemail@ejemplo.com"
                                                className="w-full max-w-md caption11 bg-surface dark:bg-gray-700 text-secondary dark:text-gray-300 px-4 py-3 rounded-lg border border-line dark:border-gray-600 focus:ring-2 focus:ring-blue focus:border-transparent"
                                                // ↑↑↑ NOTA: 'caption11' está aquí, y no hay 'text-base' u otra clase de tamaño de fuente de Tailwind
                                            />
                                        </div>
                                        {/* ----- FIN DEL EJEMPLO HIPOTÉTICO DE INPUT ----- */}

                                    </div>
                                </div>
                                <div className="w-full lg:w-1/2">
                                    <div className="bg-img w-full overflow-hidden rounded-xl">
                                        <Image width={5000} height={5000} className="w-full h-full block" src="/images/component/bottom-slider-three.png" alt="Digital Strategy Dashboard" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <ServiceFive data={serviceData} title="" />
                    <Partner />
                    <CtaOne />
                </main>
                <footer id="footer">
                    <Footer />
                </footer>
            </div >
        </>
    )
}