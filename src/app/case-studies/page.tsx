'use client'

import TopNavTwo from "@/components/Header/TopNav/TopNavTwo";
import MenuTwo from "@/components/Header/Menu/MenuTwo";
import BreadcrumbItem from "@/components/Breadcrumb/BreadcrumbItem"
import CaseStudyOne from "@/components/CaseStudy/CaseStudyOne"
import caseStudyData from '@/data/case-study.json' // Assuming this data contains your case studies
import CtaOne from "@/components/Section/CTA/CtaOne"
import Footer from "@/components/Footer/Footer"

export default function CaseStudyStyleOne() {
    return (
        <>
            <div className="overflow-x-hidden">
                <header id="header">
                    <TopNavTwo />
                    <MenuTwo />
                </header>
                <main className="content">
                    {/* Breadcrumb updated for Fascinante Digital's case studies */}
                    <BreadcrumbItem
                        link="Case Studies" // Link remains the same
                        img="/images/banner/about1.webp" // Assuming this image is suitable or a placeholder
                        title="Our Success Stories" // Updated title
                        desc="Explore how Fascinante Digital has helped businesses achieve their goals through Web Design, Digital Marketing, and Local Listing." // Updated description
                    />
                    {/* Case Study component - Assuming this component displays the case studies from caseStudyData */}
                    <CaseStudyOne data={caseStudyData} />
                    {/* Call to Action component - Assuming this is the adapted CtaOne */}
                    <CtaOne />
                </main>
                <footer id="footer">
                    <Footer />
                </footer>
            </div >
        </>
    )
}
