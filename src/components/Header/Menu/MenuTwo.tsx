'use client'

// Importaciones de React y hooks necesarios
import React, { useEffect, useState } from "react"
// Importa usePathname de Next.js para obtener la ruta actual del URL
import { usePathname } from "next/navigation";
// Importa componentes de Image y Link de Next.js para optimización de imágenes y navegación
import Image from "next/image"
import Link from "next/link"
// Importa iconos de la biblioteca Phosphor-icons
import * as Icon from "@phosphor-icons/react/dist/ssr";

// Componente funcional para el menú de navegación principal
const MenuTwo = () => {
    // Obtiene la ruta actual del URL para manejar el estado activo de los enlaces
    const pathname = usePathname()
    // Estado para controlar si el encabezado debe tener un estilo fijo (sticky)
    const [fixedHeader, setFixedHeader] = useState(false)
    // Estado para controlar la apertura y cierre del menú móvil
    const [openMenuMobile, setOpenMenuMobile] = useState(false)
    // Estado para controlar la apertura y cierre de los submenús en el menú móvil.
    // Guarda el índice del submenú abierto o null si ninguno está abierto.
    const [openSubNavMobile, setOpenSubNavMobile] = useState<number | null>(null)

    // Función para manejar la apertura/cierre de los submenús en el menú móvil
    const handleOpenSubNavMobile = (index: number) => {
        // Si el submenú en el índice dado ya está abierto, lo cierra (establece a null).
        // De lo contrario, lo abre (establece el índice).
        setOpenSubNavMobile(openSubNavMobile === index ? null : index)
    }

    // Efecto que se ejecuta una vez después del renderizado inicial para añadir un listener de scroll
    useEffect(() => {
        // Función que se ejecuta cada vez que el usuario hace scroll
        const handleScroll = () => {
            const scrollPosition = window.scrollY; // Obtiene la posición actual del scroll vertical
            // Establece fixedHeader a true si la posición del scroll es mayor a 400px, para fijar el encabezado.
            setFixedHeader(scrollPosition > 400);
        };

        // Agrega el evento 'scroll' al objeto window cuando el componente se monta
        window.addEventListener('scroll', handleScroll);

        // Función de limpieza: se ejecuta cuando el componente se desmonta
        // Elimina el listener del evento para evitar fugas de memoria
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []); // El array vacío asegura que el efecto se ejecute solo una vez al montar y desmontar

    // Renderizado del componente
    return (
        <>
            {/* Contenedor principal del encabezado del menú */}
            {/* La clase 'fixed' se aplica dinámicamente si fixedHeader es true */}
            <div className={`header-menu style-one bg-white ${fixedHeader ? 'fixed' : ''}`}>
                <div className="container flex items-center justify-between h-20">
                    {/* Bloque izquierdo del menú: Logo */}
                    <Link className="menu-left-block" href="/">
                        <Image
                            src={'/images/logo.svg'} // Ruta de la imagen del logo
                            width={1800} // Ancho intrínseco de la imagen
                            height={1600} // Alto intrínseco de la imagen
                            alt="logo" // Texto alternativo para accesibilidad
                            priority={true} // Prioriza la carga de esta imagen
                            className="w-[149px] max-sm:w-[132px]" // Clases de Tailwind para el tamaño de la imagen
                        />
                    </Link>
                    {/* Bloque central del menú: Navegación principal (para escritorio) */}
                    <div className="menu-center-block h-full">
                        {/* Lista de elementos de navegación */}
                        <ul className="menu-nav flex items-center xl:gap-2 h-full">
                            {/* Elemento de navegación 'Home' */}
                            {/* La clase 'active' se aplica si la ruta actual es '/' */}
                            <li className={`nav-item h-full flex items-center justify-center home ${pathname === '/' ? 'active' : ''}`}>
                                <Link className="nav-link text-title flex items-center gap-1" href="/">
                                    <span>Home</span>
                                </Link>

                            </li>
                            {/* Elemento de navegación 'About' */}
                            {/* La clase 'active' se aplica si la ruta actual es '/about' */}
                            <li className={`nav-item h-full flex items-center justify-center ${pathname === '/about' ? 'active' : ''}`}>
                                <Link className="nav-link text-title flex items-center gap-1" href="/about">
                                    <span>About</span>
                                </Link>
                            </li>
                            {/* Elemento de navegación 'Services' con submenú */}
                            {/* La clase 'active' se aplica si la ruta actual incluye '/services' */}
                            <li className={`nav-item h-full flex items-center justify-center ${pathname.includes('/services') ? 'active' : ''}`}>
                                <Link className="nav-link text-title flex items-center gap-1" href="/services">
                                    <span>Services</span>
                                    <span><Icon.CaretDown className="text-sm" /></span>
                                </Link>
                                {/* Submenú para 'Services' */}
                                <ul className="sub-nav">
                                    {/* Elementos del submenú */}
                                    <li className={`sub-nav-item ${pathname === '/services/web-design' ? 'active' : ''}`}>
                                        <Link className="sub-nav-link font-medium" href="/services/web-design">Web Design</Link>
                                    </li>
                                    <li className={`sub-nav-item ${pathname === '/services/seo-optimization' ? 'active' : ''}`}>
                                        <Link className="sub-nav-link font-medium" href="/services/seo-optimization">SEO Optimization</Link>
                                    </li>
                                    <li className={`sub-nav-item ${pathname === '/services/directory-listing' ? 'active' : ''}`}>
                                        <Link className="sub-nav-link font-medium" href="/services/directory-listing">Directory Listing</Link>
                                    </li>
                                    <li className={`sub-nav-item ${pathname === '/services/social-media' ? 'active' : ''}`}>
                                        <Link className="sub-nav-link font-medium" href="/services/social-media">Social Media</Link>
                                    </li>
                                    <li className={`sub-nav-item ${pathname === '/services/content-creation' ? 'active' : ''}`}>
                                        <Link className="sub-nav-link font-medium" href="/services/content-creation">Content Creation</Link>
                                    </li>
                                </ul>
                            </li>
                            {/* Elemento de navegación 'Case Studies' con submenú */}
                            {/* La clase 'active' se aplica si la ruta actual incluye '/case-studies/' */}
                            <li className={`nav-item h-full flex items-center justify-center ${pathname.includes('/case-studies/') ? 'active' : ''}`}>
                                <Link className="nav-link text-title flex items-center gap-1" href="/case-studies">
                                    <span>Case Studies</span>
                                    <span><Icon.CaretDown className="text-sm" /></span>
                                </Link>
                                {/* Submenú para 'Case Studies' */}
                                <ul className="sub-nav">
                                    {/* Elementos del submenú */}
                                    <li className={`sub-nav-item ${pathname === '/case-studies/real-estate' ? 'active' : ''}`}>
                                        <Link className="sub-nav-link font-medium" href="/case-studies/real-estate">Real Estate</Link>
                                    </li>
                                    <li className={`sub-nav-item ${pathname === '/case-studies/insurance' ? 'active' : ''}`}>
                                        <Link className="sub-nav-link font-medium" href="/case-studies/insurance">Insurance</Link>
                                    </li>
                                    <li className={`sub-nav-item ${pathname === '/case-studies/coaching' ? 'active' : ''}`}>
                                        <Link className="sub-nav-link font-medium" href="/case-studies/coaching">Coaching</Link>
                                    </li>
                                    <li className={`sub-nav-item ${pathname === '/case-studies/cleaning' ? 'active' : ''}`}>
                                        <Link className="sub-nav-link font-medium" href="/case-studies/cleaning">House Cleaning</Link>
                                    </li>
                                </ul>
                            </li>
                            {/* Elemento de navegación 'Pricing' */}
                            {/* La clase 'active' se aplica si la ruta actual es '/pricing' */}
                            <li className={`nav-item h-full flex items-center justify-center ${pathname === '/pricing' ? 'active' : ''}`}>
                                <Link className="nav-link text-title flex items-center gap-1" href="/pricing">
                                    <span>Pricing</span>
                                </Link>
                            </li>
                            {/* Elemento de navegación 'Blog' */}
                            {/* La clase 'active' se aplica si la ruta actual es '/blog' */}
                            <li className={`nav-item h-full flex items-center justify-center ${pathname === '/blog' ? 'active' : ''}`}>
                                <Link className="nav-link text-title flex items-center gap-1" href="/blog">
                                    <span>Blog</span>
                                </Link>
                            </li>
                            {/* Elemento de navegación 'Contact' */}
                            {/* La clase 'active' se aplica si la ruta actual es '/contact' */}
                            <li className={`nav-item h-full flex items-center justify-center ${pathname === '/contact' ? 'active' : ''}`}>
                                <Link className="nav-link text-title flex items-center gap-1" href="/contact">
                                    <span>Contact</span>
                                </Link>
                            </li>
                        </ul>
                    </div>
                    {/* Bloque derecho del menú: Iconos de redes sociales (oculto en pantallas pequeñas) */}
                    <div className="menu-right-block max-sm:hidden">
                        <div className="list-social style-two flex items-center gap-2.5 style-one">
                            {/* Enlaces a redes sociales */}
                            <Link className="item rounded-full w-7 h-7 border-grey border flex items-center justify-center" href="https://www.facebook.com/" target="_blank">
                                <i className="icon-facebook text-sm"></i>
                            </Link>
                            <Link className="item rounded-full w-7 h-7 border-grey border flex items-center justify-center" href="https://www.linkedin.com/" target="_blank">
                                <i className="icon-in text-xs"></i>
                            </Link>
                            <Link className="item rounded-full w-7 h-7 border-grey border flex items-center justify-center" href="https://www.twitter.com/" target="_blank">
                                <i className="icon-twitter text-[10px]"></i>
                            </Link>
                            <Link className="item rounded-full w-7 h-7 border-grey border flex items-center justify-center" href="https://www.instagram.com/" target="_blank">
                                <i className="icon-insta text-[10px]"></i>
                            </Link>
                            <Link className="item rounded-full w-7 h-7 border-grey border flex items-center justify-center" href="https://www.youtube.com/" target="_blank">
                                <i className="icon-youtube text-[10px]"></i>
                            </Link>
                        </div>
                    </div>
                    {/* Icono de hamburguesa para el menú móvil (visible solo en pantallas pequeñas) */}
                    {/* Al hacer clic, alterna el estado de openMenuMobile */}
                    <div className="menu-humburger lg:hidden pointer" onClick={() => setOpenMenuMobile(!openMenuMobile)}>
                        <Icon.List className="text-2xl" weight="bold" />
                    </div>
                </div>
                {/* Bloque del menú móvil */}
                {/* La clase 'open' se aplica si openMenuMobile es true para mostrar el menú */}
                <div id="menu-mobile-block" className={`${openMenuMobile && 'open'}`}>
                    <div className="menu-mobile-main">
                        <div className="container">
                            {/* Lista de elementos de navegación para el menú móvil - ACTUALIZADA para Fascinante Digital */}
                            <ul className="menu-nav-mobile h-full pt-1 pb-1">
                                {/* Elemento de navegación 'Home' en móvil */}
                                <li className={`nav-item-mobile h-full flex-column gap-2 pt-2 pb-2 pl-3 pr-3 pointer ${pathname === '/' ? 'active' : ''}`}>
                                    <Link className="nav-link-mobile flex items-center justify-between" href="/">
                                        <span className="body2 font-semibold">Home</span>
                                    </Link>
                                </li>
                                {/* Elemento de navegación 'About' en móvil */}
                                <li className={`nav-item-mobile h-full flex-column gap-2 pt-4 pb-2 pl-3 pr-3 pointer ${pathname === '/about' ? 'active' : ''}`}>
                                    <Link className="nav-link-mobile flex items-center justify-between" href="/about">
                                        <span className="body2 font-semibold">About</span>
                                    </Link>
                                </li>
                                {/* Elemento de navegación 'Services' con submenú en móvil */}
                                {/* Se activa al hacer clic y alterna el estado de openSubNavMobile para el índice 1 */}
                                <li className={`nav-item-mobile h-full flex-column gap-2 pt-4 pb-2 pl-3 pr-3 pointer ${openSubNavMobile === 1 || pathname.includes('/services') ? 'active' : ''}`}
                                    onClick={() => handleOpenSubNavMobile(1)}
                                >
                                    <a className="nav-link-mobile flex items-center justify-between" href="#!"> {/* Usamos <a> con href="#!" para evitar navegación al hacer clic en el padre */}
                                        <span className="body2 font-semibold">Services</span>
                                        <Icon.CaretRight className="text-base" />
                                    </a>
                                    {/* Submenú para 'Services' en móvil */}
                                    {/* La clase 'open' se aplica si openSubNavMobile es 1 */}
                                    <ul className={`sub-nav-mobile ${openSubNavMobile === 1 ? 'open' : ''}`}>
                                        <li className={`sub-nav-item pl-3 pr-3 pt-2 pb-2 ${pathname === '/services/web-design' ? 'active' : ''}`}>
                                            <Link className="sub-nav-link text-base" href="/services/web-design">Web Design</Link>
                                        </li>
                                        <li className={`sub-nav-item pl-3 pr-3 pt-2 pb-2 ${pathname === '/services/seo-optimization' ? 'active' : ''}`}>
                                            <Link className="sub-nav-link text-base" href="/services/seo-optimization">SEO Optimization</Link>
                                        </li>
                                        <li className={`sub-nav-item pl-3 pr-3 pt-2 pb-2 ${pathname === '/services/directory-listing' ? 'active' : ''}`}>
                                            <Link className="sub-nav-link text-base" href="/services/directory-listing">Directory Listing</Link>
                                        </li>
                                        <li className={`sub-nav-item pl-3 pr-3 pt-2 pb-2 ${pathname === '/services/social-media' ? 'active' : ''}`}>
                                            <Link className="sub-nav-link text-base" href="/services/social-media">Social Media</Link>
                                        </li>
                                        <li className={`sub-nav-item pl-3 pr-3 pt-2 pb-2 ${pathname === '/services/content-creation' ? 'active' : ''}`}>
                                            <Link className="sub-nav-link text-base" href="/services/content-creation">Content Creation</Link>
                                        </li>
                                    </ul>
                                </li>
                                {/* Elemento de navegación 'Case Studies' con submenú en móvil */}
                                {/* Se activa al hacer clic y alterna el estado de openSubNavMobile para el índice 2 */}
                                <li className={`nav-item-mobile h-full flex-column gap-2 pt-4 pb-2 pl-3 pr-3 pointer ${openSubNavMobile === 2 || pathname.includes('/case-studies/') ? 'active' : ''}`}
                                    onClick={() => handleOpenSubNavMobile(2)}
                                >
                                    <a className="nav-link-mobile flex items-center justify-between" href="#!"> {/* Usamos <a> con href="#!" */}
                                        <span className="body2 font-semibold">Case Studies</span>
                                        <Icon.CaretRight className="text-base" />
                                    </a>
                                    {/* Submenú para 'Case Studies' en móvil */}
                                    {/* La clase 'open' se aplica si openSubNavMobile es 2 */}
                                    <ul className={`sub-nav-mobile ${openSubNavMobile === 2 ? 'open' : ''}`}>
                                        <li className={`sub-nav-item pl-3 pr-3 pt-2 pb-2 ${pathname === '/case-studies/real-estate' ? 'active' : ''}`}>
                                            <Link className="sub-nav-link text-base" href="/case-studies/real-estate">Real Estate</Link>
                                        </li>
                                        <li className={`sub-nav-item pl-3 pr-3 pt-2 pb-2 ${pathname === '/case-studies/insurance' ? 'active' : ''}`}>
                                            <Link className="sub-nav-link text-base" href="/case-studies/insurance">Insurance</Link>
                                        </li>
                                        <li className={`sub-nav-item pl-3 pr-3 pt-2 pb-2 ${pathname === '/case-studies/coaching' ? 'active' : ''}`}>
                                            <Link className="sub-nav-link text-base" href="/case-studies/coaching">Coaching</Link>
                                        </li>
                                        <li className={`sub-nav-item pl-3 pr-3 pt-2 pb-2 ${pathname === '/case-studies/cleaning' ? 'active' : ''}`}>
                                            <Link className="sub-nav-link text-base" href="/case-studies/cleaning">House Cleaning</Link>
                                        </li>
                                    </ul>
                                </li>
                                {/* Elemento de navegación 'Pricing' en móvil */}
                                <li className={`nav-item-mobile h-full flex-column gap-2 pt-4 pb-2 pl-3 pr-3 pointer ${pathname === '/pricing' ? 'active' : ''}`}>
                                    <Link className="nav-link-mobile flex items-center justify-between" href="/pricing">
                                        <span className="body2 font-semibold">Pricing</span>
                                    </Link>
                                </li>
                                {/* Elemento de navegación 'Blog' en móvil */}
                                <li className={`nav-item-mobile h-full flex-column gap-2 pt-4 pb-2 pl-3 pr-3 pointer ${pathname === '/blog' ? 'active' : ''}`}>
                                    <Link className="nav-link-mobile flex items-center justify-between" href="/blog">
                                        <span className="body2 font-semibold">Blog</span>
                                    </Link>
                                </li>
                                {/* Elemento de navegación 'Contact' en móvil */}
                                <li className={`nav-item-mobile h-full flex-column gap-2 pt-4 pb-2 pl-3 pr-3 pointer ${pathname === '/contact' ? 'active' : ''}`}>
                                    <Link className="nav-link-mobile flex items-center justify-between" href="/contact">
                                        <span className="body2 font-semibold">Contact</span>
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default MenuTwo
