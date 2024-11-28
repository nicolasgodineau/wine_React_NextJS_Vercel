'use client';
import BouteilleDark from '@icons/wine-bottle-dark.svg';
import BouteilleLight from '@icons/wine-bottle-light.svg';
import BottelLoaderSvg from '@components/icons/BottelLoaderSvg.js';
import Image from 'next/image.js';
import { useEffect, useState } from 'react';
import Bouteille from "@icons/Group.png"

export default function Loader() {
    const [show, setShow] = useState(true);

    useEffect(() => {
        // Hide the loader after 5 seconds
        setTimeout(() => {
            setShow(true);
        }, 5000);
    }, []);

    if (!show) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center  bg-opacity-80 z-50">
            <div className="flex flex-col items-center overflow-hidden relative">
                <div className='custom_vin absolute w-min h-60'>
                    {/* Pour le liquide */}
                </div>
                <Image
                    className='w-min h-60 overflow-hidden'
                    src={Bouteille}
                    alt="Bouteille de vin"
                    width={176}
                    height={176}
                    style={{ objectFit: "contain" }}
                />
            </div>
        </div>
    );
}
