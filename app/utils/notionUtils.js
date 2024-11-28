import { HeadingBlock } from '@components/blocks/HeadingBlock';
import { ParagraphBlock } from '@components/blocks/ParagraphBlock';
import { BulletedListBlock } from '@components/blocks/BulletedListBlock';

const BLOCK_TYPES = {
    HEADING_1: 'heading_1',
    HEADING_2: 'heading_2'
};

const COLOR_MAPPING = {
    blue: 'text-blue',
    brown: 'text-brown',
    gray: 'text-gray',
    green: 'text-green',
    orange: 'text-orange',
    yellow: 'text-yellow',
    pink: 'text-pink',
    purple: 'text-purple',
    red: 'text-red'
};

export function groupSections(blocks) {
    if (!Array.isArray(blocks)) {
        console.warn('groupSections: blocks doit être un tableau');
        return [];
    }

    const sections = [];
    let currentSection = null;
    let currentSubsection = null;

    const finalizeSubsection = () => {
        if (currentSubsection && currentSection) {
            currentSection.subsections.push(currentSubsection);
            currentSubsection = null;
        }
    };

    const finalizeSection = () => {
        if (currentSection) {
            finalizeSubsection();
            sections.push(currentSection);
            currentSection = null;
        }
    };

    blocks.forEach(block => {
        if (!block || typeof block !== 'object') {
            console.warn('Block invalide détecté, ignoré');
            return;
        }

        switch (block.type) {
            case BLOCK_TYPES.HEADING_1:
                finalizeSection();
                currentSection = {
                    heading: block,
                    content: [],
                    subsections: []
                };
                break;

            case BLOCK_TYPES.HEADING_2:
                if (currentSection) {
                    finalizeSubsection();
                    currentSubsection = {
                        heading: block,
                        content: []
                    };
                }
                break;

            default:
                if (currentSubsection) {
                    currentSubsection.content.push(block);
                } else if (currentSection) {
                    currentSection.content.push(block);
                }
        }
    });

    finalizeSection();
    return sections;
}

export function getTextStyle(annotations = {}) {
    if (typeof annotations !== 'object') {
        console.warn('getTextStyle: annotations doit être un objet');
        return {};
    }

    const {
        bold = false,
        italic = false,
        strikethrough = false,
        underline = false,
        color = 'default'
    } = annotations;

    return {
        fontWeight: bold ? 'bold' : 'normal',
        fontStyle: italic ? 'italic' : 'normal',
        textDecoration: strikethrough ? 'line-through' : underline ? 'underline' : 'none',
        color: color !== 'default' ? color : undefined,
    };
}

export function getColorClass(blockColor) {
    if (typeof blockColor !== 'string') {
        console.warn('getColorClass: blockColor doit être une chaîne de caractères');
        return '';
    }

    return COLOR_MAPPING[blockColor] || '';
}

export function renderBlocks(content) {
    if (!Array.isArray(content)) {
        console.warn('renderBlocks: content doit être un tableau');
        return null;
    }

    return content.map((block, index) => {
        if (!block || !block.type) {
            console.warn(`Block invalide à l'index ${index}, ignoré`);
            return null;
        }

        const key = block.id || index;

        switch (block.type) {
            case 'heading_1':
            case 'heading_2':
            case 'heading_3':
                return <HeadingBlock key={key} block={block} />;
            case 'paragraph':
                return <ParagraphBlock key={key} block={block} />;
            case 'bulleted_list_item':
                return <BulletedListBlock key={key} block={block} />;
            default:
                console.warn(`Type de block non géré: ${block.type}`);
                return null;
        }
    }).filter(Boolean);
}