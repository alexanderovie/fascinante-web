// app/page.tsx

import MenuTwo from "@/components/Header/Menu/MenuTwo";
import TopNavTwo from "@/components/Header/TopNav/TopNavTwo";
import AboutHome from "@/components/Section/About/AboutHome";
import Counter from "@/components/Section/Counter/Counter";
// import Partner from "@/components/Section/Partner/Partner";
import Project from "@/components/Section/Project/Project";
import SliderFive from "@/components/Slider/SliderFive"; // Asegúrate que la ruta sea correcta
import serviceData from '@/data/service.json';
import ServiceTwo from "@/components/Section/Service/ServiceTwo";
import TestimonialTwo from "@/components/Section/Testimonial/TestimonialTwo";
import blogData from '@/data/blog.json';
import BlogOne from "@/components/Section/Blog/BlogOne";
import CtaOne from "@/components/Section/CTA/CtaOne";
import Footer from "@/components/Footer/Footer";
import FormRequestTwo from "@/components/Section/FormRequest/FormRequestTwo";

export default function Home() {
    // Este es el texto para el H1 principal de tu página.
    // Puedes cambiarlo según tu estrategia SEO y de contenido.
    const mainPageHeadline = "Uncover Hidden SEO Insights with Your Free Audit";

    return (
        <>
            <div className="overflow-x-hidden">
                <header id="header">
                    <TopNavTwo />
                    <MenuTwo />
                </header>
                <main className="content">
                    {/* Aquí puedes colocar el H1 principal.
                        Podrías querer estilizarlo o incluso hacerlo "sr-only" (solo para lectores de pantalla)
                        si el diseño visual ya presenta este texto de forma prominente en el Slider.
                        Por ahora, lo dejamos visible para claridad. */}
                    <h1 className="sr-only">
                        {mainPageHeadline}
                    </h1>
                    {/* O si quieres que sea visible y centrado antes del slider:
                    <div className="container py-4 sm:py-6 md:py-8 text-center">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 dark:text-white">
                            {mainPageHeadline}
                        </h1>
                    </div>
                    */}

                    {/* El componente SliderFive ya no necesita generar el H1 */}
                    <SliderFive />
                    
                    {/* Partner Section (Desactivado temporalmente) */}
                    {/* <Partner classname='bg-dark-blue' /> */}
                    
                    <AboutHome />
                    <Counter classname='lg:py-10 py-7 border-t border-line' />
                    <Project />
                    <ServiceTwo data={serviceData} />
                    <TestimonialTwo />
                    <FormRequestTwo classname="style-two" bgImg="/images/banner/team-celebrating.webp" />
                    <BlogOne data={blogData} />
                    <div className="pb-[100px]"></div>
                    <CtaOne />
                </main>
                <footer id="footer">
                    <Footer />
                </footer>
            </div>
        </>
    );
}
