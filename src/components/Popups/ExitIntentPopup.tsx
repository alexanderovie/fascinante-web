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
    onClose // <--- AÑADIDO A LA DESESTRUCTURACIÓN
}: ExitIntentPopupProps) => {
    const [isVisible, setIsVisible] = useState(false);
    const [hasBeenShown, setHasBeenShown] = useState(true);

    useEffect(() => {
        const cookieValue = Cookies.get(POPUP_COOKIE_NAME);
        if (!cookieValue) {
            setHasBeenShown(false);
        }
    }, []);

    const handleMouseOut = useCallback((event: MouseEvent) => {
        if (hasBeenShown || isVisible) return;
        const isLeavingViewport = event.clientY < 50 && event.relatedTarget === null;
        if (isLeavingViewport) {
            setIsVisible(true);
            Cookies.set(POPUP_COOKIE_NAME, 'true', { expires: 1 });
            setHasBeenShown(true);
        }
    }, [hasBeenShown, isVisible]);

    useEffect(() => {
        if (hasBeenShown) return;
        window.addEventListener('mouseout', handleMouseOut);
        return () => {
            window.removeEventListener('mouseout', handleMouseOut);
        };
    }, [handleMouseOut, hasBeenShown]);

    const closePopup = () => {
        setIsVisible(false);
        if (onClose) { // Ahora onClose es accesible
            onClose();
        }
    };

    // ... (el resto del código del componente no cambia) ...
    // Clases para el botón CTA, usando los nombres de color de tu tailwind.config.ts
    // y replicando el estilo de .button-main de tu global.scss
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