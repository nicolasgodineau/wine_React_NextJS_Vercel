'use client';

import { useState, useEffect } from 'react';
import BouteilleDark from '../icons/wine-bottle-dark.svg';
import BouteilleLight from '../icons/wine-bottle-light.svg';
import Image from 'next/image';

export default function BottleLoader() {
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        // Vérifier le mode initial
        setIsDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);

        // Écouter les changements de mode
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        console.log('mediaQuery:', mediaQuery)
        const handleChange = (e) => setIsDarkMode(e.matches);
        mediaQuery.addListener(handleChange);

        // Nettoyer l'écouteur
        return () => mediaQuery.removeListener(handleChange);
    }, []);

    const Bouteille = isDarkMode ? BouteilleDark : BouteilleLight;
    console.log('isDarkMode:', isDarkMode)

    return (
        <div className='absolute h-[90svh] w-full flex'>
            <div className='relative h-[190px] m-auto'>
                <div className='vin absolute h-[84px] w-[53px] left-[76px] bottom-[-4px]'>
                </div>
                <Image
                    width={200}
                    height={150}
                    className='bouteille'
                    src={Bouteille}
                    alt="Bouteille de vin"
                />
            </div>
        </div>
    );
}