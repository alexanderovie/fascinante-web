import faqData from '@/data/faqs.json'; // FAQ genérico como en tu ejemplo
// No necesitamos importar serviceData aquí directamente si lo cargamos en las funciones

// src/app/services/[slug]/page.tsx
import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

import { ServiceType } from '@/type/ServiceType'; // Asegúrate que ServiceType incluya 'faqs?: FaqDefinition[]'
import TopNavTwo from "@/components/Header/TopNav/TopNavTwo";
import MenuTwo from "@/components/Header/Menu/Menu";
import BreadcrumbItem from "@/components/Breadcrumb/BreadcrumbItem";
import CtaOne from "@/components/Section/CTA/CtaOne";
import Footer from "@/components/Footer/Footer";
import * as IconPhosphor from "@phosphor-icons/react/dist/ssr";

// Importa el componente FaqAccordion que creamos
import FaqAccordion from '@/components/FAQ/FaqAccordion'; // Ajusta la ruta si es diferente

// --- Funciones para obtener datos ---
async function getAllServices(): Promise<ServiceType[]> {
    const filePath = path.join(process.cwd(), 'src', 'data', 'service.json');
    const jsonData = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(jsonData) as ServiceType[];
}

async function getServiceBySlug(slug: string): Promise<ServiceType | undefined> {
    const services = await getAllServices();
    return services.find((service) => service.id === slug);
}

// --- Generación de Parámetros Estáticos ---
export async function generateStaticParams() {
    const services = await getAllServices();
    return services.map((service) => ({
        slug: service.id,
    }));
}

// --- Generación de Metadatos Dinámicos ---
export async function generateMetadata({ params }: { params: { slug: string } }) {
    const service = await getServiceBySlug(params.slug);
    if (!service) {
        return {
            title: 'Servicio no Encontrado',
        };
    }
    return {
        title: `${service.title} | Fascinante Digital`,
        description: service.shortDesc || service.desc,
    };
}


// --- Componente de la Página de Detalle del Servicio ---
export default async function ServiceDetailPage({ params }: { params: { slug: string } }) {
    const { slug } = params;
    const currentService = await getServiceBySlug(slug);
    const allServices = await getAllServices(); // Para el sidebar "Otros Servicios"

    if (!currentService) {
        notFound(); // Muestra 404 si el servicio no existe
    }

    // Prepara los items de FAQ desde el servicio actual.
    // Si currentService.faqs no existe o está vacío, FaqAccordion manejará no renderizar nada.
    const faqItemsToDisplay = currentService.faqs || [];

    return (
        <>
            <div className="overflow-x-hidden">
                <header id="header">
                    <TopNavTwo />
                    <MenuTwo />
                </header>
                <main className="content">
                    <BreadcrumbItem
                        link="Our Services"
                        img={currentService.bannerImageUrl || "/images/banner/websites-design.webp"}
                        title={currentService.title}
                        desc={currentService.shortDesc || currentService.desc}
                    />
                    <div className="content-detail-block lg:py-[100px] sm:py-16 py-10">
                        <div className="container">
                            <div className="flex max-xl:flex-col gap-y-8">
                                <div className="col-12 xl:w-3/4">
                                    <div className="content-para xl:pr-[80px]">
                                        <div className="heading3">{currentService.detailHeading || currentService.title}</div>
                                        {currentService.detailParagraph1 && (
                                            <div className="body2 text-secondary mt-4">{currentService.detailParagraph1}</div>
                                        )}
                                        {currentService.contentImageUrl && (
                                            <div className="bg-img mt-8 mb-8">
                                                <Image width={5000} height={5000} className="w-full h-full rounded-xl" src={currentService.contentImageUrl} alt={currentService.title || "Service Image"} />
                                            </div>
                                        )}
                                        {currentService.detailSubHeading && (
                                            <div className="heading6">{currentService.detailSubHeading}</div>
                                        )}
                                        {currentService.detailParagraph2 && (
                                            <div className="body2 text-secondary mt-4">{currentService.detailParagraph2}</div>
                                        )}
                                        {currentService.features && currentService.features.length > 0 && (
                                            <div className="list-feature mt-8">
                                                <div className="flex max-lg:flex-col gap-y-3">
                                                    <div className="w-full lg:w-1/2 gap-y-3 flex flex-col">
                                                        {currentService.features.slice(0, Math.ceil(currentService.features.length / 2)).map((feature, index) => (
                                                            <div key={index} className="item flex items-center gap-4">
                                                                <IconPhosphor.CheckCircle weight="fill" className="text-xl text-blue flex-shrink-0" />
                                                                <div className="text-button">{feature}</div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="w-full lg:w-1/2 gap-y-3 flex flex-col">
                                                        {currentService.features.slice(Math.ceil(currentService.features.length / 2)).map((feature, index) => (
                                                            <div key={index + 50} className="item flex items-center gap-4">
                                                                <IconPhosphor.CheckCircle weight="fill" className="text-xl text-blue flex-shrink-0" />
                                                                <div className="text-button">{feature}</div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Sección de FAQ usando el componente FaqAccordion */}
                                        {/* Le pasamos las FAQs específicas del servicio actual */}
                                        <FaqAccordion 
                                            items={faqItemsToDisplay} 
                                            heading="Preguntas Frecuentes del Servicio" 
                                        />
                                    </div>
                                </div>

                                {/* Sidebar: Otros Servicios */}
                                <div className="w-full xl:w-1/4">
                                    <div className="more-infor border border-line rounded-xl py-8 px-6">
                                        <div className="heading6">Otros Servicios</div>
                                        <div className="body3 text-secondary mt-2">Explora nuestras otras soluciones.</div>
                                        <div className="list-nav mt-4">
                                            {allServices
                                                .filter(service => service.id !== currentService.id)
                                                .slice(0, 5) 
                                                .map(service => (
                                                    <Link
                                                        key={service.id}
                                                        className="nav-item rounded-lg flex items-center justify-between p-3 mt-3 block hover:bg-gray-100" // Ajustado padding y margen
                                                        href={`/services/${service.id}`}
                                                    >
                                                        <span className="text-button text-secondary"> {/* Usar span para mejor control */}
                                                            {service.menuTitle || service.title}
                                                        </span>
                                                        <IconPhosphor.CaretRight weight="bold" className="text-blue text-xl flex-shrink-0" /> {/* Asegurar visibilidad del icono */}
                                                    </Link>
                                                ))}
                                        </div>
                                    </div>
                                    <div className="ads-block rounded-lg md:mt-10 mt-6 relative">
                                        <div className="bg-img"> <Image width={5000} height={5000} src="/images/component/ads.png" alt="Advertisement" /></div>
                                        <div className="text flex flex-col justify-between absolute left-0 top-0 w-full h-full p-8">
                                            <div className="title">
                                                <div className="heading5 text-white">Ready to start your project?</div>
                                                <div className="body3 text-white mt-4">Let&apos;s create something amazing<br />together!</div>
                                            </div>
                                            <div className="button-block md:mt-10 mt-6">
                                                <Link className="button-main hover:bg-black hover:text-white inline-block bg-white text-button" href="/contact">Get a Quote</Link>
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
    );
}
