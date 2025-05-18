// src/components/Section/FormRequest/FormRequestTwo.tsx
'use client'

import React from "react";
import Image from 'next/image'; // <--- IMPORTANTE: Importar Image de next/image
import * as Icon from "@phosphor-icons/react/dist/ssr";

interface Props {
    bgImg?: string; // Hacer bgImg opcional por si a veces no quieres imagen de fondo
    classname?: string;
}

const FormRequestTwo: React.FC<Props> = ({ bgImg, classname }) => {
    return (
        <div className={`form-request-block ${classname || ''} relative overflow-hidden`}> {/* Añadido overflow-hidden */}
            {/* Imagen de fondo con Next/Image */}
            {bgImg && ( // Solo renderiza la imagen si bgImg se proporciona
                <Image
                    src={bgImg} // Aquí recibirá "/images/banner/team-celebrating.webp"
                    alt="Background for form section" // Un alt descriptivo es bueno
                    layout="fill" // Para que la imagen llene el contenedor padre
                    objectFit="cover" // Para que la imagen cubra el área manteniendo la relación de aspecto
                    quality={75} // Puedes ajustar la calidad (0-100)
                    priority={false} // Asegura que el lazy loading esté activo (es el valor por defecto)
                    className="-z-10" // Para que la imagen esté detrás del contenido
                />
            )}
            {/* Overlay opcional para mejorar contraste del texto sobre la imagen */}
            {/* Puedes ajustar la opacidad (ej. bg-black/30, bg-black/50) o quitarlo si no es necesario */}
            {bgImg && <div className="absolute inset-0 bg-black/40 -z-10"></div>}

            {/* Contenedor del contenido, debe estar por encima de la imagen/overlay */}
            <div
                className="container relative z-10 h-full py-[60px]"
                // Fallback de color si no hay bgImg y tu clase 'style-two' no define un fondo
                style={!bgImg ? { backgroundColor: `var(--surface)` } : {}}
            >
                <div className="flex max-lg:flex-col lg:items-center justify-between gap-8 h-full">
                    <div className="lg:w-1/2">
                        {/* Asegúrate que el color del texto tenga buen contraste con el fondo/overlay */}
                        <div className="heading2 text-white">Let’s build<br />future together</div>
                        <div className="caption1 text-gray-200 mt-4"> {/* Color ajustado para legibilidad sobre fondo oscuro */}
                            Job Searching Just Got Easy. Use Jobtex to run a hiring site and earn<br className="max-sm:hidden" />money in the process!
                        </div>
                    </div>
                    <div className="lg:w-1/2">
                        <form className="form-block rounded-xl bg-white p-7 flex flex-col justify-between gap-5">
                            <div className="heading6">Need Help?</div>
                            <div className="grid sm:grid-cols-2 gap-5">
                                <div className="max-sm:col-span-2">
                                    <input
                                        className="w-full bg-surface caption1 px-4 py-3 rounded-lg"
                                        type="text"
                                        placeholder="Name"
                                        required
                                    />
                                </div>
                                <div className="max-sm:col-span-2">
                                    <input
                                        className="w-full bg-surface caption1 px-4 py-3 rounded-lg"
                                        type="email"
                                        placeholder="Email"
                                        required
                                    />
                                </div>
                                <div className="col-span-2 select-block relative">
                                    <select
                                        className="w-full bg-surface caption1 pl-4 py-3 rounded-lg"
                                        name="form"
                                    >
                                        <option value="Financial Planning">Financial Planning</option>
                                        <option value="Business Planning">Business Planning</option>
                                        <option value="Development Planning">Development Planning</option>
                                    </select>
                                    <Icon.CaretDown className="absolute top-1/2 -translate-y-1/2 right-4" />
                                </div>
                                <div className="col-span-2">
                                    <textarea
                                        className="w-full bg-surface caption1 px-4 py-3 rounded-lg"
                                        name="message"
                                        rows={3}
                                        placeholder="Your Message"
                                        required
                                    ></textarea>
                                </div>
                            </div>
                            <div className="button-block">
                                <button
                                    className="button-main bg-blue text-white text-button" // Asegúrate que estas clases usen tus colores de tema
                                    aria-label="Send Message"
                                >
                                    Send Message
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FormRequestTwo;