// src/app/contact/page.tsx (o el nombre de tu archivo de página de contacto)
'use client'

import TopNavTwo from "@/components/Header/TopNav/TopNavTwo";
import MenuTwo from "@/components/Header/Menu/MenuTwo"; // Corregido para usar MenuTwo consistentemente
import BreadcrumbItem from "@/components/Breadcrumb/BreadcrumbItem";
import CtaOne from "@/components/Section/CTA/CtaOne";
import Footer from "@/components/Footer/Footer";
import * as Icon from "@phosphor-icons/react/dist/ssr"; // Tus iconos Phosphor

export default function ContactPage() { // Renombrado para claridad, puedes usar ContactStyleOne si prefieres
  return (
    <>
      <div className="overflow-x-hidden">
        <header id="header">
          <TopNavTwo />
          <MenuTwo />
        </header>
        <main className="content">
          <BreadcrumbItem
            link="Contact"
            img="/images/banner/about1.webp" // Asegúrate que esta imagen exista y sea adecuada
            title="Get In Touch"
            desc="Connect with Fascinante Digital for expert Web Design, Digital Marketing, and Local Listing services."
          />
          {/* --- TU LAYOUT ORIGINAL PARA LA SECCIÓN DEL FORMULARIO --- */}
          <div className="form-contact style-one lg:py-[100px] sm:py-16 py-10">
            <div className="container flex items-center justify-center">
              <div className="xm:w-5/6 w-full flex max-xl:flex-col xl:items-center gap-y-8">
                
                {/* Columna Izquierda: Información de Contacto (Mantenida como la tenías, con pequeños ajustes de clases de texto si aplica) */}
                <div className="w-full xl:w-2/5">
                  <div className="infor bg-blue rounded-xl p-8 sm:p-10 text-white"> {/* Usando tu var(--blue) y var(--white) */}
                    <div className="heading5 mb-1">Let's Connect</div> {/* Usando tu clase .heading5 */}
                    {/* La clase .body3 no está en tu globals.css, usaré .body2 que sí está */}
                    <div className="body2 mt-2 opacity-90">
                      Reach out to us! We're here to help you elevate your digital presence.
                    </div>
                    <div className="list-social flex flex-wrap items-center gap-3 md:mt-8 mt-6">
                      {/* Tus iconos <i> se mantienen. Asegúrate que src/styles/icons/style.css esté importado globalmente */}
                      <a className="item rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-surface hover:opacity-80 transition-opacity" href="https://www.facebook.com/" target="_blank" aria-label="Facebook"><i className="icon-facebook text-black dark:text-blue"></i></a>
                      <a className="item rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-surface hover:opacity-80 transition-opacity" href="https://www.linkedin.com/" target="_blank" aria-label="LinkedIn"><i className="icon-in text-black dark:text-blue"></i></a>
                      <a className="item rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-surface hover:opacity-80 transition-opacity" href="https://www.twitter.com/" target="_blank" aria-label="Twitter"><i className="icon-twitter text-sm text-black dark:text-blue ml-1"></i></a>
                      <a className="item rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-surface hover:opacity-80 transition-opacity" href="https://www.instagram.com/" target="_blank" aria-label="Instagram"><i className="icon-insta text-sm text-black dark:text-blue"></i></a>
                      <a className="item rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-surface hover:opacity-80 transition-opacity" href="https://www.youtube.com/" target="_blank" aria-label="YouTube"><i className="icon-youtube text-xs text-black dark:text-blue"></i></a>
                    </div>
                    <div className="list-more-infor md:mt-8 mt-6 space-y-5">
                      <div className="item flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 bg-white rounded-full flex-shrink-0"><Icon.Clock weight="bold" className="text-blue text-xl" /></div>
                        <div className="text-button normal-case opacity-90">8AM - 6PM, Mon - Sun</div>
                      </div>
                      <div className="item flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 bg-white rounded-full flex-shrink-0"><Icon.Phone weight="fill" className="text-blue text-xl" /></div>
                        <div className="text-button normal-case opacity-90">(800) 886-4981</div>
                      </div>
                      <div className="item flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 bg-white rounded-full flex-shrink-0"><Icon.EnvelopeSimple weight="bold" className="text-blue text-xl" /></div>
                        <div className="text-button normal-case opacity-90">info@fascinantedigital.com</div>
                      </div>
                      <div className="item flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 bg-white rounded-full flex-shrink-0"><Icon.MapPin weight="bold" className="text-blue text-xl" /></div>
                        <div className="caption1 normal-case opacity-90 leading-snug">2054 Vista Pkwy # 400, West Palm Beach, FL 33411</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Columna Derecha: Formulario (con estilos aplicados a los campos internos) */}
                <div className="w-full xl:w-3/5 xl:pl-20">
                  <form className="form-block flex flex-col justify-between gap-y-6 sm:gap-y-7"> {/* Ajustado gap-5 a gap-y-6 o 7 */}
                    <div className="heading text-left">
                      <div className="heading5 text-black dark:text-white">Send Us a Message</div>
                      {/* Usando .body2 para la descripción del formulario */}
                      <div className="body2 text-secondary dark:text-gray-300 mt-1 sm:mt-2">
                        Fill out the form below and we'll get back to you shortly.
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label htmlFor="contact-name" className="block caption1 font-semibold text-gray-700 dark:text-gray-200 mb-1.5">Your Name</label>
                        <input
                          id="contact-name"
                          className="w-full bg-surface dark:bg-gray-700 text-secondary dark:text-gray-300 caption11 px-4 py-3 rounded-lg border border-line dark:border-gray-600 focus:ring-2 focus:ring-blue focus:border-transparent transition-colors"
                          type="text"
                          placeholder="e.g. Alexander Oviedo"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="contact-subject" className="block caption1 font-semibold text-gray-700 dark:text-gray-200 mb-1.5">Subject</label>
                        <input
                          id="contact-subject"
                          className="w-full bg-surface dark:bg-gray-700 text-secondary dark:text-gray-300 caption11 px-4 py-3 rounded-lg border border-line dark:border-gray-600 focus:ring-2 focus:ring-blue focus:border-transparent transition-colors"
                          type="text"
                          placeholder="e.g. Web Design Inquiry"
                          required
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label htmlFor="contact-email" className="block caption1 font-semibold text-gray-700 dark:text-gray-200 mb-1.5">Your Email</label>
                        <input
                          id="contact-email"
                          className="w-full bg-surface dark:bg-gray-700 text-secondary dark:text-gray-300 caption11 px-4 py-3 rounded-lg border border-line dark:border-gray-600 focus:ring-2 focus:ring-blue focus:border-transparent transition-colors"
                          type="email"
                          placeholder="e.g. alexander@example.com"
                          required
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label htmlFor="contact-service" className="block caption1 font-semibold text-gray-700 dark:text-gray-200 mb-1.5">Service of Interest</label>
                        <div className="select-block w-full relative">
                          <select
                            id="contact-service"
                            className="w-full appearance-none bg-surface dark:bg-gray-700 text-secondary dark:text-gray-300 caption11 px-4 py-3 rounded-lg border border-line dark:border-gray-600 focus:ring-2 focus:ring-blue focus:border-transparent transition-colors"
                            name="serviceOfInterest"
                            defaultValue=""
                            required
                          >
                            <option value="" disabled>Select a Service</option>
                            <option value="Web Design">Web Design</option>
                            <option value="Digital Marketing">Digital Marketing</option>
                            <option value="Local Directory Listing">Local Directory Listing</option>
                            <option value="Other">Other</option>
                          </select>
                          <Icon.CaretDown weight="bold" className="icon absolute right-4 top-1/2 -translate-y-1/2 text-secondary dark:text-gray-400 text-lg pointer-events-none" />
                        </div>
                      </div>
                      <div className="sm:col-span-2 w-full">
                        <label htmlFor="contact-message" className="block caption1 font-semibold text-gray-700 dark:text-gray-200 mb-1.5">Your Message</label>
                        <textarea
                          id="contact-message"
                          className="w-full bg-surface dark:bg-gray-700 text-secondary dark:text-gray-300 caption11 px-4 py-3 rounded-lg border border-line dark:border-gray-600 focus:ring-2 focus:ring-blue focus:border-transparent transition-colors"
                          name="message"
                          rows={4}
                          placeholder="Tell us more about your project or question..."
                          required
                        ></textarea>
                      </div>
                    </div>
                    <div className="button-block pt-2">
                      <button 
                        type="submit" 
                        className="button-main bg-blue text-white hover:bg-dark-blue dark:hover:bg-blue-700" // Estilo de SliderFive (sin rounded-full, sin text-button)
                      >
                        Send Message
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <CtaOne />
        </main>
        <footer id="footer">
          <Footer />
        </footer>
      </div>
    </>
  );
}