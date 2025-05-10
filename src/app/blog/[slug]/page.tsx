'use client'

import TopNavTwo from "@/components/Header/TopNav/TopNavTwo";
import MenuTwo from "@/components/Header/Menu/MenuTwo"
import BreadcrumbItem from "@/components/Breadcrumb/BreadcrumbItem"
import LayoutDetailOne from "@/components/Blog/LayoutDetail"
import blogData from '@/data/blog.json'
import { BlogType } from '@/type/BlogType';
import CtaOne from "@/components/Section/CTA/CtaOne"
import Footer from "@/components/Footer/Footer"
import { useRouter } from "next/navigation"

export default function CaseStudyDetail({ params: { slug } }: { params: { slug: string } }) {
    const router = useRouter();

    let foundPost = blogData.find(item => {
        return item.title.toLowerCase().replace(/ /g, '-') === slug
    })

    if (foundPost === undefined) {
        foundPost = blogData[0]
    }

    const handleNextBlogDetail = () => {
        if (foundPost) {
            let nextId: number;
            const index = blogData.findIndex(post => post.id === foundPost?.id);
            if (index === blogData.length - 1) {
                nextId = blogData[0].id;
            } else {
                nextId = blogData[index + 1].id;
            }
            const nextBlog = blogData.find(item => item.id === nextId);
            if (nextBlog) {
                router.push(`/${nextBlog.title.toLowerCase().replace(/ /g, '-')}`);
            }
        }
    };

    const handlePrevBlogDetail = () => {
        if (foundPost) {
            let nextId: number;
            const index = blogData.findIndex(post => post.id === foundPost?.id);
            console.log(index);

            if (index === blogData[0].id - 1) {
                nextId = blogData.length;
            } else {
                nextId = blogData[index - 1].id;
            }
            const nextBlog = blogData.find(item => item.id === nextId);
            if (nextBlog) {
                router.push(`/${nextBlog.title.toLowerCase().replace(/ /g, '-')}`);
            }
        }
    };

    if (!foundPost) {
        return <h3>Post not found.</h3>;
    }

    return (
        <>
            <div className="overflow-x-hidden">
                <header id="header">
                    <TopNavTwo />
                    <MenuTwo />
                </header>
                <main className="content">
                    <BreadcrumbItem link="Case Studies" img="/images/blog/blog.webp" title={"Blog Detail"} desc={"Discover valuable insights and expert advice on budgeting, investing, and retirement planning in our Financial Blogs section."} />
                    <LayoutDetailOne data={foundPost as BlogType} handleNextBlogDetail={handleNextBlogDetail} handlePrevBlogDetail={handlePrevBlogDetail} />
                    <CtaOne />
                </main>
                <footer id="footer">
                    <Footer />
                </footer>
            </div >
        </>
    )
}