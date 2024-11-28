import { Client } from '@notionhq/client';
import NodeCache from 'node-cache';

const notion = new Client({ auth: process.env.NOTION_TOKEN });

export const countriesDatabaseId = process.env.NOTION_DATABASE_ID_COUNTRY;
export const regionsDatabaseId = process.env.NOTION_DATABASE_ID_AREA;
export const cepagesDatabaseId = process.env.NOTION_DATABASE_ID_CEPAGE;

const cache = new NodeCache({ 
    stdTTL: 3600,  // 1 hour cache for better performance
    checkperiod: 120,  // Check expiration every 2 minutes
    useClones: false,  // Improve performance by not cloning cached data
    deleteOnExpire: true // Automatically clean up expired items
}); 

// Helper function for batch fetching Notion pages
async function fetchNotionPages(pageIds, batchSize = 10) {
    if (!pageIds?.length) return [];
    
    const batches = [];
    for (let i = 0; i < pageIds.length; i += batchSize) {
        batches.push(pageIds.slice(i, i + batchSize));
    }

    const results = await Promise.all(
        batches.map(batch => 
            Promise.all(batch.map(id => notion.pages.retrieve({ page_id: id })))
        )
    );

    return results.flat();
}

// Helper function for database queries with retry logic
async function queryNotionDatabase(databaseId, params, maxRetries = 3) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            return await notion.databases.query({
                database_id: databaseId,
                ...params
            });
        } catch (error) {
            if (attempt === maxRetries) throw error;
            await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        }
    }
}

export async function getGrapes(type = 'all') {
    const cacheKey = `grapes_${type}`;
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
        return cachedData;
    }

    console.log(`Cépages Fetching data for ${type} from Notion API`);

    try {
        let queryParams = {
            database_id: cepagesDatabaseId,
            sorts: [
                {
                    property: 'Nom',
                    direction: 'ascending',
                },
            ],
        };

        if (type !== 'all') {
            queryParams.filter = {
                property: 'Type',
                multi_select: {
                    contains: type
                }
            };
        }

        const response = await notion.databases.query(queryParams);

        const grapes = response.results.map((page) => ({
            id: page.id,
            name: (page.properties.Nom?.title[0]?.plain_text || '').replace(/[^a-zA-ZÀ-ÿ\s]/g, '').trim(),
            type: page.properties.Type?.multi_select.map(t => t.name) || ['Inconnu'],
        }));

        cache.set(cacheKey, grapes);
        return grapes;
    } catch (error) {
        console.error('Error fetching grapes from Notion:', error);
        return [];
    }
}

export async function getGrapeById(grapeId) {
    const cacheKey = `cepage_${grapeId}`;
    const cachedData = cache.get(cacheKey);
    
    if (cachedData) {
        return cachedData;
    }

    try {
        const response = await notion.pages.retrieve({ page_id: grapeId });

        // Vérifiez si la réponse est valide
        if (!response || !response.properties) {
            console.error(`Aucune donnée trouvée pour le cépage ${grapeId}`);
            return null;
        }

        // Récupérer les IDs des pays
        const countryIds = response.properties.Pays?.relation?.map(c => c.id) || [];

        // Récupérer les détails des pays associés
        const countries = await getCountriesByIds(countryIds);

        // Trier les pays par nom (ordre alphabétique)
        countries.sort((a, b) => a.name.localeCompare(b.name));

        // Récupérer les blocs associés au cépage
        const blocks = await getBlocksByPageId(grapeId);

        const grapeData = {
            id: response.id,
            name: (response.properties.Nom?.title[0]?.plain_text || '').replace(/[^a-zA-ZÀ-ÿ\s]/g, '').trim(),
            type: response.properties.Type?.multi_select[0]?.name || 'Inconnu',
            countries, // Inclure les détails des pays ici
            blocks, // Inclure les blocs ici si nécessaire plus tard
        };

        cache.set(cacheKey, grapeData);
        return grapeData;
    } catch (error) {
        console.error(`Erreur lors de la récupération du cépage ${grapeId} :`, error);
        return null;
    }
}

export async function getCountries(continent = 'all') {
    const cacheKey = `pays_${continent}`;
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
        return cachedData;
    }

    try {
        let filter = {
            and: [
                {
                    property: 'Off_line',
                    checkbox: {
                        equals: false,
                    },
                }
            ]
        };

        if (continent !== 'all') {
            filter.and.push({
                property: 'Continent',
                select: {
                    equals: continent,
                },
            });
        }

        const response = await queryNotionDatabase(countriesDatabaseId, {
            filter,
            sorts: [{ property: 'Pays', direction: 'ascending' }],
        });

        const countries = response.results.map(page => ({
            id: page.id,
            name: page.properties.Pays?.title[0]?.plain_text,
            flag: page.icon?.emoji,
            cepages: page.properties.Cépages?.relation || [],
            regions: page.properties.Régions?.relation || [],
            continent: page.properties.Continent?.select?.name || 'Unknown',
        }));

        cache.set(cacheKey, countries);
        return countries;
    } catch (error) {
        console.error('Erreur lors de la récupération des pays:', error);
        return [];
    }
}

export async function getCompleteCountryData(countryId) {
    const cacheKey = `pays_complet_${countryId}`;
    const cachedData = cache.get(cacheKey);
    
    if (cachedData) {
        return cachedData;
    }

    try {
        // Fetch country data
        const countryResponse = await notion.pages.retrieve({ page_id: countryId });
        
        // Get all related IDs
        const regionIds = countryResponse.properties.Régions?.relation.map(r => r.id) || [];
        const countryGrapeIds = countryResponse.properties.Cépages?.relation.map(c => c.id) || [];

        // Parallel fetch for regions and their data
        const regions = await fetchNotionPages(regionIds);
        const mappedRegions = regions.map(regionResponse => ({
            id: regionResponse.id,
            name: regionResponse.properties.Région?.title[0]?.plain_text,
            grapeIds: regionResponse.properties.Cépages?.relation.map(c => c.id) || []
        }));

        // Get unique grape IDs and fetch them in parallel
        const allGrapeIds = [...new Set([...countryGrapeIds, ...mappedRegions.flatMap(r => r.grapeIds)])];
        const grapes = await fetchNotionPages(allGrapeIds);
        const mappedGrapes = grapes.map(grapeResponse => ({
            id: grapeResponse.id,
            name: (grapeResponse.properties.Nom?.title[0]?.plain_text || '')
                .replace(/[^a-zA-ZÀ-ÿ\s]/g, '').trim(),
            type: grapeResponse.properties.Type?.multi_select[0]?.name
        }));

        const result = {
            country: {
                id: countryResponse.id,
                name: countryResponse.properties.Pays?.title[0]?.plain_text,
                flag: countryResponse.icon?.emoji,
                map: countryResponse.properties.Cartes?.files[0]?.file.url || ''
            },
            regions: mappedRegions
                .sort((a, b) => a.name.localeCompare(b.name))
                .map(region => ({
                    ...region,
                    grapes: mappedGrapes
                        .filter(grape => region.grapeIds.includes(grape.id))
                        .sort((a, b) => a.name.localeCompare(b.name))
                })),
            grapes: mappedGrapes.sort((a, b) => a.name.localeCompare(b.name))
        };

        cache.set(cacheKey, result);
        return result;
    } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
        return null;
    }
}

export async function getCountriesByIds(countryIds) {
    if (!Array.isArray(countryIds) || countryIds.length === 0) {
        console.warn('Aucun ID de pays fourni.');
        return []; 
    }

    const countries = await Promise.all(countryIds.map(async (id) => {
        try {
            const response = await notion.pages.retrieve({ page_id: id });

            if (!response || !response.properties) {
                console.error(`Aucune donnée trouvée pour le pays ${id}`);
                return null; 
            }

            return {
                id: response.id,
                name: response.properties.Pays?.title[0]?.plain_text || 'Nom inconnu', 
                flag: response.icon?.emoji || '🏳️', 
                // Ajoutez d'autres propriétés si nécessaire
            };
        } catch (error) {
            console.error(`Erreur lors de la récupération du pays ${id} :`, error);
            return null; 
        }
    }));

    const validCountries = countries.filter(country => country !== null);

    validCountries.sort((a, b) => a.name.localeCompare(b.name));

    return validCountries; 
}

export async function getBlocksByPageId(pageId) {
    try {
        const response = await notion.blocks.children.list({
            block_id: pageId,
        });

        const filteredBlocks = response.results.map(block => {
            const { type } = block; 

            switch (type) {
                case 'paragraph':
                    return {
                        type,
                        paragraph: block.paragraph, 
                    };
                case 'heading_1':
                    return {
                        type,
                        heading_1: block.heading_1, 
                    };
                case 'heading_2':
                    return {
                        type,
                        heading_2: block.heading_2, 
                    };
                case 'heading_3':
                    return {
                        type,
                        heading_3: block.heading_3, 
                    };
                case 'bulleted_list_item':
                    return {
                        type,
                        bulleted_list_item: block.bulleted_list_item, 
                    };
                case 'numbered_list_item':
                    return {
                        type,
                        numbered_list_item: block.numbered_list_item, 
                    };
                case 'toggle':
                    return {
                        type,
                        toggle: block.toggle, 
                    };
                default:
                    return null; 
            }
        }).filter(block => block !== null); 

        return filteredBlocks; 
    } catch (error) {
        console.error(`Erreur lors de la récupération des blocs pour la page ${pageId} :`, error);
        return []; 
    }
}

export async function searchCountries(query = '') {
    const cacheKey = `search_${query}`;
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
        console.log(`Résultats pour "${query}" récupérés depuis le cache`);
        return cachedData;
    }

    try {
        const response = await notion.databases.query({
            database_id: countriesDatabaseId,
            filter: {
                property: 'Pays', 
                rich_text: {
                    contains: query
                }
            },
        });

        const countries = response.results.map((page) => ({
            id: page.id,
            name: page.properties.Pays?.title[0]?.plain_text || 'Inconnu',
            flag: page.icon?.emoji || '🏳️', 
            continent: page.properties.Continent?.select?.name || 'Inconnu',
            type: 'country', 
        }));

        cache.set(cacheKey, countries, 3600); 

        return countries;
    } catch (error) {
        console.error('Erreur lors de la recherche dans Notion:', error);
        throw error;
    }
}

export async function search(query) {
    const searchTerm = query.trim().toLowerCase();
    const cacheKey = `search_${searchTerm}`;
    const cachedResults = cache.get(cacheKey);

    if (cachedResults) {
        return cachedResults;
    }

    try {
        const [countriesResponse, grapesResponse] = await Promise.all([
            notion.databases.query({
                database_id: countriesDatabaseId,
                filter: {
                    and: [
                        {
                            property: 'Off_line',
                            checkbox: {
                                equals: false,
                            },
                        },
                        {
                            or: [
                                {
                                    property: 'Pays',
                                    title: {
                                        contains: searchTerm,
                                    },
                                },
                            ]
                        }
                    ]
                },
                sorts: [{ property: 'Pays', direction: 'ascending' }],
            }),
            notion.databases.query({
                database_id: cepagesDatabaseId,
                filter: {
                    or: [
                        {
                            property: 'Nom',
                            title: {
                                contains: searchTerm,
                            },
                        },
                        {
                            property: 'Type',
                            multi_select: {
                                contains: searchTerm,
                            },
                        },
                    ]
                },
                sorts: [{ property: 'Nom', direction: 'ascending' }],
            })
        ]);

        const countries = countriesResponse.results.map(page => ({
            id: page.id,
            name: page.properties.Pays?.title[0].plain_text,
            icon: page.icon.emoji,
            continent: page.properties.Continent?.select?.name || 'Unknown',
            type: 'country',
        }));

        const grapes = grapesResponse.results.map(page => ({
            id: page.id,
            name: (page.properties.Nom?.title[0]?.plain_text || '').replace(/[^a-zA-ZÀ-ÿ\s]/g, '').trim(),
            icon: page.properties.Type?.multi_select.map(t => t.name) || ['Inconnu'],
            typeResult: 'grape',
        }));

        const results = countries.length > 0 ? countries : grapes;
        cache.set(cacheKey, results, 300); 
        return results;
    } catch (error) {
        console.error('Erreur lors de la recherche:', error);
        return [];
    }
}

export default notion;