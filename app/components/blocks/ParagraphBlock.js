"use client"
import React from 'react';
import { getColorClass, getTextStyle } from '@app/utils/notionUtils.js';

export function ParagraphBlock({ block }) {
    const paragraphText = block.paragraph.rich_text;

    return (
        <>
            {paragraphText.map((text, index) => {
                const { annotations } = text;

                const styleClass = getTextStyle(annotations);
                const colorClass = getColorClass(styleClass.color)

                // Diviser le texte par les sauts de ligne
                const textSegments = text.text.content.split('\n');

                return (
                    <React.Fragment key={index}>
                        {/* Crée un <p> pour chaque segment */}
                        {textSegments.map((segment, segmentIndex) => (
                            <p
                                key={segmentIndex}
                            >
                                {segment}
                            </p>
                        ))}
                    </React.Fragment>
                );
            })}
        </>
    );
}

