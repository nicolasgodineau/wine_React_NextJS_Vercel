import { getColorClass } from '@app/utils/notionUtils.js';
import React from 'react';

export function HeadingBlock({ block }) {
    const headingType = Object.keys(block).find(key => key.startsWith('heading_'));

    // Extraire le texte du titre
    const headingText = block[headingType].rich_text.map((text) => text.plain_text).join('');

    // Extraire la couleur des annotations ou utiliser la couleur par défaut du bloc
    const blockColor = block[headingType].rich_text[0].annotations.color;

    // Switch pour déterminer le type de titre
    let HeadingTag = 'h2'; // Valeur par défaut
    let styleClass = "text-2xl font-bold text-center p-2"; // Valeur par défaut

    switch (headingType) {
        case 'heading_1':
            HeadingTag = 'h2';
            styleClass = "text-4xl font-bold text-left text-green pb-2";
            break;
        case 'heading_2':
            HeadingTag = 'h3';
            styleClass = "text-3xl font-semibold p-3";
            break;
        case 'heading_3':
            HeadingTag = 'h4';
            styleClass = "text-2xl font-medium p-2";
            break;
        default:
            HeadingTag = 'h4';
            styleClass = "text-base p-1";
            break;
    }

    // Pour déterminer la classe de couleur
    let colorClass = getColorClass(blockColor)



    return (
        <HeadingTag className={`${styleClass} ${colorClass}`}>
            {headingText}
        </HeadingTag>
    );
}