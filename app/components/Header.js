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
            className="sticky top-0 left-0 right-0 p-0 z-50  bg-white"
        >
            <div className={`transition-all duration-300 ${isScrolled ? " flex flex-row!important items-center justify-center p-0 " : "flex flex-col items-center bg-transparent py-4"
                }`}>

                <span className={`transition-all duration-300 ${isScrolled ? "text-h1" : "text-7xl"}`}>{icon}</span>
                <h1
                    className={`text-h2 font-bold text-center transition-all duration-300 ${isScrolled ? "text-secondary text-h2" : "text-primary"
                        }`}
                >
                    {title}
                </h1>
            </div>
        </header>
    );
};

export default Header;
