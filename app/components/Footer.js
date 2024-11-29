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
            <div className={`w-[100%] flex flex-row justify-between items-center rounded-3xl backdrop-blur-xl backdrop-saturate-50 bg-neutral-300/50 px-4 mb-4`}>
                <Menu isSearchOpen={isSearchOpen} setIsSearchOpen={setIsSearchOpen} />
            </div>
        </footer>
    )
}