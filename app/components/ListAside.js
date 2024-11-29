"use client";
import React from 'react';
import Link from 'next/link';
import RippleButton from '@components/RippleButton';
import GrappeRedSvg from '@components/icons/GrappeRedSvg.js';
import GrappeWhiteSvg from '@components/icons/GrappeWhiteSvg.js';

export default function ListAside({ title, data, isCountryData }) {
    return (
        <>
            {/* Affichage du titre (h2) passé en props */}
            <h2 className="text-h3 font-semibold text-secondaryLight text-left pl-2 pt-2">{title}</h2>

            {/* Vérification de la structure des données pour déterminer si c'est des pays ou des cépages */}
            {data && data.length > 0 && (
                <ul className="w-full flex flex-col gap-2 py-2 text-paragraph">
                    {data.map((item) => (
                        <li key={item.id} className='flex items-center  px-1'>
                            <Link className="w-full " href={isCountryData ? `/pays/${item.id}` : `/cepages/${item.id}`}>
                                <RippleButton className="w-full flex items-center gap-2 px-3 rounded-xl" effectWidth={100} effectHeight={100}>
                                    {isCountryData ? (
                                        <>
                                            <span className="text-3xl">{item.flag}</span>
                                            {item.name}
                                        </>
                                    ) : (
                                        <>
                                            {item.type.toLowerCase() === 'rouge' ? (
                                                <GrappeRedSvg className="inline-block mr-2" width={30} height={30} />
                                            ) : (
                                                <GrappeWhiteSvg className="inline-block mr-2" width={30} height={30} />
                                            )}
                                            {item.name}
                                        </>
                                    )}
                                </RippleButton>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </>
    );
}
