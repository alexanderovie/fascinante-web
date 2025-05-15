// src/components/Section/CTA/CtaTwo.tsx
'use client'

import React from 'react';

const CtaTwo = () => {
    const handleOpenBooking = () => {
        window.open("https://cal.com/fascinante-digital/15min", "_blank", "noopener,noreferrer");
    };

    return (
        <div className="button-block">
            <button 
                onClick={handleOpenBooking} 
                className="button-main bg-blue text-white"
            >
                Booking
            </button>
        </div>
    );
}

export default CtaTwo;