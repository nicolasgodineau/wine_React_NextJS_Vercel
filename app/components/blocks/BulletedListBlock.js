import React from 'react';
import { getColorClass, getTextStyle } from '@app/utils/notionUtils.js';

export function BulletedListBlock({ block }) {

    const listItemText = block.bulleted_list_item.rich_text.map((text) => text.plain_text).join('');

    return (
        <ul className="list-disc pl-5">
            <li>
                <p className="text-base">{listItemText}</p>
            </li>
        </ul>
    );
}