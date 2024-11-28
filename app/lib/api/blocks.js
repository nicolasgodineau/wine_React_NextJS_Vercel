import { notion, cache } from '../notion-client';

export async function getBlocksByPageId(pageId) {
    const cacheKey = `blocks_${pageId}`;
    const cachedData = cache.get(cacheKey);
    
    if (cachedData) {
        return cachedData;
    }

    try {
        const blocks = [];
        let cursor;
        
        do {
            const response = await notion.blocks.children.list({
                block_id: pageId,
                start_cursor: cursor,
            });
            
            blocks.push(...response.results);
            cursor = response.next_cursor;
        } while (cursor);

        cache.set(cacheKey, blocks);
        return blocks;
    } catch (error) {
        console.error('Erreur lors de la récupération des blocs:', error);
        return [];
    }
}
