
import React from 'react';
import { HeadingBlock } from '@components/blocks/HeadingBlock';
import { ParagraphBlock } from '@components/blocks/ParagraphBlock';
import { BulletedListBlock } from '@components/blocks/BulletedListBlock';

export const renderBlocks = (content) => {
    return content.map((block, index) => {
        console.log('block:', block);
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