'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function ImageModal({ src, alt }) {
    const [isModalOpen, setIsModalOpen] = useState(false);  // État pour la modal

    // Ouvre la modal
    const openModal = () => setIsModalOpen(true);

    // Ferme la modal
    const closeModal = () => setIsModalOpen(false);

    // Ferme la modal si on clique en dehors de l'image ou sur l'image elle-même
    const handleClickOutside = (e) => {
        if (e.target === e.currentTarget || e.target === e.currentTarget.querySelector('img')) {
            closeModal();
        }
    };

    // Si la modal n'est pas ouverte, rien n'est affiché
    if (!isModalOpen) return (
        <div onClick={openModal} className="cursor-pointer">
            <Image
                src={src}
                alt={alt}
                width={500}
                height={500}
            />
        </div>
    );

    // Affichage de la modal avec gestion du clic en dehors ou sur l'image
    return (
        <div
            className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 backdrop-blur-md  flex justify-center items-center"
            onClick={handleClickOutside} // Clic pour fermer la modal si on clique en dehors ou sur l'image
        >
            <div className="relative w-full max-w-3xl p-4">
                <Image
                    src={src}
                    alt={alt}
                    width={800}
                    height={800}
                />
            </div>
        </div>
    );
}
