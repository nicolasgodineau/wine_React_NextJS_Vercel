"use client"
import React, { useRef, useEffect, useState } from 'react';
import Image from "next/image.js";

import loupe from "@icons/loupe.png"
import planete from "@icons/planete.png"
import grappe from "@icons/grappe.png"
import Link from "next/link.js";

import Search from "@components/Search.js";

export default function Menu({ isSearchOpen, setIsSearchOpen }) {
    const dropdownRefs = useRef({});
    const [openDropdown, setOpenDropdown] = useState(null);
    const menuItems = [
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
            items: [],  // Pas de dropdown pour la recherche
            onClick: () => setIsSearchOpen(!isSearchOpen),
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
    ];

    useEffect(() => {
        function handleClickOutside(event) {
            if (openDropdown && !dropdownRefs.current[openDropdown].contains(event.target)) {
                dropdownRefs.current[openDropdown].removeAttribute('open');
                setOpenDropdown(null);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [openDropdown]);

    return (
        <div className={`w-full flex  justify-around items-center ${isSearchOpen ? 'flex-col-reverse' : 'flex-row '}  `}>
            <div className='w-full flex justify-around items-center'>
                {menuItems.map((item) => (
                    <details
                        key={item.name}
                        className={`dropdown ${item.dropdownClass || ''}`}
                        ref={el => dropdownRefs.current[item.name] = el}
                        onToggle={(e) => {
                            if (e.target.open) {
                                setOpenDropdown(item.name);
                            } else {
                                setOpenDropdown(null);
                            }
                        }}
                    >
                        <summary
                            role="button"
                            onClick={(e) => {
                                if (item.onClick) {
                                    e.preventDefault();
                                    item.onClick();
                                }
                            }}
                            className="btn border-none bg-transparent"
                        >
                            <div className="w-6 h-6 bg-transparent">
                                <Image
                                    src={item.src}
                                    alt={item.alt}
                                />
                            </div>
                        </summary>
                        {item.items.length > 0 && (
                            <ul tabIndex={0} className="dropdown-content menu mb-4 p-2 shadow bg-base-100 rounded-box w-52">
                                {item.items.map((subItem, index) => (
                                    <li key={index}>
                                        <Link href={subItem.href} className="text-blue-600 hover:underline">
                                            {subItem.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </details>
                ))}
            </div>
            {isSearchOpen && <Search onClose={() => setIsSearchOpen(false)} />}
        </div>
    );
}