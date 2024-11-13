
export function groupSections(blocks) {
    const sections = [];
    let currentSection = null;
    let currentSubsection = null;

    blocks.forEach(block => {
        if (block.type === "heading_1") {
            // Si un heading_1 est trouvé, termine la section en cours et commence une nouvelle
            if (currentSection) {
                sections.push(currentSection);
            }

            // Initialise une nouvelle section avec le heading_1 et les structures pour le contenu et les sous-sections
            currentSection = {
                heading: block,
                content: [],
                subsections: []
            };
            currentSubsection = null;  // Réinitialise la sous-section pour chaque nouvelle section

        } else if (block.type === "heading_2" && currentSection) {
            // Si un heading_2 est trouvé, termine la sous-section en cours et commence une nouvelle sous-section
            if (currentSubsection) {
                currentSection.subsections.push(currentSubsection);
            }

            // Initialise une nouvelle sous-section avec le heading_2 et un contenu vide
            currentSubsection = {
                heading: block,
                content: []
            };

        } else if (currentSubsection) {
            // Si une sous-section est active, ajoute le bloc dans le contenu de cette sous-section
            currentSubsection.content.push(block);

        } else if (currentSection) {
            // Si aucun heading_2 n'est actif, ajoute le bloc directement au contenu de la section principale
            currentSection.content.push(block);
        }
    });

    // Ajoute la dernière sous-section et section si elles existent
    if (currentSubsection && currentSection) {
        currentSection.subsections.push(currentSubsection);
    }
    if (currentSection) {
        sections.push(currentSection);
    }

    return sections;
}

export function getTextStyle(annotations) {
    return {
        fontWeight: annotations.bold ? 'bold' : 'normal',
        fontStyle: annotations.italic ? 'italic' : 'normal',
        textDecoration: annotations.strikethrough ? 'line-through' : annotations.underline ? 'underline' : 'none',
        color: annotations.color !== 'default' ? annotations.color : undefined,
    };
}

export function getColorClass(blockColor) {
    let colorClass = ''; // Valeur par défaut

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

    return colorClass;
}

import { HeadingBlock } from '@components/blocks/HeadingBlock';
import { ParagraphBlock } from '@components/blocks/ParagraphBlock';
import { BulletedListBlock } from '@components/blocks/BulletedListBlock';

export const renderBlocks = (content) => {
    // Extraire les listes à puces
    return content.map((block, index) => {
        switch (block.type) {
            case 'heading_2':
            case 'heading_3':
                return <HeadingBlock key={block.id || index} block={block} />;
            case 'paragraph':
                return <ParagraphBlock key={block.id || index} block={block} />;
            case 'bulleted_list_item':
                return <BulletedListBlock key={block.id || index} block={block} />;
            // Ajoutez d'autres cas pour d'autres types de blocs
            default:
                return null; // Ou un composant par défaut
        }
    });

};