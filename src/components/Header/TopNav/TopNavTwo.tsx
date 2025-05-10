import React from "react"
// Importa el componente Image de Next.js para la optimización de imágenes
import Image from "next/image"
// Importa el componente Link de Next.js para la navegación en la aplicación
import Link from "next/link"
// Importa todos los iconos de la biblioteca Phosphor-icons
import * as Icon from "@phosphor-icons/react/dist/ssr";

// Componente funcional para la barra de navegación superior
const TopNavTwo = () => {
    return (
        <>
            {/* Contenedor principal de la barra de navegación superior */}
            <div className="top-nav style-two bg-dark-blue">
                {/* Contenedor interno para alinear elementos y definir la altura */}
                <div className="container flex items-center justify-between h-[44px]">
                    {/* Bloque para la selección de idioma */}
                    <div className="select-block relative">
                        {/* Selector de idioma. Es un elemento <select> estándar de HTML. */}
                        {/* Las clases de Tailwind CSS se aplican para el estilo. */}
                        <select className="border-none outline-none bg-dark-blue text-white p-2 caption2">
                            <option value="English">English</option> {/* Opción para el idioma inglés */}
                            <option value="Español">Español</option> {/* Opción para el idioma español */}
                        </select>
                        {/* Icono de flecha hacia abajo, posicionada absolutamente para simular un select personalizado */}
                        <Icon.CaretDown weight="bold" className="text-xs text-white icon -right-2" />
                    </div>
                    {/* Bloque derecho con información de contacto */}
                    <div className="right-block flex items-center">
                        {/* Sección de ubicación (oculta en pantallas grandes) */}
                        <div className="location flex items-center max-lg:hidden">
                            {/* Icono de ubicación */}
                            <Icon.MapPin className="text-white text-xl" />
                            {/* Texto de la dirección */}
                            <span className="ml-2 caption1 text-white">2054 Vista Pkwy # 400, West Palm Beach, FL 33411</span>
                        </div>
                        {/* Sección de correo electrónico */}
                        <div className="mail lg:ml-7 flex items-center">
                            {/* Enlace para el correo electrónico. Al hacer clic, abrirá el cliente de correo. */}
                            {/* La propiedad 'href' usa el protocolo 'mailto:' para esto. */}
                            <Link href="mailto:info@fascinantedigital.com" className="flex items-center">
                                {/* Icono de sobre para el correo */}
                                <Icon.Envelope className="text-white text-xl" />
                                {/* Texto del correo electrónico */}
                                <span className="ml-2 caption1 text-white">info@fascinantedigital.com</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

// Exporta el componente para que pueda ser utilizado en otras partes de la aplicación
export default TopNavTwo