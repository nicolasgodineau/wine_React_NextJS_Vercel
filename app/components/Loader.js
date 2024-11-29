'use client';
import BouteilleDark from '@icons/wine-bottle-dark.svg';
import BouteilleLight from '@icons/wine-bottle-light.svg';
import BottelLoaderSvg from '@components/icons/BottelLoaderSvg.js';
import Image from 'next/image.js';
import { useEffect, useState } from 'react';
import Bouteille from "@icons/Group.png"
import { useRouter } from 'next/navigation';

export default function Loader() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const handleStart = () => setLoading(true);
        const handleComplete = () => setLoading(false);

        router.events.on('routeChangeStart', handleStart);
        router.events.on('routeChangeComplete', handleComplete);
        router.events.on('routeChangeError', handleComplete);

        return () => {
            router.events.off('routeChangeStart', handleStart);
            router.events.off('routeChangeComplete', handleComplete);
            router.events.off('routeChangeError', handleComplete);
        };
    }, [router]);

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
