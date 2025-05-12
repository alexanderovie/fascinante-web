'use client'

import React, { useEffect, useState } from "react"
import { usePathname } from "next/navigation";
import Image from "next/image"
import Link from "next/link"
import * as Icon from "@phosphor-icons/react/dist/ssr";
import CtaTwo from "@/components/Section/CTA/CtaTwo";

// 1. Importa los datos de los servicios desde tu archivo JSON
//    Usamos 'servicesDataFromFile' para la importación cruda para evitar conflictos de nombres.
import servicesDataFromFile from '@/data/service.json'; 

// Importa tu tipo ServiceType para tipar los datos importados
import { ServiceType } from '@/type/ServiceType'; // Asegúrate que ServiceType tenga menuTitle: string;

const MenuTwo = () => {
    const pathname = usePathname()
    const [fixedHeader, setFixedHeader] = useState(false)
    const [openMenuMobile, setOpenMenuMobile] = useState(false)
    const [openSubNavMobile, setOpenSubNavMobile] = useState<number | null>(null)

    // 2. Castea los datos importados a tu ServiceType[] para asegurar el tipado.
    //    Ahora esta variable 'servicesData' contiene tus servicios con el tipo correcto.
    const servicesData: ServiceType[] = servicesDataFromFile as ServiceType[];

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
                    {/* Logotipo - se mantiene como en tu versión "buena" */}
                    <Link className="menu-left-block" href="/">
                        <Image
                            src={'/images/logo.svg'}
                            width={1800}
                            height={1600}
                            alt="logo"
                            priority={true}
                            className="w-[149px] max-sm:w-[132px]"
                        />
                    </Link>
                    <div className="menu-center-block h-full">
                        <ul className="menu-nav flex items-center xl:gap-2 h-full">
                            {/* Home - se mantiene como en tu versión "buena" */}
                            <li className={`nav-item h-full flex items-center justify-center home ${pathname === '/' ? 'active' : ''}`}>
                                <Link className="nav-link text-title flex items-center gap-1" href="/">
                                    <span>Home</span>
                                </Link>
                            </li>
                            {/* About - se mantiene como en tu versión "buena" */}
                            <li className={`nav-item h-full flex items-center justify-center ${pathname === '/about' ? 'active' : ''}`}>
                                <Link className="nav-link text-title flex items-center gap-1" href="/about">
                                    <span>About</span>
                                </Link>
                            </li>

                            {/* Elemento de navegación 'Services' con submenú DINÁMICO */}
                            <li className={`nav-item h-full flex items-center justify-center ${pathname.includes('/services') ? 'active' : ''}`}>
                                <Link className="nav-link text-title flex items-center gap-1" href="/services">
                                    <span>Services</span>
                                    <span><Icon.CaretDown className="text-sm" /></span>
                                </Link>
                                <ul className="sub-nav">
                                    {/* Renderiza dinámicamente los elementos del submenú de servicios */}
                                    {servicesData.map((service) => ( // Usamos la variable servicesData
                                        <li
                                            key={service.id} 
                                            className={`sub-nav-item ${pathname === `/services/${service.id}` ? 'active' : ''}`}
                                        >
                                            <Link
                                                className="sub-nav-link font-medium"
                                                href={`/services/${service.id}`}
                                            >
                                                {service.menuTitle} {/* MODIFICADO: Usa menuTitle aquí */}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </li>

                            {/* Case Studies - se mantiene como en tu versión "buena" (hardcodeado) */}
                            <li className={`nav-item h-full flex items-center justify-center ${pathname.includes('/case-studies/') ? 'active' : ''}`}>
                                <Link className="nav-link text-title flex items-center gap-1" href="/case-studies">
                                    <span>Case Studies</span>
                                    <span><Icon.CaretDown className="text-sm" /></span>
                                </Link>
                                <ul className="sub-nav">
                                    <li className={`sub-nav-item ${pathname === '/case-studies/real-estate' ? 'active' : ''}`}>
                                        <Link className="sub-nav-link font-medium" href="/case-studies/real-estate">Real Estate</Link>
                                    </li>
                                    {/* ... puedes añadir más case studies o dinamizarlos después ... */}
                                </ul>
                            </li>
                            {/* Pricing - se mantiene como en tu versión "buena" */}
                            <li className={`nav-item h-full flex items-center justify-center ${pathname === '/pricing' ? 'active' : ''}`}>
                                <Link className="nav-link text-title flex items-center gap-1" href="/pricing">
                                    <span>Pricing</span>
                                </Link>
                            </li>
                            {/* Blog - se mantiene como en tu versión "buena" */}
                            <li className={`nav-item h-full flex items-center justify-center ${pathname === '/blog' ? 'active' : ''}`}>
                                <Link className="nav-link text-title flex items-center gap-1" href="/blog">
                                    <span>Blog</span>
                                </Link>
                            </li>
                            {/* Contact - se mantiene como en tu versión "buena" */}
                            <li className={`nav-item h-full flex items-center justify-center ${pathname === '/contact' ? 'active' : ''}`}>
                                <Link className="nav-link text-title flex items-center gap-1" href="/contact">
                                    <span>Contact</span>
                                </Link>
                            </li>
                        </ul>
                    </div>
                    {/* CtaTwo en escritorio - se mantiene como en tu versión "buena" */}
                    <div className="menu-right-block max-sm:hidden">
                        <CtaTwo />
                    </div>
                    {/* Icono de hamburguesa - se mantiene como en tu versión "buena" */}
                    <div className="menu-humburger lg:hidden pointer" onClick={() => setOpenMenuMobile(!openMenuMobile)}>
                        <Icon.List className="text-2xl" weight="bold" />
                    </div>
                </div>

                {/* Bloque del menú móvil */}
                <div id="menu-mobile-block" className={`${openMenuMobile && 'open'}`}>
                    <div className="menu-mobile-main">
                        <div className="container">
                            <ul className="menu-nav-mobile h-full pt-1 pb-1">
                                {/* Home (móvil) - se mantiene como en tu versión "buena" */}
                                <li className={`nav-item-mobile h-full flex-column gap-2 pt-2 pb-2 pl-3 pr-3 pointer ${pathname === '/' ? 'active' : ''}`}>
                                    <Link className="nav-link-mobile flex items-center justify-between" href="/" onClick={() => setOpenMenuMobile(false)}>
                                        <span className="body2 font-semibold">Home</span>
                                    </Link>
                                </li>
                                {/* About (móvil) - se mantiene como en tu versión "buena" */}
                                <li className={`nav-item-mobile h-full flex-column gap-2 pt-4 pb-2 pl-3 pr-3 pointer ${pathname === '/about' ? 'active' : ''}`}>
                                    <Link className="nav-link-mobile flex items-center justify-between" href="/about" onClick={() => setOpenMenuMobile(false)}>
                                        <span className="body2 font-semibold">About</span>
                                    </Link>
                                </li>

                                {/* Elemento de navegación 'Services' con submenú DINÁMICO en móvil */}
                                <li
                                    className={`nav-item-mobile h-full flex-column gap-2 pt-4 pb-2 pl-3 pr-3 pointer ${openSubNavMobile === 1 || pathname.includes('/services') ? 'active' : ''}`}
                                    onClick={() => handleOpenSubNavMobile(1)}
                                >
                                    <a className="nav-link-mobile flex items-center justify-between" href="#!">
                                        <span className="body2 font-semibold">Services</span>
                                        <Icon.CaretRight className="text-base" />
                                    </a>
                                    <ul className={`sub-nav-mobile ${openSubNavMobile === 1 ? 'open' : ''}`}>
                                        {servicesData.map((service) => ( // Usamos la variable servicesData
                                            <li
                                                key={service.id}
                                                className={`sub-nav-item pl-3 pr-3 pt-2 pb-2 ${pathname === `/services/${service.id}` ? 'active' : ''}`}
                                            >
                                                <Link
                                                    className="sub-nav-link text-base"
                                                    href={`/services/${service.id}`}
                                                    onClick={() => setOpenMenuMobile(false)} 
                                                >
                                                    {service.menuTitle} {/* MODIFICADO: Usa menuTitle aquí */}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </li>

                                {/* Case Studies (móvil) - se mantiene como en tu versión "buena" (hardcodeado) */}
                                <li className={`nav-item-mobile h-full flex-column gap-2 pt-4 pb-2 pl-3 pr-3 pointer ${openSubNavMobile === 2 || pathname.includes('/case-studies/') ? 'active' : ''}`}
                                    onClick={() => handleOpenSubNavMobile(2)}
                                >
                                    <a className="nav-link-mobile flex items-center justify-between" href="#!">
                                        <span className="body2 font-semibold">Case Studies</span>
                                        <Icon.CaretRight className="text-base" />
                                    </a>
                                    <ul className={`sub-nav-mobile ${openSubNavMobile === 2 ? 'open' : ''}`}>
                                        <li className={`sub-nav-item pl-3 pr-3 pt-2 pb-2 ${pathname === '/case-studies/real-estate' ? 'active' : ''}`}>
                                            <Link className="sub-nav-link text-base" href="/case-studies/real-estate" onClick={() => setOpenMenuMobile(false)}>Real Estate</Link>
                                        </li>
                                        {/* ... puedes añadir más case studies o dinamizarlos después ... */}
                                    </ul>
                                </li>
                                {/* Pricing (móvil) - se mantiene como en tu versión "buena" */}
                                <li className={`nav-item-mobile h-full flex-column gap-2 pt-4 pb-2 pl-3 pr-3 pointer ${pathname === '/pricing' ? 'active' : ''}`}>
                                    <Link className="nav-link-mobile flex items-center justify-between" href="/pricing" onClick={() => setOpenMenuMobile(false)}>
                                        <span className="body2 font-semibold">Pricing</span>
                                    </Link>
                                </li>
                                {/* Blog (móvil) - se mantiene como en tu versión "buena" */}
                                <li className={`nav-item-mobile h-full flex-column gap-2 pt-4 pb-2 pl-3 pr-3 pointer ${pathname === '/blog' ? 'active' : ''}`}>
                                    <Link className="nav-link-mobile flex items-center justify-between" href="/blog" onClick={() => setOpenMenuMobile(false)}>
                                        <span className="body2 font-semibold">Blog</span>
                                    </Link>
                                </li>
                                {/* Contact (móvil) - se mantiene como en tu versión "buena" */}
                                <li className={`nav-item-mobile h-full flex-column gap-2 pt-4 pb-2 pl-3 pr-3 pointer ${pathname === '/contact' ? 'active' : ''}`}>
                                    <Link className="nav-link-mobile flex items-center justify-between" href="/contact" onClick={() => setOpenMenuMobile(false)}>
                                        <span className="body2 font-semibold">Contact</span>
                                    </Link>
                                </li>
                            </ul>
                             {/* CtaTwo en móvil - se mantiene como en tu versión "buena" */}
                            <div className="menu-cta-mobile pt-4 pb-4 pl-3 pr-3">
                                <CtaTwo />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default MenuTwo