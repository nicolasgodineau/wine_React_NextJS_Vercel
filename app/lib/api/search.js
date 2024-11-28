import { notion, cache } from '../notion-client';
import { countriesDatabaseId, cepagesDatabaseId } from '../config';

export async function searchCountries(query = '') {
    if (!query) return [];

    const cacheKey = `search_pays_${query}`;
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
        return cachedData;
    }

    try {
        const response = await notion.databases.query({
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
                                    contains: query.toLowerCase(),
                                },
                            },
                        ],
                    },
                ],
            },
        });

        const results = response.results.map(page => ({
            id: page.id,
            name: page.properties.Pays?.title[0]?.plain_text,
            flag: page.icon?.emoji,
        }));

        cache.set(cacheKey, results, 300); // Cache for 5 minutes
        return results;
    } catch (error) {
        console.error('Erreur lors de la recherche des pays:', error);
        return [];
    }
}

export async function search(query) {
    if (!query) return { countries: [], grapes: [] };

    const cacheKey = `search_global_${query}`;
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
        return cachedData;
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
                                        contains: query.toLowerCase(),
                                    },
                                },
                            ],
                        },
                    ],
                },
            }),
            notion.databases.query({
                database_id: cepagesDatabaseId,
                filter: {
                    or: [
                        {
                            property: 'Nom',
                            title: {
                                contains: query.toLowerCase(),
                            },
                        },
                    ],
                },
            }),
        ]);

        const results = {
            countries: countriesResponse.results.map(page => ({
                id: page.id,
                name: page.properties.Pays?.title[0]?.plain_text,
                flag: page.icon?.emoji,
            })),
            grapes: grapesResponse.results.map(page => ({
                id: page.id,
                name: page.properties.Nom?.title[0]?.plain_text,
                type: page.properties.Type?.multi_select[0]?.name,
            })),
        };

        cache.set(cacheKey, results, 300); // Cache for 5 minutes
        return results;
    } catch (error) {
        console.error('Erreur lors de la recherche:', error);
        return { countries: [], grapes: [] };
    }
}
