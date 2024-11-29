'use client';

import { useState } from 'react';
import Menu from "./Menu.js"
import BackButton from './BackButton.js';
import BackToTop from './BackToTop.js';

export default function Footer() {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    return (
        <footer className={`fixed bottom-0 left-0 right-0 flex flex-col justify-center items-center}`}>
            <BackToTop />
            <div className='w-full flex flex-col items-center px-2 rounded-t-2xl backdrop-blur-lg backdrop-saturate-50'>
                <div className={`w-[100%] flex flex-row justify-between items-center rounded-2xl bg-neutral-300/70 mx-2 mb-2`}>
                    <Menu isSearchOpen={isSearchOpen} setIsSearchOpen={setIsSearchOpen} />
                </div>
            </div>
        </footer>
    )
}