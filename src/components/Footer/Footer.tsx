import * as Icon from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import Link from "next/link";


const Footer = () => {
    // Get the current year dynamically for the copyright
    const currentYear = new Date().getFullYear();

    return (
        <div className="style-one">
            <div className="footer-block bg-dark pt-[60px]">
                <div className="container">
                    <div className="flex max-lg:flex-col max-lg:items-start gap-y-10 pb-10">
                        <div className="lg:w-1/4">
                            <div className="footer-company-infor flex flex-col justify-between gap-5">
                                {/* Footer logo - Assuming logo-white.svg is correct */}
                                <Image width={4000} height={3000} className="footer-logo w-[145px]" src="/images/logo-white.svg" alt="Fascinante Digital Logo" />
                                {/* Company description updated for Fascinante Digital's services */}
                                <div className="text caption1 text-white">We specialize in elevating your online presence through expert Web Design, effective Digital Marketing, and strategic Local Directory Listing.</div>
                                {/* Social media links - Assuming icons and links are correct placeholders */}
                                <div className="list-social flex items-center gap-2.5 style-one">
                                    <Link className="item rounded-full w-7 h-7 border-2 border-grey flex items-center justify-center" href="https://www.facebook.com/" target="_blank" aria-label="Facebook">
                                        <i className="icon-facebook text-sm"></i>
                                    </Link>
                                    <Link className="item rounded-full w-7 h-7 border-2 border-grey flex items-center justify-center" href="https://www.linkedin.com/" target="_blank" aria-label="LinkedIn">
                                        <i className="icon-in text-sm"></i>
                                    </Link>
                                    <Link className="item rounded-full w-7 h-7 border-2 border-grey flex items-center justify-center" href="https://www.twitter.com/" target="_blank" aria-label="Twitter">
                                        <i className="icon-twitter text-xs"></i>
                                    </Link>
                                    <Link className="item rounded-full w-7 h-7 border-2 border-grey flex items-center justify-center" href="https://www.instagram.com/" target="_blank" aria-label="Instagram">
                                        <i className="icon-insta text-xs"></i>
                                    </Link>
                                    <Link className="item rounded-full w-7 h-7 border-2 border-grey flex items-center justify-center" href="https://www.youtube.com/" target="_blank" aria-label="YouTube">
                                        <i className="icon-youtube text-xs"></i>
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="lg:w-1/2">
                            <div className="footer-navigate flex items-center justify-center gap-20">
                                {/* Quick Links - Updated hrefs */}
                                <div className="footer-nav-item">
                                    <div className="item-heading text-button-sm text-white">Quick Links</div>
                                    <ul className="list-nav mt-1">
                                        {/* Link updated to /about */}
                                        <li className="mt-3"><Link className="caption1 has-line-before line-white text-surface hover-underline" href="/about">About Us</Link></li>
                                        {/* Link updated to /services */}
                                        <li className="mt-3"><Link className="caption1 has-line-before line-white text-surface hover-underline" href="/services">Services</Link></li>
                                        {/* Link updated to /case-studies */}
                                        <li className="mt-3"><Link className="caption1 has-line-before line-white text-surface hover-underline" href="/case-studies">Case Studies</Link></li>
                                        {/* Link updated to /contact */}
                                        <li className="mt-3"><Link className="caption1 has-line-before line-white text-surface hover-underline" href="/contact">Contact</Link></li>
                                    </ul>
                                </div>
                                {/* Pages - Updated hrefs */}
                                <div className="footer-nav-item max-sm:hidden">
                                    <div className="item-heading text-button-sm text-white">Pages</div>
                                    <ul className="list-nav mt-1">
                                        {/* Link updated to /faq */}
                                        <li className="mt-3"><Link className="caption1 has-line-before line-white text-surface hover-underline" href="/faq">FAQs</Link></li>
                                        {/* Pricing link remains /pricing */}
                                        <li className="mt-3"><Link className="caption1 has-line-before line-white text-surface hover-underline" href="/pricing">Pricing</Link></li>
                                        {/* Partners link remains as is, assuming no top-level /partners */}
                                        <li className="mt-3"><Link className="caption1 has-line-before line-white text-surface hover-underline" href="/pages/partners">Partners</Link></li>
                                        {/* Support Center link updated to /contact */}
                                        <li className="mt-3"><Link className="caption1 has-line-before line-white text-surface hover-underline" href="/contact">Support Center</Link></li>
                                    </ul>
                                </div>
                                {/* Recursos section updated */}
                                <div className="footer-nav-item">
                                    {/* Heading changed to Recursos */}
                                    <div className="item-heading text-button-sm text-white">Recursos</div>
                                    <ul className="list-nav mt-1">
                                        {/* Blog link */}
                                        <li className="mt-3"><Link className="caption1 has-line-before line-white text-surface hover-underline" href="/blog">Blog</Link></li>
                                        {/* Auditoria Web link */}
                                        <li className="mt-3"><Link className="caption1 has-line-before line-white text-surface hover-underline" href="/services/web-audit">Auditoria Web</Link></li>
                                        {/* Added Chat en Vivo link */}
                                        <li className="mt-3"><a className="caption1 has-line-before line-white text-surface hover-underline" href="#!">Chat en Vivo</a></li>
                                        {/* Added Free SEO Audit Tool link */}
                                        <li className="mt-3"><Link className="caption1 has-line-before line-white text-surface hover-underline" href="#!">Herramienta Gratuita de Auditoría SEO</Link></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="lg:w-1/4">
                            <div className="company-contact">
                                {/* Newsletter heading */}
                                <div className="heading text-button-sm text-white">Stay Updated</div>
                                {/* Contact information block */}
                                <div className="mt-3 flex items-center">
                                    {/* SVG icon - Assuming this icon is desired */}
                                    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M26.43 16.1254C25.785 16.1254 25.275 15.6004 25.275 14.9704C25.275 14.4154 24.72 13.2604 23.79 12.2554C22.875 11.2804 21.87 10.7104 21.03 10.7104C20.385 10.7104 19.875 10.1854 19.875 9.55539C19.875 8.92539 20.4 8.40039 21.03 8.40039C22.53 8.40039 24.105 9.21039 25.485 10.6654C26.775 12.0304 27.6 13.7254 27.6 14.9554C27.6 15.6004 27.075 16.1254 26.43 16.1254Z" fill="#C1D8FF"></path>
                                        <path d="M31.8446 16.125C31.1996 16.125 30.6896 15.6 30.6896 14.97C30.6896 9.645 26.3546 5.325 21.0446 5.325C20.3996 5.325 19.8896 4.8 19.8896 4.17C19.8896 3.54 20.3996 3 21.0296 3C27.6296 3 32.9996 8.37 32.9996 14.97C32.9996 15.6 32.4746 16.125 31.8446 16.125Z" fill="#C1D8FF"></path>
                                        <path d="M17.685 21.315L12.78 26.22C12.24 25.74 11.715 25.245 11.205 24.735C9.66 23.175 8.265 21.54 7.02 19.83C5.79 18.12 4.8 16.41 4.08 14.715C3.36 13.005 3 11.37 3 9.81C3 8.79 3.18 7.815 3.54 6.915C3.9 6 4.47 5.16 5.265 4.41C6.225 3.465 7.275 3 8.385 3C8.805 3 9.225 3.09 9.6 3.27C9.99 3.45 10.335 3.72 10.605 4.11L14.085 9.015C14.355 9.39 14.55 9.735 14.685 10.065C14.82 10.38 14.895 10.695 14.895 10.98C14.895 11.34 14.79 11.7 14.58 12.045C14.385 12.39 14.1 12.75 13.74 13.11L12.6 14.295C12.435 14.46 12.36 14.655 12.36 14.895C12.36 15.015 12.375 15.12 12.405 15.24C12.45 15.36 12.495 15.45 12.525 15.54C12.795 16.035 13.26 16.68 13.92 17.46C14.595 18.24 15.315 19.035 16.095 19.83C16.635 20.355 17.16 20.865 17.685 21.315Z" fill="#C1D8FF"></path>
                                        <path d="M32.9554 27.4955C32.9554 27.9155 32.8804 28.3505 32.7304 28.7705C32.6854 28.8905 32.6404 29.0105 32.5804 29.1305C32.3254 29.6705 31.9954 30.1805 31.5604 30.6605C30.8254 31.4705 30.0154 32.0555 29.1004 32.4305C29.0854 32.4305 29.0704 32.4455 29.0554 32.4455C28.1704 32.8055 27.2104 33.0005 26.1754 33.0005C24.6454 33.0005 23.0104 32.6405 21.2854 31.9055C19.5604 31.1705 17.8354 30.1805 16.1254 28.9355C15.5404 28.5005 14.9554 28.0655 14.4004 27.6005L19.3054 22.6955C19.7254 23.0105 20.1004 23.2505 20.4154 23.4155C20.4904 23.4455 20.5804 23.4905 20.6854 23.5355C20.8054 23.5805 20.9254 23.5955 21.0604 23.5955C21.3154 23.5955 21.5104 23.5055 21.6754 23.3405L22.8154 22.2155C23.1904 21.8405 23.5504 21.5555 23.8954 21.3755C24.2404 21.1655 24.5854 21.0605 24.9604 21.0605C25.2454 21.0605 25.5454 21.1205 25.8754 21.2555C26.2054 21.3905 26.5504 21.5855 26.9254 21.8405L31.8904 25.3655C32.2804 25.6355 32.5504 25.9505 32.7154 26.3255C32.8654 26.7005 32.9554 27.0755 32.9554 27.4955Z" fill="#2868D8"></path>
                                    </svg>
                                    <div className="text ml-16">
                                        <div className="caption2 text-surface">Need help? Call us 24/7</div>
                                        {/* Phone number updated */}
                                        <div className="fw-700 text-white mt-1">(800) 886-4981</div>
                                    </div>
                                </div>
                                {/* Location - Address updated */}
                                <div className="locate mt-3 flex items-center">
                                    <Icon.MapPin weight="light" className="text-surface" />
                                    <div className="caption1 text-surface ml-2">2054 Vista Pkwy # 400</div>
                                </div>
                                {/* Newsletter form - Assuming this functionality is desired */}
                                <form className="send-block mt-5 flex items-center h-[46px] rounded-lg overflow-hidden">
                                    <input className="caption1 text-secondary h-full w-full pr-4 pl-3" type="text" placeholder="Enter your email" required />
                                    <button className="flex items-center justify-center w-[46px] h-[46px] bg-blue flex-shrink-0" aria-label="Subscribe">
                                        <Icon.PaperPlaneTilt className="text-white" />
                                    </button>
                                </form>
                                {/* Newsletter description updated */}
                                <div className="caption2 text-surface mt-2">Subscribe to our newsletter for digital tips and updates.</div>
                            </div>
                        </div>
                    </div>
                    {/* Border line */}
                    <div className="border-line"></div>
                    {/* Footer bottom section */}
                    <div className="footer-bottom flex items-center justify-between pt-3 pb-3">
                        <div className="left-block flex items-center">
                            {/* Copyright text updated with Fascinante Digital and current year */}
                            <div className="copy-right text-surface caption1">©{currentYear} Fascinante Digital. All Rights Reserved.</div>
                        </div>
                        {/* Legal links - Updated hrefs */}
                        <div className="nav-link flex items-center gap-2.5">
                            {/* Link updated to /Terms-Of-Services */}
                            <a className="text-surface caption1 hover-underline" href="/Terms-Of-Services">Terms Of Services</a>
                            <span className="text-surface caption1">|</span>
                            {/* Link updated to /Privacy-Policy */}
                            <a className="text-surface caption1 hover-underline" href="/Privacy-Policy">Privacy Policy</a>
                            <span className="text-surface caption1">|</span>
                            {/* Link updated to /Cookie-Policy */}
                            <a className="text-surface caption1 hover-underline" href="/Cookie-Policy">Cookie Policy</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Footer
