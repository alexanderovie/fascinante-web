// src/components/Section/CTA/CtaTwo.tsx (o la ruta correcta de tu componente)
'use client'

import React from 'react';
import Link from "next/link";
// Se eliminan los imports y el estado del Modal ya que no se usará

const CtaTwo = () => {
    return (
        <>
            <div className="button-block">
                {/* Envolver el botón con el componente Link de Next.js */}
                <Link href="/website-audit" passHref legacyBehavior>
                    <a className="button-main bg-blue text-white"> {/* Aplicar clases directamente al <a> si es necesario o al botón interno */}
                        Start Your Audit
                    </a>
                </Link>
                {/* Alternativamente, si el botón tiene estilos complejos o interactividad que quieres mantener como <button>: */}
                {/* <Link href="/website-audit" passHref>
                    <button 
                        className="button-main bg-blue text-white" // Asegúrate que estas clases estilicen bien el botón
                    >
                        Start Your Audit
                    </button>
                </Link>
                */}
            </div>

            {/* El componente Modal y su lógica han sido eliminados */}
        </>
    )
}

export default CtaTwo;
