'use client';
import BouteilleDark from '@icons/wine-bottle-dark.svg';
import BouteilleLight from '@icons/wine-bottle-light.svg';
import BottelLoaderSvg from '@components/icons/BottelLoaderSvg.js';
import Image from 'next/image.js';

import Bouteille from "@icons/Group.png"


export default function Loader() {
    return (
        <div className="fixed inset-0 flex items-center justify-center  bg-opacity-80 z-50">
            <div className="absolute flex flex-col items-center overflow-hidden">
                <div className='custom_vin w-full relative left-0 bottom-0 rounded-b-md'>
                    {/* Pour le liquide */}
                </div>
                <Image
                    className='relative w-min h-60 overflow-hidden'
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
