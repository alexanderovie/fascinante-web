import MenuTwo from "@/components/Header/Menu/MenuTwo";
import TopNavTwo from "@/components/Header/TopNav/TopNavTwo";
import AboutHome from "@/components/Section/About/AboutHome";
import Counter from "@/components/Section/Counter/Counter";
// import Partner from "@/components/Section/Partner/Partner";
import Project from "@/components/Section/Project/Project";
import SliderFive from "@/components/Slider/SliderFive";
import serviceData from '@/data/service.json';
import ServiceTwo from "@/components/Section/Service/ServiceTwo";
import TestimonialTwo from "@/components/Section/Testimonial/TestimonialTwo";
import blogData from '@/data/blog.json';
import BlogOne from "@/components/Section/Blog/BlogOne";
import CtaOne from "@/components/Section/CTA/CtaOne";
import Footer from "@/components/Footer/Footer";
import FormRequestTwo from "@/components/Section/FormRequest/FormRequestTwo";

export default function Home() {
    return (
        <>
            <div className="overflow-x-hidden">
                <header id="header">
                    <TopNavTwo />
                    <MenuTwo />
                </header>
                <main className="content">
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