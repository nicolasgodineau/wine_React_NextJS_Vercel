import { Client } from '@notionhq/client';
import NodeCache from 'node-cache';

// Optimize cache settings
export const cache = new NodeCache({
    stdTTL: 3600,  // 1 hour cache
    checkperiod: 120,  // Check expiration every 2 minutes
    useClones: false,  // Improve performance by not cloning cached data
    deleteOnExpire: true, // Automatically clean up expired items
    maxKeys: 1000 // Limit maximum number of keys for better memory management
});

// Initialize Notion client with version
export const notion = new Client({
    auth: process.env.NOTION_TOKEN,
    notionVersion: '2022-06-28',
});

// Helper function for cached data fetching
export const getCachedData = async (key, fetchFn) => {
    const cachedData = cache.get(key);
    if (cachedData) return cachedData;

    try {
        const data = await fetchFn();
        if (data) {
            cache.set(key, data);
        }
        return data;
    } catch (error) {
        console.error(`Erreur lors de la récupération des données pour ${key}:`, error);
        return null;
    }
};
