'use client'

// Importa componentes esenciales de Next.js.
import Link from "next/link"

// Define el componente CtaTwo.
const CtaTwo = () => {
    return (
        // Contenedor principal del botón de llamada a la acción (CTA).
        <div className="button-block">
            {/* Enlace al formulario de auditoría */}
            <Link href="/audit" className="button-main bg-blue text-white">
                Start Your Audit
            </Link>
        </div>
    )
}

// Exporta el componente para usarlo en otras partes del proyecto.
export default CtaTwo