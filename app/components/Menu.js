"use client"
import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import Image from "next/image.js";
import Link from "next/link.js";

import loupe from "@icons/loupe.png"
import planete from "@icons/planete.png"
import grappe from "@icons/grappe.png"
import Search from './Search.js';

export default function Menu({ isSearchOpen, setIsSearchOpen }) {
    const [openItem, setOpenItem] = useState(null);
    const menuRef = useRef(null);

    const menuItems = useMemo(() => [
        {
            name: 'Planète',
            src: planete,
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
            src: loupe,
            alt: 'Icône de recherche',
            title: 'Rechercher',
            items: [],
        },
        {
            name: 'Cépages',
            src: grappe,
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

    const containerClass = `w-full flex justify-around items-center ${openItem || isSearchOpen ? 'flex-col-reverse' : 'flex-row'}`;

    return (
        <div ref={menuRef} className={containerClass}>
            <div className='w-full flex justify-around items-center '>
                {menuItems.map((item) => (
                    <div key={item.name} className="cursor-pointer" onClick={() => handleItemClick(item.name)}>
                        <Image src={item.src} alt={item.alt} width={24} height={24} />
                    </div>
                ))}
            </div>
            {openItem && (
                <div onClick={handleDivClick} className="w-full flex justify-around items-center text-black mb-8">
                    <ul className="space-y-2">
                        {getOpenItemContent().map((subItem, index) => (
                            <li
                                key={index}
                                className={index === 0 ? 'pb-2 font-semibold' : ''}  // Ajout de padding en bas pour le premier élément
                            >
                                <Link
                                    href={subItem.href}
                                    className="text-blue-600 hover:underline"
                                    onClick={handleLinkClick}
                                >
                                    {subItem.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            {isSearchOpen && <Search onClose={() => setIsSearchOpen(false)} />}
        </div>
    );
}