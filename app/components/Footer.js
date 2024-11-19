'use client';

import { useState } from 'react';
import Menu from "./Menu.js"
import Search from './Search.js';


export default function Footer() {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    return (
        <footer className={`fixed bottom-0 left-0 right-0 flex flex-row justify-center items-center px-8 }`}>
            <div className={`w-[100%] flex flex-row bg-neutral-200/60 justify-around items-center backdrop-blur-md rounded-3xl shadow p-4 mx-2 mb-4`}>
                <Menu isSearchOpen={isSearchOpen} setIsSearchOpen={setIsSearchOpen} />
            </div>
        </footer>
    )
}