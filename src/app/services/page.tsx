'use client'

import TopNavTwo from "@/components/Header/TopNav/TopNavTwo";
import MenuOne from "@/components/Header/Menu/MenuTwo" // Assuming MenuOne is actually MenuTwo based on import name
import BreadcrumbItem from "@/components/Breadcrumb/BreadcrumbItem"
import ServiceFive from "@/components/Section/Service/ServiceFive" // This component might need internal copy adaptation
import serviceData from '@/data/service.json' // This data has been adapted in previous steps
import Partner from "@/components/Section/Partner/PartnerAbout" // This component has been adapted
import CtaOne from "@/components/Section/CTA/CtaOne" // This component might need internal copy adaptation
import Footer from "@/components/Footer/Footer" // This component might need internal copy adaptation
import Image from "next/image"

export default function ServiceStyleOne() {
    return (
        <>
            <div className="overflow-x-hidden">
                <header id="header">
                    <TopNavTwo />
                    {/* Assuming MenuOne is actually MenuTwo */}
                    <MenuOne />
                </header>
                <main className="content">
                    {/* Adapted BreadcrumbItem copy for Fascinante Digital */}
                    <BreadcrumbItem
                        link="Our Services" // Keeping link text as is, can be changed if needed
                        img="/images/banner/about1.webp" // Keeping image source as is
                        title="Our Digital Services" // Adapted title
                        desc="Explore our range of digital marketing services designed to elevate your brand and drive growth." // Adapted description
                    />
                    <div className="mt-[100px]">
                        <div className="container">
                            <div className="flex gap-8 max-lg:flex-col-reverse">
                                <div className="w-full lg:w-1/2 flex flex-col justify-between gap-5 pr-10">
                                    {/* Adapted Heading copy for Fascinante Digital */}
                                    <div className="heading3">Innovative Digital Solutions for Sustainable Growth</div>
                                    {/* Adapted Description copy for Fascinante Digital */}
                                    <div className="body2 text-secondary">We offer cutting-edge digital marketing services to safeguard your brand&apos;s online presence, ensure sustainable growth, and navigate the rapidly changing digital landscape. We understand that implementing effective digital strategies is crucial for the success of your enterprise.</div>
                                    <div className="button-block">
                                        {/* Adapted Button Text and Link for Fascinante Digital */}
                                        <a className="button-main hover:bg-black text-white bg-blue text-button inline-block py-3 px-9 rounded-full" href="/contact">Get Started</a> {/* Changed link to /contact */}
                                    </div>
                                </div>
                                <div className="w-full lg:w-1/2">
                                    <div className="bg-img w-full overflow-hidden rounded-xl">
                                        {/* Keeping image source, adapted alt text */}
                                        <Image width={5000} height={5000} className="w-full h-full block" src="/images/component/bottom-slider-three.png" alt="Digital Strategy Dashboard" /> {/* Adapted alt text */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* ServiceFive component remains, assuming its internal copy/data usage is handled elsewhere */}
                    <ServiceFive data={serviceData} title="" />
                    {/* Partner component remains, assuming it's PartnerAbout and its copy is handled elsewhere */}
                    <Partner />
                    {/* CtaOne component remains, assuming its internal copy is handled elsewhere */}
                    <CtaOne />
                    {/* Removed the duplicate Footer component from here */}
                </main>
                <footer id="footer">
                    {/* Footer component correctly placed in the footer tag */}
                    <Footer />
                </footer>
            </div >
        </>
    )
}
