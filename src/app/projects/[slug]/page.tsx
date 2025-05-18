'use client'

import Link from 'next/link';
import Image from 'next/image'; // Asegúrate que Image esté importado
import TopNavTwo from "@/components/Header/TopNav/TopNavTwo";
import MenuOne from "@/components/Header/Menu/Menu";
import BreadcrumbItem from "@/components/Breadcrumb/BreadcrumbItem";
import projectsData from '@/data/projects.json';
import CtaOne from "@/components/Section/CTA/CtaOne";
import Footer from "@/components/Footer/Footer";
import TestimonialTwo from '@/components/Section/Testimonial/TestimonialTwo';

import type { ProjectType } from '@/type/ProjectType';

// Define la ruta a tu imagen de breadcrumb estándar
const STANDARD_BREADCRUMB_IMAGE = "/images/banner/about1.webp"; // O .png si es el formato correcto

export default function ProjectDetailPage({ params: { slug } }: { params: { slug: string } }) {

  // --- Tus console logs para depuración pueden quedarse como están ---
  console.log("-----------------------------------------------------");
  console.log("Página ProjectDetail - INICIO DE BÚSQUEDA DE PROYECTO");
  console.log("Página ProjectDetail - Slug recibido de la URL:", `'${slug}'`);
  
  if (!projectsData || projectsData.length === 0) {
    console.error("Página ProjectDetail - ERROR: projectsData está vacío o no se cargó.");
  } else {
    console.log(`Página ProjectDetail - Total de proyectos en projectsData: ${projectsData.length}`);
  }

  const foundProject: ProjectType | undefined = projectsData.find((item, index) => {
    // ... (tu lógica de búsqueda con console.logs detallados)
    if (!item || typeof item.link !== 'string' || !item.link.trim()) {
      return false;
    }
    const parts = item.link.split('/');
    const slugFromLink = parts.length > 0 ? parts[parts.length - 1] : ""; 
    const isMatch = slugFromLink === slug;
    // Para la depuración completa, puedes añadir los logs aquí dentro si es necesario
    // console.log(`Iteración ${index}: Link: '${item.link}', SlugFromLink: '${slugFromLink}', Match: ${isMatch}`);
    return isMatch;
  });

  console.log("\nPágina ProjectDetail - Resultado final de Proyecto encontrado (después del find):", foundProject ? foundProject.title : "undefined");
  console.log("Página ProjectDetail - FIN DE BÚSQUEDA DE PROYECTO");
  console.log("-----------------------------------------------------");

  if (!foundProject) {
    return (
        <div className="overflow-x-hidden">
            <header id="header">
                <TopNavTwo />
                <MenuOne />
            </header>
            <main className="content">
                 <BreadcrumbItem
                    link="/projects"
                    img={STANDARD_BREADCRUMB_IMAGE} // <--- USA LA IMAGEN ESTÁNDAR
                    title="Project Not Found"
                    desc={`We couldn't find a project matching "${slug.replace(/-/g, ' ')}".`}
                />
                <div className="container py-10 text-center">
                    <div className="heading3">Project Not Found</div>
                    <div className="body1 text-secondary mt-4">
                        The project you are looking for does not exist or may have been moved.
                    </div>
                     <Link href="/projects" className="button-main bg-blue text-white mt-8">
                        View All Projects
                    </Link>
                </div>
                <CtaOne />
                <Footer />
            </main>
        </div>
    );
  }

  // Si se encuentra el proyecto, renderiza sus detalles
  return (
    <>
      <div className="overflow-x-hidden">
        <header id="header">
          <TopNavTwo />
          <MenuOne />
        </header>
        <main className="content">
          {/* Breadcrumb siempre usa la imagen estándar */}
          <BreadcrumbItem
            link="/projects"
            img={STANDARD_BREADCRUMB_IMAGE} // <--- USA LA IMAGEN ESTÁNDAR
            title={foundProject.title}
            desc={foundProject.subtitle || "Check out the details of this project."}
          />

          {/* Sección principal de información del proyecto */}
          <div className="project-detail-content lg:py-[100px] sm:py-16 py-10">
            <div className="container">
              <div className="heading2 text-center mb-4 md:mb-6">
                {foundProject.title}
              </div>
              <p className="body1 text-secondary text-center max-w-3xl mx-auto mb-10 md:mb-16">
                {foundProject.subtitle}
              </p>

              {/* Imagen principal del proyecto (esta SÍ es específica del proyecto) */}
              {foundProject.imageSrc && (
                <div className="main-project-image mb-10 md:mb-16">
                  <Image
                    src={foundProject.imageSrc}
                    alt={foundProject.imageAlt || foundProject.title}
                    width={1200}
                    height={700}
                    className="w-full h-auto object-cover rounded-xl shadow-lg"
                    priority
                  />
                </div>
              )}
              
              <div className="text-center mt-12 md:mt-16">
                <Link href="/contact" className="button-main bg-blue text-white text-lg py-3 px-8 rounded-lg">
                    Discuss Your Project
                </Link>
              </div>
            </div>
          </div>
          <TestimonialTwo />
          <CtaOne />
        </main>
        <footer id="footer">
          <Footer />
        </footer>
      </div >
    </>
  );
}