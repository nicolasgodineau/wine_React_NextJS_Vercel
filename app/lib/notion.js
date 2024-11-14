import { Client } from '@notionhq/client';
import NodeCache from 'node-cache';



const notion = new Client({ auth: process.env.NOTION_TOKEN });

export const countriesDatabaseId = process.env.NOTION_DATABASE_ID_COUNTRY;
export const regionsDatabaseId = process.env.NOTION_DATABASE_ID_AREA;
export const cepagesDatabaseId = process.env.NOTION_DATABASE_ID_CEPAGE;


const cache = new NodeCache({ stdTTL: 600 }); // Cache valide pendant 10 minutes

export async function getCountries(continent = 'all') {
    const cacheKey = `countries_${continent}`;
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
        //console.log(`Pays Data for ${continent} retrieved from cache`);
        return cachedData;
    }

    //console.log(`Pays Fetching data for ${continent} from Notion API`);

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

        // Ajouter le filtre de continent si ce n'est pas 'all'
        if (continent !== 'all') {
            filter.and.push({
                property: 'Continent',
                select: {
                    equals: continent,
                },
            });
        }

        const response = await notion.databases.query({
            database_id: countriesDatabaseId,
            filter: filter,
            sorts: [
                {
                    property: 'Pays',
                    direction: 'ascending',
                },
            ],
        });

        const countries = response.results.map(page => ({
            id: page.id,
            name: page.properties.Pays?.title[0].plain_text,
            flag: page.icon.emoji,
            cepages: page.properties.Cépages?.relation || [],
            regions: page.properties.Régions?.relation || [],
            continent: page.properties.Continent?.select?.name || 'Unknown',
        }));

        // Stockez les données dans le cache
        cache.set(cacheKey, countries);

        return countries;
    } catch (error) {
        console.error('Error fetching countries from Notion:', error);
        return [];
    }
}

export async function getCompleteCountryData(countryId) {
    try {
        // 1. Récupérer les informations du pays
        const countryResponse = await notion.pages.retrieve({ page_id: countryId });

        // 2. Extraire les IDs des régions et des cépages liés au pays
        const regionIds = countryResponse.properties.Régions?.relation.map(r => r.id) || [];
        const countryGrapeIds = countryResponse.properties.Cépages?.relation.map(c => c.id) || [];

        // 3. Récupérer les informations des régions (incluant leurs cépages)
        const regionsPromises = regionIds.map(regionId =>
            notion.pages.retrieve({ page_id: regionId })
                .then(regionResponse => ({
                    id: regionResponse.id,
                    name: regionResponse.properties.Région?.title[0]?.plain_text,
                    grapeIds: regionResponse.properties.Cépages?.relation.map(c => c.id) || []
                }))
        );

        // 4. Récupérer tous les cépages uniques (du pays et des régions)
        const regions = await Promise.all(regionsPromises);
        const allGrapeIds = [...new Set([...countryGrapeIds, ...regions.flatMap(r => r.grapeIds)])];

        const grapesPromises = allGrapeIds.map(grapeId =>
            notion.pages.retrieve({ page_id: grapeId })
                .then(grapeResponse => ({
                    id: grapeResponse.id,
                    name: (grapeResponse.properties.Nom?.title[0]?.plain_text || '')
                        .replace(/[^a-zA-ZÀ-ÿ\s]/g, '').trim(),
                    type: grapeResponse.properties.Type?.multi_select[0]?.name
                }))
        );

        // 5. Assembler toutes les données
        const grapes = await Promise.all(grapesPromises);

        return {
            country: {
                id: countryResponse.id,
                name: countryResponse.properties.Pays?.title[0]?.plain_text,
                flag: countryResponse.icon?.emoji,
                map: countryResponse.properties.Cartes?.files[0]?.file.url || ''
            },
            regions: regions.sort((a, b) => a.name.localeCompare(b.name)).map(region => ({
                ...region,
                grapes: grapes.filter(grape => region.grapeIds.includes(grape.id)).sort((a, b) => a.name.localeCompare(b.name))
            })),
            grapes: grapes.sort((a, b) => a.name.localeCompare(b.name))
        };
    } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
        return null;
    }
}

// Fonction pour récupérer un cépage par son ID
export async function getGrapeById(grapeId) {
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

        return {
            id: response.id,
            name: (response.properties.Nom?.title[0]?.plain_text || '').replace(/[^a-zA-ZÀ-ÿ\s]/g, '').trim(),
            type: response.properties.Type?.multi_select[0]?.name || 'Inconnu',
            countries, // Inclure les détails des pays ici
            blocks, // Inclure les blocs ici si nécessaire plus tard
        };
    } catch (error) {
        console.error(`Erreur lors de la récupération du cépage ${grapeId} :`, error);
        return null;
    }
}

// Fonction pour récupérer les cépageS
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

        // Ajouter le filtre de type si ce n'est pas 'all'
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

        // Stockez les données dans le cache
        cache.set(cacheKey, grapes);

        return grapes;
    } catch (error) {
        console.error('Error fetching grapes from Notion:', error);
        return [];
    }
}

// Fonction pour récupérer les pays par leurs IDs
export async function getCountriesByIds(countryIds) {
    if (!Array.isArray(countryIds) || countryIds.length === 0) {
        console.warn('Aucun ID de pays fourni.');
        return []; // Retourner un tableau vide si aucun ID n'est fourni
    }

    const countries = await Promise.all(countryIds.map(async (id) => {
        try {
            const response = await notion.pages.retrieve({ page_id: id });

            // Vérifiez si la réponse est valide
            if (!response || !response.properties) {
                console.error(`Aucune donnée trouvée pour le pays ${id}`);
                return null; // Retourner null si aucune donnée n'est trouvée
            }

            return {
                id: response.id,
                name: response.properties.Pays?.title[0]?.plain_text || 'Nom inconnu', // Valeur par défaut
                flag: response.icon?.emoji || '🏳️', // Valeur par défaut pour le drapeau
                // Ajoutez d'autres propriétés si nécessaire
            };
        } catch (error) {
            console.error(`Erreur lors de la récupération du pays ${id} :`, error);
            return null; // Retourner null en cas d'erreur
        }
    }));

    // Filtrer les résultats pour enlever les valeurs nulles
    const validCountries = countries.filter(country => country !== null);

    // Trier les pays par nom (ordre alphabétique)
    validCountries.sort((a, b) => a.name.localeCompare(b.name));

    return validCountries; // Retourner le tableau trié
}

export async function getBlocksByPageId(pageId) {
    try {
        const response = await notion.blocks.children.list({
            block_id: pageId,
        });

        // Filtrer et transformer les blocs selon le type
        const filteredBlocks = response.results.map(block => {
            const { type } = block; // Récupérer le type du bloc

            // Garder uniquement les propriétés pertinentes selon le type
            switch (type) {
                case 'paragraph':
                    return {
                        type,
                        paragraph: block.paragraph, // Garde l'élément "paragraph"
                    };
                case 'heading_1':
                    return {
                        type,
                        heading_1: block.heading_1, // Garde l'élément "heading_1"
                    };
                case 'heading_2':
                    return {
                        type,
                        heading_2: block.heading_2, // Garde l'élément "heading_2"
                    };
                case 'heading_3':
                    return {
                        type,
                        heading_3: block.heading_3, // Garde l'élément "heading_3"
                    };
                case 'bulleted_list_item':
                    return {
                        type,
                        bulleted_list_item: block.bulleted_list_item, // Garde l'élément "bulleted_list_item"
                    };
                case 'numbered_list_item':
                    return {
                        type,
                        numbered_list_item: block.numbered_list_item, // Garde l'élément "numbered_list_item"
                    };
                case 'toggle':
                    return {
                        type,
                        toggle: block.toggle, // Garde l'élément "toggle"
                    };
                default:
                    return null; // Ignorer d'autres types de blocs
            }
        }).filter(block => block !== null); // Filtrer les blocs nulls

        return filteredBlocks; // Retourner les blocs filtrés
    } catch (error) {
        console.error(`Erreur lors de la récupération des blocs pour la page ${pageId} :`, error);
        return []; // Retourner un tableau vide en cas d'erreur
    }
}

export async function searchCountries(searchTerm) {
    if (!searchTerm) {
        return [];
    }

    const cacheKey = `search_countries_${searchTerm}`;
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
        console.log(`Search results for "${searchTerm}" retrieved from cache`);
        return cachedData;
    }

    console.log(`Searching countries for "${searchTerm}" in Notion API`);

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
                                    contains: searchTerm.toLowerCase(),
                                },
                            },
                        ]
                    }
                ]
            },
            sorts: [
                {
                    property: 'Pays',
                    direction: 'ascending',
                },
            ],
        });

        const searchResults = response.results.map(page => ({
            id: page.id,
            name: page.properties.Pays?.title[0].plain_text,
            flag: page.icon.emoji,
            continent: page.properties.Continent?.select?.name || 'Unknown',
            // Ajoutez d'autres propriétés si nécessaire
        }));

        // Stockez les résultats dans le cache
        cache.set(cacheKey, searchResults);

        return searchResults;
    } catch (error) {
        console.error('Error searching countries in Notion:', error);
        return [];
    }
}

export async function search(searchTerm) {
    if (!searchTerm) {
        return []; // Retourne un tableau vide si aucun terme n'est fourni
    }

    const cacheKey = `search_results_${searchTerm}`;
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
        console.log(`Search results for "${searchTerm}" retrieved from cache`);
        return cachedData;
    }

    console.log(`Searching for "${searchTerm}" in Notion API`);

    try {
        // Recherche dans la base de données des pays
        const countriesResponse = await notion.databases.query({
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
                                    contains: searchTerm.toLowerCase(),
                                },
                            },
                        ]
                    }
                ]
            },
            sorts: [
                {
                    property: 'Pays',
                    direction: 'ascending',
                },
            ],
        });

        const countries = countriesResponse.results.map(page => ({
            id: page.id,
            name: page.properties.Pays?.title[0].plain_text,
            flag: page.icon.emoji,
            continent: page.properties.Continent?.select?.name || 'Unknown',
            type: 'country', // Ajout d'un type pour identifier le résultat
        }));

        // Si aucun pays n'est trouvé, rechercher dans les cépages
        let results = [];
        if (countries.length > 0) {
            results = countries; // Si des pays sont trouvés, utilisez-les
        } else {
            const grapesResponse = await notion.databases.query({
                database_id: cepagesDatabaseId,
                filter: {
                    or: [
                        {
                            property: 'Nom',
                            title: {
                                contains: searchTerm.toLowerCase(),
                            },
                        },
                        {
                            property: 'Type',
                            multi_select: {
                                contains: searchTerm.toLowerCase(),
                            },
                        },
                    ]
                },
                sorts: [
                    {
                        property: 'Nom',
                        direction: 'ascending',
                    },
                ],
            });

            results = grapesResponse.results.map(page => ({
                id: page.id,
                name: page.properties.Nom?.title[0].plain_text,
                type: page.properties.Type?.multi_select.map(t => t.name) || ['Inconnu'],
                typeResult: 'grape', // Ajout d'un type pour identifier le résultat
            }));
        }

        // Stockez les résultats dans le cache
        cache.set(cacheKey, results);

        return results; // Retourne un seul tableau de résultats
    } catch (error) {
        console.error('Error searching in Notion:', error);
        return []; // Retourne un tableau vide en cas d'erreur
    }
}


export default notion;