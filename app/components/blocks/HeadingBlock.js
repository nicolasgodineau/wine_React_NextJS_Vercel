import React from 'react';

export function HeadingBlock({ block }) {
    const headingType = Object.keys(block).find(key => key.startsWith('heading_'));

    // Extraire le texte du titre
    const headingText = block[headingType].rich_text.map((text) => text.plain_text).join('');

    // Extraire la couleur des annotations ou utiliser la couleur par défaut du bloc
    const blockColor = block[headingType].color;

    let HeadingTag = 'h2'; // Valeur par défaut
    let styleClass = "text-2xl font-bold text-center p-2"; // Valeur par défaut
    let colorClass = '';

    // Switch pour déterminer le type de titre
    switch (headingType) {
        case 'heading_1':
            HeadingTag = 'h2';
            styleClass = "text-4xl font-bold text-center text-green pb-4";
            break;
        case 'heading_2':
            HeadingTag = 'h2';
            styleClass = "text-3xl font-semibold text-center text-orange p-3";
            break;
        case 'heading_3':
            HeadingTag = 'h3';
            styleClass = "text-2xl font-medium text-center p-2";
            break;
        default:
            HeadingTag = 'h3';
            styleClass = "text-base p-1";
            break;
    }

    // Switch pour déterminer la classe de couleur
    switch (blockColor) {
        case 'blue':
            colorClass = 'text-blue';
            break;
        case 'brown':
            colorClass = 'text-brown';
            break;
        case 'gray':
            colorClass = 'text-gray';
            break;
        case 'green':
            colorClass = 'text-green';
            break;
        case 'orange':
            colorClass = 'text-orange';
            break;
        case 'yellow':
            colorClass = 'text-yellow';
            break;
        case 'pink':
            colorClass = 'text-pink';
            break;
        case 'purple':
            colorClass = 'text-purple';
            break;
        case 'red':
            colorClass = 'text-red';
            break;
        default:
            colorClass = ''; // Aucune classe si non spécifié
            break;
    }

    return (
        <HeadingTag className={`${styleClass} ${colorClass}`}>
            {headingText}
        </HeadingTag>
    );
}