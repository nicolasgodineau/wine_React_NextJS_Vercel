"use client"
import { useEffect, useState, useCallback } from "react";
import React from 'react';

export default function Header({ icon, title }) {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        let timeoutId;

        const handleScroll = () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }

            timeoutId = setTimeout(() => {
                const scrollY = window.scrollY;
                const pageHeight = document.documentElement.scrollHeight;
                const viewportHeight = window.innerHeight;

                // Only apply scroll effect if page is tall enough to scroll
                if (pageHeight > viewportHeight + 100) {
                    setIsScrolled(scrollY > 100);
                } else {
                    setIsScrolled(false);
                }
            }, 10);
        };

        // Initial check
        handleScroll();

        window.addEventListener("scroll", handleScroll);
        window.addEventListener("resize", handleScroll);

        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", handleScroll);
        };
    }, []);

    return (
        <header
            className="sticky top-0 left-0 right-0 p-0 z-50 rounded-b-2xl"
        >
            <div className={`transition-all duration-300 ${isScrolled ? " flex flex-row!important items-center justify-center p-0 py-1 shadow  backdrop-blur-lg backdrop-saturate-50 bg-white/60 rounded-b-2xl mx-2" : "flex flex-col items-center bg-white py-2"}`}>

                <span className={`transition-all duration-300 ${isScrolled ? "text-5xl" : "text-7xl"}`}>
                    {React.isValidElement(icon)
                        ? React.cloneElement(icon, {
                            width: isScrolled ? 48 : 72,
                            height: isScrolled ? 48 : 72,
                            className: `inline-block transition-all duration-300 ${icon.props.className || ''}`
                        })
                        : icon
                    }
                </span>
                <h1
                    className={`text-h2 font-bold text-center px-2 transition-all duration-300 ${isScrolled ? "text-secondary text-h2 px-0" : "text-primary"}`}
                >
                    {title}
                </h1>
            </div>
        </header>
    );
};