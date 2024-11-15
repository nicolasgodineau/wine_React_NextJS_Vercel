"use client"
import { useState } from 'react';
import Image from "next/image.js";

import loupe from "@icons/loupe.png"
import planete from "@icons/planete.png"
import grappe from "@icons/grappe.png"
import Link from "next/link.js";

import Search from "@components/Search.js";

export default function Menu({ isSearchOpen, setIsSearchOpen }) {
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

    return (
        <div className={`w-full flex  justify-around items-center ${isSearchOpen ? 'flex-col-reverse' : 'flex-row '}  `}>
            <div className='w-full flex justify-around items-center'>
                {menuItems.map((item) => (
                    <div key={item.name} className={`dropdown  ${item.dropdownClass || ''}`}>
                        <div tabIndex={0} role="button" onClick={item.onClick} className=" border-none bg-transparent">
                            <div className="w-6 h-6 bg-transparent">
                                <Image
                                    src={item.src}
                                    alt={item.alt}
                                />
                            </div>
                            {/*                         {item.items.length > 0 && <span className="ml-2">{item.title}</span>}
 */}                    </div>
                        {item.items.length > 0 && (
                            <ul tabIndex={0} className="dropdown-content menu mb-4 p-2 shadow bg-base-100 rounded-box w-52 ">
                                {item.items.map((subItem, index) => (
                                    <li key={index}>
                                        <Link href={subItem.href} className="text-blue-600 hover:underline">
                                            {subItem.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                ))}
            </div>
            {isSearchOpen && <Search onClose={() => setIsSearchOpen(false)} />}
        </div>
    );
}