import React from "react";
import Image from "next/image";
import Link from "next/link";
import * as Icon from "@phosphor-icons/react/dist/ssr";

interface Props {
    link: string;
    img: string;
    title: string;
    desc: string;
}

const BreadcrumbItem: React.FC<Props> = ({ link, img, title, desc }) => {
    return (
        <div className="breadcrumb-block w-full lg:h-[400px] sm:h-[360px] h-[320px] relative">
            {/* Contenedor para la imagen de fondo y el overlay */}
            <div className="absolute inset-0">
                {/* Imagen de Fondo */}
                <div className="w-full h-full absolute top-0 left-0 z-0">
                    <Image
                        src={img}
                        width={4000}
                        height={3000}
                        alt="banner"
                        className="w-full h-full object-cover"
                        priority
                    />
                </div>

                {/* Overlay Oscuro al 90% */}
                <div
                    className="absolute inset-0 z-10"
                    style={{ backgroundColor: 'rgba(0, 31, 84, 0.7)' }}
                ></div>
            </div>

            {/* Contenido del Breadcrumb (Texto y navegación) */}
            <div className="container relative h-full flex flex-col justify-center items-center text-center z-20">
                {/* Navegación (Home / Link) */}
                <div className="heading-nav flex items-center gap-1 absolute top-8 py-1.5 px-4 rounded-full bg-line">
                    <Link className="hover:underline caption1 text-white" href="/">
                        Home
                    </Link>
                    <Icon.CaretDoubleRight className="text-white" />
                    <div className="caption1 text-white">{link}</div>
                </div>

                {/* Texto principal (Título y Descripción) */}
                <div className="text-nav xl:w-1/2 md:w-3/5 w-11/12">
                    <div className="heading3 text-white">{title}</div>
                    <div className="sub-heading mt-4 text-white font-normal">{desc}</div>
                </div>
            </div>
        </div>
    );
};

export default BreadcrumbItem;