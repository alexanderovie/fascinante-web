// src/type/ServiceType.tsx
export interface ServiceType {
    id: string;
    icon: string;
    category: string;
    title: string;
    menuTitle: string;
    desc: string;
    shortDesc: string;

    // Nuevos campos para la página de detalle
    bannerImageUrl?: string; // Opcional si algunos no lo tienen, o string si todos lo tienen
    detailHeading?: string;
    detailParagraph1?: string;
    contentImageUrl?: string;
    detailSubHeading?: string;
    detailParagraph2?: string;
    features?: string[];
}