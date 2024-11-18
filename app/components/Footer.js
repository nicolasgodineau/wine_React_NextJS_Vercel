'use client';

import { useState } from 'react';
import Menu from "./Menu.js"


export default function Footer() {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    return (
        <footer className={`fixed bottom-0 left-0 right-0 flex flex-row justify-center items-center px-8 }`}>
            <div className={`w-[100%] flex flex-row bg-neutral-200/60 justify-around items-center backdrop-blur-md rounded-3xl p-4 mx-2 mb-2`}>
                <Menu isSearchOpen={isSearchOpen} setIsSearchOpen={setIsSearchOpen} />
            </div>
        </footer>
    )
}