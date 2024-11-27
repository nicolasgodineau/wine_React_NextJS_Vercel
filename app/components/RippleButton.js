"use client"
import React, { useState, useEffect } from 'react';

export default function Ripple({
    children,
    onClick,
    className = '',
    effectWidth = 50,
    effectHeight = 50,
}) {
    const [ripples, setRipples] = useState([]);

    const handleClick = (e) => {
        // Appelle l'onClick passé en props
        if (onClick) onClick(e); // IMPORTANT : Passer l'onClick ici

        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const newRipple = {
            id: Date.now(),
            x: `${x}px`,
            y: `${y}px`,
        };

        setRipples((prevRipples) => [...prevRipples, newRipple]);

        setTimeout(() => {
            setRipples((prevRipples) =>
                prevRipples.filter((ripple) => ripple.id !== newRipple.id)
            );
        }, 600); // Durée de vie du ripple
    };

    return (
        <button
            onClick={handleClick}
            className={`relative overflow-hidden focus:outline-none ${className}`}
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
                            width: `${effectWidth}px`,
                            height: `${effectHeight}px`,
                            marginLeft: `-${effectWidth / 2}px`,
                            marginTop: `-${effectHeight / 2}px`,
                        }}
                    />
                ))}
            </div>
        </button>
    );
}
