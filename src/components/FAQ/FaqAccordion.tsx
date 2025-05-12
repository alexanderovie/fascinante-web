// src/components/FAQ/FaqAccordion.tsx
'use client' // Correcto, es un Componente de Cliente para la interactividad

import { useState } from 'react';
import * as IconPhosphor from "@phosphor-icons/react/dist/ssr";

// Define un tipo para los items de FAQ que recibirá este componente
interface FaqItemType { // Este tipo coincide con la estructura de FaqDefinition que definimos
    id: number | string; 
    title: string;
    desc: string;
}

interface FaqAccordionProps {
    items: FaqItemType[]; // Recibe un array de FAQs
    heading?: string; 
}

const FaqAccordion: React.FC<FaqAccordionProps> = ({ items, heading }) => {
    const [openFaqId, setOpenFaqId] = useState<number | string | null>(null);

    const handleToggleFaq = (id: number | string) => {
        setOpenFaqId(prevId => prevId === id ? null : id);
    };

    // Si no hay items, no renderiza nada (buena práctica)
    if (!items || items.length === 0) {
        return null; 
    }

    // La lógica de renderizado es genérica y funciona con cualquier array de 'items'
    // que cumpla con FaqItemType
    return (
        <div className="list-question lg:mt-[60px] mt-8">
            {heading && <div className="heading6">{heading}</div>}
            {items.map(item => (
                <div
                    key={item.id}
                    className={`question-item hover-box-shadow pointer mt-5 px-7 rounded-lg border border-line cursor-pointer ${openFaqId === item.id ? 'open' : ''}`}
                    onClick={() => handleToggleFaq(item.id)}
                >
                    <div className="question-item-main flex items-center justify-between py-4 heading7">
                        {item.title}
                        {openFaqId === item.id ? (
                            <IconPhosphor.Minus weight="bold" className="text-xl flex-shrink-0" />
                        ) : (
                            <IconPhosphor.Plus weight="bold" className="text-xl flex-shrink-0" />
                        )}
                    </div>
                    <div className="content-question"> {/* Asegúrate que tu CSS maneje la clase .open para mostrar/ocultar esto */}
                        <div className="border-line w-full"></div>
                        <div className="body3 text-secondary pb-4 pt-2">{item.desc}</div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default FaqAccordion;