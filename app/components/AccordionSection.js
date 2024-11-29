"use client"
import React, { useState } from 'react';
import { renderBlocks } from '@utils/notionUtils.js';
import { HeadingBlock } from '@components/blocks/HeadingBlock.js';
import PlusSvg from './icons/PlusSvg.js';
import MoinSvg from './icons/MoinSvg.js';

// Composant pour rendre un bloc de contenu
const ContentBlock = ({ content }) => {
    // Vérifier si le contenu existe avant de le rendre
    if (!content || (Array.isArray(content) && content.length === 0)) {
        return null; // Ne rien rendre si le contenu est vide
    }
    return (
        <>
            {renderBlocks(content)} {/* Appeler renderBlocks avec le tableau content */}
        </>
    );
};

// Composant pour une section ou sous-section
const Section = ({ heading, content, subsections }) => {
    const [isOpen, setIsOpen] = useState(false);

    // Vérification des contenus
    const hasContent = content && (!Array.isArray(content) || content.length > 0);
    const hasSubsections = subsections && subsections.length > 0;

    // Ne rien rendre si ni le contenu ni les sous-sections n'existent
    if (!hasContent && !hasSubsections) {
        return null;
    }

    // Déterminer si cette section est une sous-section
    const isSubsection = !!subsections; // Si la section a des sous-sections, c'est une sous-section

    return (
        <div className={`${isSubsection ? 'custom_css_section px-2 my-2' : 'custom_css_subsections  p-1'} ${isOpen ? 'pb-2' : ''}`}> {/* Ajouter une classe conditionnelle */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between bg-neutral-50  w-full text-left"
            >
                <HeadingBlock block={heading} />
                <span className='shadow-sm rounded-full p-1'>{isOpen ? (
                    <MoinSvg size={20} className="fill-current text-primary" />
                ) : (
                    <PlusSvg size={20} className="fill-current text-primary" />
                )}</span>
            </button>
            {isOpen && (
                <>
                    {hasContent && <ContentBlock content={content} />}
                    {hasSubsections && (
                        <>
                            {subsections.map((subsection, index) => (
                                <Section
                                    key={subsection.heading.id || index}
                                    heading={subsection.heading}
                                    content={subsection.content}
                                    subsections={subsection.subsections}
                                />
                            ))}
                        </>
                    )}
                </>
            )}
        </div>
    );
};

// Composant principal
export default function AccordionSection({ section }) {
    return (

        <Section
            heading={section.heading}
            content={section.content}
            subsections={section.subsections}
        />

    );
};