// app/page.tsx

import MenuTwo from "@/components/Header/Menu/Menu";
import TopNavTwo from "@/components/Header/TopNav/TopNavTwo";
import AboutHome from "@/components/Section/About/AboutHome";
import Counter from "@/components/Section/Counter/Counter";
import Partner from "@/components/Section/Partner/Partner";
import Project from "@/components/Section/Project/Project";
import SliderFive from "@/components/Slider/SliderFive";

// --- INICIO DE CAMBIOS PARA EL BLOG ---
import { getSortedPostsData, PostData } from "@/lib/posts"; // 1. Importar desde tu nueva librería de posts
// import blogData from '@/data/blog.json'; // 2. ELIMINAR esta línea
// --- FIN DE CAMBIOS PARA EL BLOG ---

import BlogOne from "@/components/Blog/BlogOne"; // Este componente ahora recibirá datos de Markdown

// --- ATENCIÓN: PRÓXIMO POSIBLE ERROR ---
// La siguiente línea también causará un error si 'src/data/service.json' fue eliminado.
// Deberás restaurar 'service.json', eliminar la sección de servicios, o proveer 'serviceData' de otra forma.
import serviceData from '@/data/service.json';
import ServiceTwo from "@/components/Section/Service/ServiceTwo";
// --- FIN ATENCIÓN ---

import TestimonialTwo from "@/components/Section/Testimonial/TestimonialTwo";
import CtaOne from "@/components/Section/CTA/CtaOne";
import Footer from "@/components/Footer/Footer";
import FormRequestTwo from "@/components/Section/FormRequest/FormRequestTwo";

export default function Home() {
    const mainPageHeadline = "Uncover Hidden SEO Insights with Your Free Audit";

    // --- INICIO DE CAMBIOS PARA EL BLOG ---
    // 3. Obtener los datos de los posts. Puedes mostrar todos o solo algunos recientes.
    const allPosts: PostData[] = getSortedPostsData();
    const recentPosts = allPosts.slice(0, 3); // Por ejemplo, mostrar los 3 más recientes
    // --- FIN DE CAMBIOS PARA EL BLOG ---

    return (
        <>
            <div className="overflow-x-hidden">
                <header id="header">
                    <TopNavTwo />
                    <MenuTwo />
                </header>
                <main className="content">
                    <h1 className="sr-only">
                        {mainPageHeadline}
                    </h1>
                    <SliderFive />
                    <Partner classname='bg-dark-blue' />
                    <AboutHome />
                    <Counter classname='lg:py-10 py-7 border-t border-line' />
                    <Project />

                    {/* ATENCIÓN: Si service.json fue eliminado, esta línea causará un error.
                      Opciones:
                      1. Restaura 'src/data/service.json' si aún lo necesitas.
                      2. Comenta o elimina esta sección temporalmente:
                         // <ServiceTwo data={serviceData} />
                      3. Provee los datos para 'ServiceTwo' de otra manera (ej. hardcodeados o desde otra fuente).
                    */}
                    <ServiceTwo data={serviceData} />

                    <TestimonialTwo />
                    <FormRequestTwo classname="style-two" bgImg="/images/banner/team-celebrating.webp" />

                    {/* --- INICIO DE CAMBIOS PARA EL BLOG --- */}
                    {/* 4. Pasar los nuevos datos (recentPosts) al componente BlogOne */}
                    {/* Es posible que necesites ajustar BlogOne si su estructura interna */}
                    {/* dependía mucho del formato específico de blog.json */}
                    <BlogOne data={recentPosts} /> 
                    {/* --- FIN DE CAMBIOS PARA EL BLOG --- */}
                    
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