// src/type/ServiceType.tsx

// Nueva interfaz para definir la estructura de cada FAQ
export interface FaqDefinition {
    id: string | number; // ID único para la FAQ (puede ser string o número)
    title: string;       // La pregunta en sí
    desc: string;        // La respuesta
}

export interface ServiceType {
    id: string;
    icon: string;
    category: string;
    title: string;
    menuTitle: string; // Para el menú de navegación
    desc: string;      // Descripción general (usada en listados, etc.)
    shortDesc: string; // Para metadatos o resúmenes más cortos

    // Campos para la página de detalle del servicio
    bannerImageUrl?: string;    // URL de la imagen para el breadcrumb/banner
    detailHeading?: string;     // Encabezado principal del contenido detallado
    detailParagraph1?: string;  // Primer párrafo del contenido detallado
    contentImageUrl?: string;   // URL de la imagen principal dentro del contenido
    detailSubHeading?: string;  // Subtítulo dentro del contenido detallado
    detailParagraph2?: string;  // Segundo párrafo del contenido detallado
    features?: string[];        // Lista de características clave del servicio

    // Nuevo campo para las FAQs específicas del servicio
    faqs?: FaqDefinition[];     // Array de objetos FaqDefinition, opcional
}