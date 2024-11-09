"use client";

import { useRouter } from 'next/navigation';
import Image from 'next/image';

import bottle from '../icons/bottle.png'
export default function BackButton() {
    const router = useRouter(); // Initialiser le routeur

    const handleBack = () => {
        // Remonter en haut de la page avant de naviguer
        window.scrollTo({ top: 0, behavior: 'smooth' });
        router.back(); // Retour à la page précédente
    };

    return (
        <div className='fixed bottom-0 left-0 right-0 h-8 w-full flex flex-row items-center justify-center bg-white '>

            <button
                onClick={handleBack}
                className="flex flex-row items-center gap-8  text-black rounded transition"
            >
                <Image src={bottle} alt="Rouge" width={15} className="-rotate-90 " />
                Retour
            </button>
        </div>
    );
}