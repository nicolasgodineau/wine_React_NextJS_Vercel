import Link from 'next/link';

import ArrowBackSvg from '@components/icons/ArrowBackSvg.js';

export default function BackButton() {
    return (
        <div className='fixed top-0 left-0 right-0 h-8 w-full flex flex-row items-center justify-center p-2 pt-4 text-red bg-white'>
            <Link href="/" className="flex flex-row items-center transition">
                <ArrowBackSvg width="40px" height="40px" fill="#4c0519" />
                Retour
            </Link>
        </div>
    );
}