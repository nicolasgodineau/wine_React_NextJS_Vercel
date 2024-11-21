'use client';

import { useState, useEffect } from 'react';
import BouteilleDark from '@icons/wine-bottle-dark.svg';
import BouteilleLight from '@icons/wine-bottle-light.svg';
import BottelLoaderSvg from '@components/icons/BottelLoaderSvg.js';

import Image from 'next/image';


export default function BottleLoader() {
    const [isDarkMode, setIsDarkMode] = useState(false);

    /* Permet de changer la bouteille si l'appareil est en mode dark ou light */
    useEffect(() => {
        // Vérifier le mode initial
        setIsDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);

        // Écouter les changements de mode
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = (e) => setIsDarkMode(e.matches);
        mediaQuery.addListener(handleChange);

        // Nettoyer l'écouteur
        return () => mediaQuery.removeListener(handleChange);
    }, []);

    const Bouteille = isDarkMode ? BouteilleLight : BouteilleDark;

    return (
        <div className='absolute top-[40%] left-2/4 -translate-x-1/2  m-auto flex '>
            <div className='custom_vin '>
                {/* Pour le liquide */}
            </div>
            <BottelLoaderSvg />
        </div>
    );
}