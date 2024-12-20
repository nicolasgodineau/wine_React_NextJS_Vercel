"use client"
import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import Link from "next/link.js";


import GrappeSvg from '@app/components/icons/GrappeSvg.js';
import EarthSvg from '@app/components/icons/EarthSvg.js';
import SearchSvg from '@app/components/icons/SearchSvg.js';
import Search from './Search.js';
import RippleButton from '@components/RippleButton.js';

export default function Menu({ isSearchOpen, setIsSearchOpen }) {
    const [color, setColor] = useState('white');

    useEffect(() => {
        // Vérifie si le mode sombre est activé
        const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

        // Définit la couleur selon le thème
        const themeColor = isDarkMode ? 'white' : 'black';
        setColor(themeColor);
    }, []);

    const [openItem, setOpenItem] = useState(null);
    const menuRef = useRef(null);

    const menuItems = useMemo(() => [
        {
            name: 'Planète',
            src: EarthSvg,
            alt: 'Icône de planète',
            title: 'Voir la liste des pays',
            dropdownClass: 'dropdown-top',
            items: [
                { label: 'Tous les pays', href: '/pays' },
                { label: 'Afrique', href: '/pays?continent=Afrique' },
                { label: 'Amérique du Nord', href: '/pays?continent=Amérique du Nord' },
                { label: 'Amérique du Sud', href: '/pays?continent=Amérique du Sud' },
                { label: 'Asie', href: '/pays?continent=Asie' },
                { label: 'Europe', href: '/pays?continent=Europe' },
                { label: 'Océanie', href: '/pays?continent=Océanie' },
            ]
        },

        {
            name: 'Recherche',
            src: SearchSvg,
            alt: 'Icône de recherche',
            title: 'Rechercher',
            items: [],
        },
        {
            name: 'Cépages',
            src: GrappeSvg,
            alt: 'Icône de cépages',
            title: 'Voir la liste des cépages',
            dropdownClass: 'dropdown-top dropdown-end',
            items: [
                { label: 'Tous les cépages', href: '/cepages' },
                { label: 'Cépages rouges', href: '/cepages?type=Rouge' },
                { label: 'Cépages blancs', href: '/cepages?type=Blanc' },
            ]
        },
    ], []);

    const handleItemClick = useCallback((itemName) => {
        if (itemName === 'Recherche') {
            setIsSearchOpen(prev => !prev);
            setOpenItem(null);
        } else {
            setOpenItem(prev => prev === itemName ? null : itemName);
            setIsSearchOpen(false);
        }
    }, [setIsSearchOpen]);

    const handleLinkClick = useCallback((e) => {
        e.stopPropagation();
        setOpenItem(null);
    }, []);

    const handleDivClick = useCallback(() => {
        setOpenItem(null);
    }, []);

    const getOpenItemContent = useCallback(() => {
        const item = menuItems.find(item => item.name === openItem);
        return item?.items || [];
    }, [menuItems, openItem]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setOpenItem(null);
                setIsSearchOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [setIsSearchOpen]);

    const containerClass = `w-full flex justify-around items-center px-2 ${openItem || isSearchOpen ? 'flex-col-reverse' : 'flex-row'}`;

    return (
        <div ref={menuRef} className={containerClass}>
            <div className='w-full flex justify-around items-center '>
                {menuItems.map((item) => (
                    <RippleButton key={item.name} className="rounded-full p-1">
                        <div
                            onClick={() => handleItemClick(item.name)}
                            className="cursor-pointer p-2 font-bold"
                        >
                            <item.src className="w-6 h-6" aria-label={item.alt} title={item.title} color="#4c0519" />
                        </div>
                    </RippleButton>
                ))}
            </div>
            {openItem && (
                <div onClick={handleDivClick} className="w-full flex justify-around items-center text-paragraph mb-2 pt-2 ">
                    <ul className='w-fit '>
                        {getOpenItemContent().map((subItem, index) => (
                            <li
                                key={index}
                                className="w-full"
                            >
                                <RippleButton className="w-full rounded-full text-center p-2" onClick={() => handleItemClick(subItem.name)}>
                                    <Link
                                        href={subItem.href}
                                        className={`${index === 0 ? 'font-bold text-h4' : ''}`}
                                        onClick={handleLinkClick}
                                    >
                                        {subItem.label}
                                    </Link>
                                </RippleButton>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            {isSearchOpen && <Search onClose={() => setIsSearchOpen(false)} setIsSearchOpen={setIsSearchOpen} />}
        </div>
    );
}