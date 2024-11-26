'use client';

import React, { useState } from 'react';

export default function RippleButton({ children, onClick, className = '' }) {
    const [ripples, setRipples] = useState([]);

    const handleClick = (e) => {
        const button = e.currentTarget;
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Créer un "ripple" unique
        const newRipple = { id: Date.now(), x, y };
        setRipples((prev) => [...prev, newRipple]);

        // Supprimer le ripple après l'animation
        setTimeout(() => {
            setRipples((prev) => prev.filter((ripple) => ripple.id !== newRipple.id));
        }, 1000);

        // Appeler la fonction onClick passée en prop
        if (onClick) onClick(e);
    };

    return (
        <button
            onClick={handleClick}
            className={`relative overflow-hidden rounded-full p-2 bg-red-950 focus:outline-none ${className}`}
        >
            {children}
            {/* Conteneur pour les ripples */}
            <div className="absolute inset-0 pointer-events-none">
                {ripples.map((ripple) => (
                    <span
                        key={ripple.id}
                        className="absolute bg-red bg-opacity-20 rounded-full animate-ripple"
                        style={{
                            left: ripple.x,
                            top: ripple.y,
                            width: '50px',
                            height: '50px',
                            marginLeft: '-50px',
                            marginTop: '-50px',
                        }}
                    />
                ))}
            </div>
        </button>
    );
}
