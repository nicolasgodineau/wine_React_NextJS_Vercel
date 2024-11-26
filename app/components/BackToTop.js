"use client"
import React, { useState, useEffect } from 'react';
import ArrowBackSvg from '@components/icons/ArrowBackSvg';
export default function BackToTop() {
    // État pour contrôler la visibilité du bouton
    const [isVisible, setIsVisible] = useState(false);

    // Fonction pour faire défiler la page vers le haut
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    // Effet pour surveiller le défilement de la page
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 300) { // Montre le bouton après un certain défilement (300px)
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        // Nettoyage de l'événement lors de la suppression du composant
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <>
            {isVisible && (
                <div className="fixed bottom-20 right-8 p-2 backdrop-blur-xl bg-neutral-300/50 shadow-lg rounded-full cursor-pointer transition-transform hover:scale-110">
                    <button onClick={scrollToTop} className="flex items-center justify-center">
                        <ArrowBackSvg width="30px" height="30px" fill="#4c0519" className="transform rotate-90 " />
                    </button>
                </div>
            )}
        </>
    );
}
