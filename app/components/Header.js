"use client"
import { useEffect, useState } from "react";
import React from 'react';

export default function Header({ icon, title }) {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // Vérifie si l'utilisateur a scrollé plus de 50px par exemple
            setIsScrolled(window.scrollY > 100);
        };

        // Ajoute un listener pour écouter le scroll
        window.addEventListener("scroll", handleScroll);

        // Nettoie l'event listener à la destruction du composant
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
            className="sticky top-0 left-0 right-0 p-0 z-50  "
        >
            <div className={`transition-transform duration-300 ${isScrolled ? " flex flex-row!important items-center justify-center p-0 py-1 shadow  backdrop-blur-lg backdrop-saturate-50 bg-white/60" : "flex flex-col items-center bg-white py-4"
                }`}>

                <span className={`transition-transform duration-300 ${isScrolled ? "text-5xl" : "text-7xl"}`}>
                    {React.isValidElement(icon)
                        ? React.cloneElement(icon, {
                            width: isScrolled ? 48 : 72,
                            height: isScrolled ? 48 : 72,
                            className: `inline-block transition-transform duration-300 ${icon.props.className || ''}`
                        })
                        : icon
                    }
                </span>
                <h1
                    className={`text-h2 font-bold text-center px-2 transition-transform duration-300 ${isScrolled ? "text-secondary text-h2 px-0" : "text-primary"
                        }`}
                >
                    {title}
                </h1>
            </div>
        </header>
    );
};