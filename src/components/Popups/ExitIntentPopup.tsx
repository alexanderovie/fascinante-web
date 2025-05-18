// src/components/Popups/ExitIntentPopup.tsx
'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Cookies from 'js-cookie';
import * as Icon from "@phosphor-icons/react/dist/ssr";

const POPUP_COOKIE_NAME = 'exitIntentPopupShown';

interface ExitIntentPopupProps {
    onClose?: () => void;
    offerTitle?: string;
    offerText?: string;
    ctaText?: string;
}

const ExitIntentPopup = ({
    offerTitle = "¡Un momento!",
    offerText = "Antes de irte, tenemos algo especial que podría interesarte.",
    ctaText = "Descubrir Oferta",
    onClose
}: ExitIntentPopupProps) => {
    const [isVisible, setIsVisible] = useState(false);
    const [hasBeenShown, setHasBeenShown] = useState(true); // Asume mostrado para evitar flash inicial
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        // Determinar si es móvil en el cliente
        // (navigator.userAgent no está disponible en el servidor)
        const mobileCheck = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        setIsMobile(mobileCheck);

        const cookieValue = Cookies.get(POPUP_COOKIE_NAME);
        if (!cookieValue) {
            setHasBeenShown(false); // Solo permite que se muestre si la cookie no existe
        }
    }, []);

    const triggerPopup = useCallback(() => {
        if (!isVisible && !hasBeenShown) { // Solo activa si no es visible y no se ha mostrado (según cookie)
            setIsVisible(true);
            Cookies.set(POPUP_COOKIE_NAME, 'true', { expires: 1 }); // Marcar como mostrado (ej. expira en 1 día)
            // No necesitamos setHasBeenShown(true) aquí porque la cookie lo manejará en la próxima carga.
            // Y `isVisible` ya previene múltiples activaciones en la misma sesión de vista.
        }
    }, [isVisible, hasBeenShown]);


    // Lógica para ESCRITORIO (mouseout)
    useEffect(() => {
        if (isMobile || hasBeenShown || isVisible) return; // No activar en móvil o si ya se mostró/es visible

        const handleMouseOut = (event: MouseEvent) => {
            // relatedTarget es null cuando el mouse sale del viewport del documento
            if (event.clientY < 50 && event.relatedTarget === null) {
                console.log('Desktop exit intent triggered');
                triggerPopup();
            }
        };

        window.addEventListener('mouseout', handleMouseOut);
        return () => {
            window.removeEventListener('mouseout', handleMouseOut);
        };
    }, [isMobile, hasBeenShown, isVisible, triggerPopup]);


    // Lógica para MÓVILES (scroll up)
    useEffect(() => {
        if (!isMobile || hasBeenShown || isVisible) return; // No activar en escritorio o si ya se mostró/es visible

        let lastScrollY = window.scrollY;
        let scrollTimeout: NodeJS.Timeout | null = null;
        let hasScrolledEnough = false; // Para asegurar que el usuario haya interactuado un poco

        const handleMobileScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY > 300) { // El usuario ha scrolleado al menos 300px
                hasScrolledEnough = true;
            }

            if (scrollTimeout) clearTimeout(scrollTimeout);

            scrollTimeout = setTimeout(() => {
                if (!hasScrolledEnough) { // No activar si no ha scrolleado lo suficiente
                    lastScrollY = currentScrollY;
                    return;
                }

                const scrollUpDistance = lastScrollY - currentScrollY;

                // Si scrollea hacia arriba una distancia considerable (ej. > 150px)
                // Y no está ya en la parte superior de la página (para evitar falsos positivos al cargar)
                if (scrollUpDistance > 150 && currentScrollY > 50) {
                    console.log('Mobile scroll up trigger');
                    triggerPopup();
                }
                lastScrollY = currentScrollY;
            }, 150); // Debounce para la detección
        };

        window.addEventListener('scroll', handleMobileScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', handleMobileScroll);
            if (scrollTimeout) clearTimeout(scrollTimeout);
        };
    }, [isMobile, hasBeenShown, isVisible, triggerPopup]);


    const closePopup = () => {
        setIsVisible(false);
        if (onClose) {
            onClose();
        }
    };

    const ctaButtonClasses = `
        w-full sm:w-auto 
        text-base font-bold capitalize 
        py-3 px-7
        rounded-lg 
        bg-blue text-white
        hover:bg-dark-blue
        dark:bg-blue dark:text-white dark:hover:bg-dark-blue
        transition-colors duration-150 ease-in-out 
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue dark:focus:ring-offset-gray-800
    `;

    return (
        <AnimatePresence>
            {isVisible && (
                <div
                    className="fixed inset-0 w-full h-full flex items-center justify-center bg-black/60 dark:bg-black/70 z-50 p-4"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="exit-popup-title"
                    onClick={closePopup}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className="bg-white dark:bg-dark rounded-lg shadow-xl p-6 sm:p-8 max-w-md w-full text-center relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={closePopup}
                            className="absolute top-3 right-3 sm:top-4 sm:right-4 p-1.5 rounded-full text-secondary dark:text-gray-400 hover:bg-surface dark:hover:bg-grey transition-colors"
                            aria-label="Cerrar popup"
                        >
                            <Icon.X size={24} weight="bold" />
                        </button>

                        <h2 
                            id="exit-popup-title" 
                            className="text-2xl sm:text-3xl font-bold text-black dark:text-white mb-3 sm:mb-4"
                        >
                            {offerTitle}
                        </h2>
                        <p 
                            className="text-secondary dark:text-gray-300 text-base mb-6 sm:mb-8"
                        >
                            {offerText}
                        </p>
                        <button
                            onClick={() => {
                                console.log('CTA clicked!');
                                closePopup();
                            }}
                            className={ctaButtonClasses}
                        >
                            {ctaText}
                        </button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ExitIntentPopup;