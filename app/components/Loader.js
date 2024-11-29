'use client';
import BouteilleDark from '@icons/wine-bottle-dark.svg';
import BouteilleLight from '@icons/wine-bottle-light.svg';
import BottelLoaderSvg from '@components/icons/BottelLoaderSvg.js';
import Image from 'next/image.js';
import { useEffect, useState } from 'react';
import Bouteille from "@icons/Group.png"
import { usePathname, useSearchParams } from 'next/navigation';

export default function Loader() {
    const [loading, setLoading] = useState(false);
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        const handleStart = () => setLoading(true);
        const handleComplete = () => {
            setLoading(false);
        };

        handleStart();
        // Set a small timeout to show loading state
        const timer = setTimeout(handleComplete, 100);

        return () => {
            clearTimeout(timer);
        };
    }, [pathname, searchParams]); // This will trigger when the route changes

    if (!loading) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-80 z-50">
            <div className='custom_vin w-min h-60'>
                {/* Pour le liquide */}
            </div>
            <Image
                className='absolute w-min h-60 overflow-hidden'
                src={Bouteille}
                alt="Bouteille de vin"
                width={176}
                height={176}
                style={{ objectFit: "contain" }}
            />
        </div>
    );
}
