import Link from 'next/link';
import ArrowBackSvg from '@components/icons/ArrowBackSvg.js';
import RippleButton from './RippleButton.js';

export default function BackButton() {
    return (
        <div className='fixed top-0 left-0 m-2 flex flex-row items-center justify-center text-secondary text-small backdrop-blur-xl bg-neutral-300/50 shadow-lg rounded-full cursor-pointer transition-transform hover:scale-110 z-10'>
            <RippleButton className="px-2 py-2">
                <div href="/" className="flex items-center">
                    {/* <ArrowBackSvg width="20px" height="40px" fill="#4c0519" /> */}
                    Retour
                </div>
            </RippleButton>
        </div>
    );
}
