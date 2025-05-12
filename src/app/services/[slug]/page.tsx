// src/app/services/[slug]/page.tsx
import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation'; // Importante para manejar servicios no encontrados

// Asumiendo que tu ServiceType está definido en src/type/ServiceType.tsx
import { ServiceType } from '@/type/ServiceType'; // Ajusta la ruta si es diferente

// --- Funciones para obtener datos ---
// (Puedes mover estas funciones a un archivo utils/data-fetchers.ts si prefieres)

// Función para cargar todos los servicios desde tu JSON
async function getAllServices(): Promise<ServiceType[]> {
    const filePath = path.join(process.cwd(), 'src', 'data', 'service.json');
    try {
        const jsonData = fs.readFileSync(filePath, 'utf-8');
        const services = JSON.parse(jsonData) as ServiceType[];
        // Asegúrate de que cada servicio tenga un 'id' o 'slug' que puedas usar.
        // Si no lo tiene, necesitarás generarlo a partir del título.
        // Por ejemplo, si no tienes un 'id' en service.json pero sí un 'title':
        return services.map(service => ({
            ...service,
            // Genera un slug si no existe uno explícito. Asegúrate que tu ServiceType tenga 'id' o 'slug'.
            id: service.id || service.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''),
        }));
    } catch (error) {
        console.error("Error leyendo service.json:", error);
        return [];
    }
}

// Función para obtener un servicio específico por su slug/id
async function getServiceBySlug(slug: string): Promise<ServiceType | undefined> {
    const services = await getAllServices();
    return services.find((service) => (service.id || service.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')) === slug);
}

// --- Generación de Parámetros Estáticos ---
// Next.js usará esto en el momento del build para saber qué páginas de servicio generar
export async function generateStaticParams() {
    const services = await getAllServices();

    return services.map((service) => ({
        // El nombre 'slug' aquí debe coincidir con el nombre de tu carpeta dinámica: [slug]
        slug: (service.id || service.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')),
    }));
}

// --- (Opcional) Generación de Metadatos Dinámicos ---
// Para el <title> y <meta name="description"> de cada página de servicio
export async function generateMetadata({ params }: { params: { slug: string } }) {
    const service = await getServiceBySlug(params.slug);

    if (!service) {
        return {
            title: 'Servicio no Encontrado',
            description: 'El servicio que buscas no existe.',
        };
    }

    return {
        title: `${service.title} | Fascinante Digital`, // Ejemplo de título
        description: service.shortDesc || service.desc,    // Usa shortDesc si existe, sino desc
    };
}

// --- Componente de la Página de Detalle del Servicio ---
export default async function ServiceDetailPage({ params }: { params: { slug: string } }) {
    const { slug } = params; // El slug viene de la URL
    const service = await getServiceBySlug(slug);

    if (!service) {
        notFound(); // Esto mostrará la página not-found.js más cercana o la de Next.js por defecto
    }

    // Ahora puedes usar el objeto 'service' para renderizar los detalles
    return (
        <div>
            {/* Aquí puedes usar tu componente ServiceItem si es adecuado para una página de detalle,
              o diseñar esta página como necesites.
              Por ejemplo:
              <ServiceItem data={service} style="style-detail" number={0} /> 
              Asegúrate de que el 'style-detail' exista en tu ServiceItem o crea un nuevo diseño.
            */}

            <h1>{service.title}</h1>
            <p><strong>Categoría:</strong> {service.category}</p>
            {service.icon && <i className={`${service.icon} text-5xl`}></i>} {/* Muestra el icono si existe */}
            <p>{service.desc}</p>
            {service.shortDesc && <p><em>Resumen: {service.shortDesc}</em></p>}

            {/* Puedes considerar usar el ServiceDetailLayout que tienes si es un componente de layout:
              <ServiceDetailLayout>
                <h1>{service.title}</h1>
                ...
              </ServiceDetailLayout>
            */}
        </div>
    );
}