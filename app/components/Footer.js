'use client';

import { useState } from 'react';
import Menu from "./Menu.js"


export default function Footer() {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    return (
        <footer className={`fixed bottom-0 left-0 right-0 flex flex-row justify-center items-center backdrop-blur-md backdrop-saturate-50 rounded-3xl }`}>
            <div className={`w-[100%]  flex flex-row bg-neutral-200/60 justify-around items-center backdrop-blur rounded-3xl p-4 mx-2 mb-2`}>
                <Menu isSearchOpen={isSearchOpen} setIsSearchOpen={setIsSearchOpen} />
            </div>
        </footer>
    )
}