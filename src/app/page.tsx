// app/page.tsx

import MenuTwo from "@/components/Header/Menu/Menu";
import TopNavTwo from "@/components/Header/TopNav/TopNavTwo";
import AboutHome from "@/components/Section/About/AboutHome";
import Counter from "@/components/Section/Counter/Counter";
import Partner from "@/components/Section/Partner/Partner";
import CaseStudyCarousel from "@/components/CaseStudy/CaseStudyCarousel"
import caseStudyData from '@/data/case-study.json' // Assuming this data contains your case studies
import SliderFive from "@/components/Slider/SliderFive";

import { getSortedPostsData, PostData } from "@/lib/posts";

import BlogOne from "@/components/Blog/BlogOne";

import serviceData from '@/data/service.json';
import ServiceTwo from "@/components/Section/Service/ServiceTwo";

import TestimonialTwo from "@/components/Section/Testimonial/TestimonialTwo";
import CtaOne from "@/components/Section/CTA/CtaOne";
import Footer from "@/components/Footer/Footer";
import FormRequestTwo from "@/components/Section/FormRequest/FormRequestTwo"; // Tu componente

export default function Home() {
    const mainPageHeadline = "Uncover Hidden SEO Insights with Your Free Audit";

    const allPosts: PostData[] = getSortedPostsData();
    const recentPosts = allPosts.slice(0, 3);

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
                                        <CaseStudyCarousel data={caseStudyData} />

                    <ServiceTwo data={serviceData} />
                    <TestimonialTwo />
                    {/* La llamada a FormRequestTwo no cambia */}
                    <FormRequestTwo classname="style-two" bgImg="/images/banner/team-celebrating.webp" />
                    <BlogOne data={recentPosts} /> 
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