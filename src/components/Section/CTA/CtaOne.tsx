// src/components/Section/CTA/CtaOne.tsx
import Link from "next/link";

const CtaOne = () => {
    return (
        <div
            className="cta-block style-two relative lg:h-[120px] h-[180px] overflow-hidden"
            style={{
                backgroundImage: 'linear-gradient(to right, #C026D3, #6D28D9)' // Fuchsia-600 to Purple-700 gradient
            }}
        >
            <div className="container flex items-center justify-between max-lg:flex-col max-lg:justify-center gap-6 h-full">
                <div className="heading5 max-lg:text-center text-white drop-shadow">
                    Ready to elevate your digital presence?
                </div>
                <Link
                    className={`
                        button-main 
                        bg-white text-fuchsia-700          /* Estado normal: fondo blanco, texto fucsia */
                        border-2 border-white               /* Borde inicial blanco (o transparente si prefieres que aparezca en hover) */
                        hover:bg-transparent                /* Hover: fondo transparente */
                        hover:text-white                    /* Hover: texto blanco */
                        hover:border-white                  /* Hover: borde blanco (asegura que se mantenga si el borde inicial era diferente) */
                        text-button                         /* Tu clase para estilo de texto del botón */
                        px-9 py-3                           /* Padding específico */
                        transition-all duration-300 ease-in-out /* Transición para todos los cambios */
                        shadow-lg
                    `}
                    href="/contact" // Ajustado a una ruta más probable para la página de contacto
                >
                    Let&apos;s Talk
                </Link>
            </div>
        </div>
    );
};

export default CtaOne;