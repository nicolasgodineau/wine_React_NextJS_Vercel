"use client"
import React from 'react';
export function ParagraphBlock({ block }) {
    const paragraphText = block.paragraph.rich_text.map((text) => text.plain_text).join('');
    const lines = paragraphText.split('\n');

    return (
        <p className="">
            {lines.map((line, index) => (
                <React.Fragment key={index}>
                    {line}
                    {index < lines.length - 1 && <br />}
                </React.Fragment>
            ))}
        </p>
    );
}