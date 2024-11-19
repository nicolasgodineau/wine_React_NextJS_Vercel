'use client';

import { useState } from 'react';
import Menu from "./Menu.js"
import Search from './Search.js';


export default function Footer() {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    return (
        <footer className={`fixed bottom-0 left-0 right-0 flex flex-row justify-center items-center  }`}>
            <div className={`w-[100%] flex flex-row justify-around items-center rounded-3xl backdrop-blur-xl bg-neutral-200/10 dark:bg-neutral-800/30 shadow px-8 p-4 mx-8 mb-4`}>
                <Menu isSearchOpen={isSearchOpen} setIsSearchOpen={setIsSearchOpen} />
            </div>
        </footer>
    )
}