'use client'

import TopNavTwo from "@/components/Header/TopNav/TopNavTwo";
import MenuTwo from "@/components/Header/Menu/MenuTwo";
import BreadcrumbItem from "@/components/Breadcrumb/BreadcrumbItem"
import LayoutGrid from "@/components/Blog/LayoutGrid"
import CtaOne from "@/components/Section/CTA/CtaOne"
import Footer from "@/components/Footer/Footer"
import { Suspense } from "react"

export default function BlogListStyleTwo() {
    return (
        <>
            <div className="overflow-x-hidden">
                <header id="header">
                    <TopNavTwo />
                    <MenuTwo />
                </header>
                <main className="content">
                    {/* Breadcrumb updated for Fascinante Digital's blog content */}
                    <BreadcrumbItem
                        link="Blog"
                        img="/images/banner/about1.webp" // Assuming this image is suitable or a placeholder
                        title="Our Blog & Insights" // Updated title
                        desc="Explore articles and expert tips on Web Design, Digital Marketing, SEO, and more from Fascinante Digital." // Updated description
                    />
                    <Suspense>
                        <LayoutGrid />
                    </Suspense>
                    <CtaOne />
                </main>
                <footer id="footer">
                    <Footer />
                </footer>
            </div >
        </>
    )
}
