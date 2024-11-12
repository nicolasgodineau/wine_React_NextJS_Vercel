"use client"
import React from 'react';

export function ParagraphBlock({ block }) {
    const paragraphText = block.paragraph.rich_text;

    return (
        <p className={`text-${block.color}`}>
            {paragraphText.map((text, index) => {
                const { annotations } = text;

                // Appliquer les styles en fonction des annotations
                const style = {
                    fontWeight: annotations.bold ? 'bold' : 'normal',
                    fontStyle: annotations.italic ? 'italic' : 'normal',
                    textDecoration: annotations.strikethrough ? 'line-through' : 'none',
                    textDecorationLine: annotations.underline ? 'underline' : 'none',
                    color: annotations.color !== 'default' ? annotations.color : undefined,
                };

                return (
                    <span key={index} style={style}>
                        {text.text.content}
                        {/* Si le texte contient un saut de ligne, ajouter un <br /> */}
                        {index < paragraphText.length - 1 && <br />}
                    </span>
                );
            })}
        </p>
    );
}