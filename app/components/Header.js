"use client"
import { useEffect, useState } from "react";

const Header = ({ icon, title }) => {
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
            className={`sticky top-0 z-50  p-4  ${isScrolled ? "bg-white flex flex-row!important p-0 shadow-lg " : "flex flex-col items-center bg-transparent py-4"
                }`}
        >
            <span className="text-7xl">{icon}</span>
            <h1
                className={`text-h2 font-bold text-center transition-colors ${isScrolled ? "text-secondary" : "text-primary"
                    }`}
            >
                {title}
            </h1>
        </header>
    );
};

export default Header;
