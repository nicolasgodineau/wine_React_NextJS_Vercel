"use client"
import React, { useState } from 'react';
import { renderBlocks } from '@utils/renderBlocks';
import { HeadingBlock } from '@components/blocks/HeadingBlock.js';
import { ParagraphBlock } from '@components/blocks/ParagraphBlock.js';
import { BulletedListBlock } from '@components/blocks/BulletedListBlock.js'; // Assurez-vous d'importer ce composant

// Composant pour rendre un bloc de contenu
const ContentBlock = ({ content }) => {
    // Vérifier si le contenu existe avant de le rendre
    if (!content || (Array.isArray(content) && content.length === 0)) {
        return null; // Ne rien rendre si le contenu est vide
    }
    return (
        <div>
            {renderBlocks(content)} {/* Appeler renderBlocks avec le tableau content */}
        </div>
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
        <div className={` ${isSubsection ? 'section' : 'subsections'}`}> {/* Ajouter une classe conditionnelle */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full text-left"
            >
                <HeadingBlock block={heading} />
            </button>
            {isOpen && (
                <div className="content">
                    {hasContent && <ContentBlock content={content} />}
                    {hasSubsections && (
                        <div>
                            {subsections.map((subsection, index) => (
                                <Section
                                    key={subsection.heading.id || index}
                                    heading={subsection.heading}
                                    content={subsection.content}
                                    subsections={subsection.subsections}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

// Composant principal
export default function AccordionSection({ section }) {
    return (
        <div>
            <Section
                heading={section.heading}
                content={section.content}
                subsections={section.subsections}
            />
        </div>
    );
};