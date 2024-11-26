'use client';

import { useState } from 'react';
import Menu from "./Menu.js"

export default function Footer() {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    return (
        <footer className={`fixed bottom-0 left-0 right-0 flex flex-row justify-center items-center}`}>
            <div className={`w-[100%] flex flex-row justify-between items-center rounded-3xl backdrop-blur-3xl bg-neutral-300/50 shadow px-4 mx-2 mb-4`}>
                <Menu isSearchOpen={isSearchOpen} setIsSearchOpen={setIsSearchOpen} />
            </div>
        </footer>
    )
}