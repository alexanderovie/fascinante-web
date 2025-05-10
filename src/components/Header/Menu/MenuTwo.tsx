'use client'

import React, { useEffect, useState } from "react"
import { usePathname } from "next/navigation";
import Image from "next/image"
import Link from "next/link"
import * as Icon from "@phosphor-icons/react/dist/ssr";

const MenuTwo = () => {
    const pathname = usePathname()
    const [fixedHeader, setFixedHeader] = useState(false)
    const [openMenuMobile, setOpenMenuMobile] = useState(false)
    const [openSubNavMobile, setOpenSubNavMobile] = useState<number | null>(null)

    const handleOpenSubNavMobile = (index: number) => {
        setOpenSubNavMobile(openSubNavMobile === index ? null : index)
    }

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            setFixedHeader(scrollPosition > 400);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <>
            <div className={`header-menu style-one bg-white ${fixedHeader ? 'fixed' : ''}`}>
                <div className="container flex items-center justify-between h-20">
                    <Link className="menu-left-block" href="/">
                        <Image
                            src={'/images/Logo.svg'}
                            width={900}
                            height={800}
                            alt="logo"
                            priority={true}
                            className="w-[149px] max-sm:w-[132px]"
                        />
                    </Link>
                    <div className="menu-center-block h-full">
                        <ul className="menu-nav flex items-center xl:gap-2 h-full">
                            <li className={`nav-item h-full flex items-center justify-center home ${pathname === '/' ? 'active' : ''}`}>
                                <Link className="nav-link text-title flex items-center gap-1" href="/">
                                    <span>Home</span>
                                </Link>
                            </li>
                            <li className={`nav-item h-full flex items-center justify-center ${pathname.includes('/about/') ? 'active' : ''}`}>
                                <Link className="nav-link text-title flex items-center gap-1" href="/about/about-one">
                                    <span>About</span>
                                </Link>
                            </li>
                            <li className={`nav-item h-full flex items-center justify-center ${pathname.includes('/service') ? 'active' : ''}`}>
                                <Link className="nav-link text-title flex items-center gap-1" href="#">
                                    <span>Services</span>
                                    <span><Icon.CaretDown className="text-sm" /></span>
                                </Link>
                                <ul className="sub-nav">
                                    <li className="sub-nav-item"><Link className="sub-nav-link font-medium" href="/service/seo-audits">SEO Audits</Link></li>
                                    <li className="sub-nav-item"><Link className="sub-nav-link font-medium" href="/service/local-seo">Local SEO</Link></li>
                                    <li className="sub-nav-item"><Link className="sub-nav-link font-medium" href="/service/website-optimization">Website Optimization</Link></li>
                                    <li className="sub-nav-item"><Link className="sub-nav-link font-medium" href="/service/business-listings">Business Listings</Link></li>
                                    <li className="sub-nav-item"><Link className="sub-nav-link font-medium" href="/service/reputation-management">Reputation Management</Link></li>
                                    <li className="sub-nav-item"><Link className="sub-nav-link font-medium" href="/service/social-media-marketing">Social Media Marketing</Link></li>
                                </ul>
                            </li>
                            <li className={`nav-item h-full flex items-center justify-center ${pathname.includes('/case-studies/') ? 'active' : ''}`}>
                                <Link className="nav-link text-title flex items-center gap-1" href="#">
                                    <span>Case Studies</span>
                                    <span><Icon.CaretDown className="text-sm" /></span>
                                </Link>
                                <ul className="sub-nav">
                                    <li className="sub-nav-item"><Link className="sub-nav-link font-medium" href="/case-studies/real-estate">Real Estate</Link></li>
                                    <li className="sub-nav-item"><Link className="sub-nav-link font-medium" href="/case-studies/insurance">Insurance</Link></li>
                                    <li className="sub-nav-item"><Link className="sub-nav-link font-medium" href="/case-studies/coaching">Coaching</Link></li>
                                    <li className="sub-nav-item"><Link className="sub-nav-link font-medium" href="/case-studies/cleaning-services">Cleaning Businesses</Link></li>
                                </ul>
                            </li>
                            <li className={`nav-item h-full flex items-center justify-center ${pathname.includes('/pricing') ? 'active' : ''}`}>
                                <Link className="nav-link text-title flex items-center gap-1" href="/pricing">
                                    <span>Pricing</span>
                                </Link>
                            </li>
                            <li className={`nav-item h-full flex items-center justify-center ${pathname.includes('/contact/') ? 'active' : ''}`}>
                                <Link className="nav-link text-title flex items-center gap-1" href="/contact/contact-one">
                                    <span>Contact</span>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    )
}

export default MenuTwo