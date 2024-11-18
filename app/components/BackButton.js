"use client";

import Link from 'next/link';
import Image from 'next/image';

import bottle from '@icons/bottle.png';

export default function BackButton() {
    return (
        <div className='fixed top-0 left-0 right-0 h-8 w-full flex flex-row items-center justify-center p-2 bg-neutral-200'>
            <Link href="/" className="flex flex-row items-center gap-8 text-black rounded transition">
                <Image src={bottle} alt="Retour" width={15} className="-rotate-90 " />
                Retour
            </Link>
        </div>
    );
}