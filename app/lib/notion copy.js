import { Client } from '@notionhq/client';
import NodeCache from 'node-cache';

const notion = new Client({ auth: process.env.NOTION_TOKEN });

export const countriesDatabaseId = process.env.NOTION_DATABASE_ID_COUNTRY;
export const regionsDatabaseId = process.env.NOTION_REGIONS_DATABASE_ID;
export const cepagesDatabaseId = process.env.NOTION_CEPAGES_DATABASE_ID;


const cache = new NodeCache({ stdTTL: 600 }); // Cache valide pendant 10 minutes

export async function getCountries() {
    const cacheKey = 'countries';
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
        //console.log('Pays Data retrieved from cache');
        return cachedData;
    }

    //console.log('Pays Fetching data from Notion API');

    try {
        const response = await notion.databases.query({
            database_id: countriesDatabaseId,
            filter: {
                property: 'Off_line',
                checkbox: {
                    equals: false, // Filtrer pour ceux qui ne sont pas cochés
                },
            },
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
            iso: page.properties.ISO.rich_text[0]?.plain_text?.toLowerCase() || "",
            cepages: page.properties.Cépages?.relation || [],
            regions: page.properties.Régions?.relation || [],
        }));

        // Stockez les données dans le cache
        cache.set(cacheKey, countries);

        return countries;
    } catch (error) {
        console.error('Error fetching countries from Notion:', error);
        return [];
    }
}

export async function getCountryById(id) {
    const cacheKey = `country_${id}`;
    const cachedCountry = cache.get(cacheKey);

    if (cachedCountry) {
        //console.log(`Country ${id} retrieved from cache`);
        return cachedCountry;
    }

    //console.log(`Fetching country ${id} from Notion API`);
    try {
        const response = await notion.pages.retrieve({ page_id: id });
        const country = {
            id: response.id,
            name: response.properties.Pays?.title[0]?.plain_text,
            flag: response.icon?.emoji,
            regions: response.properties.Régions?.relation || [],
            cepages: response.properties.Cépages?.relation || [],
        };

        console.log('response:', country)
        cache.set(cacheKey, country);
        return country;
    } catch (error) {
        console.error(`Error fetching country ${id} from Notion:`, error);
        return null;
    }
}


export async function getRegions(regionIds) {
    try {
        const regions = await Promise.all(regionIds.map(async (regionId) => {
            const cacheKey = `region_${regionId}`;
            const cachedRegion = cache.get(cacheKey);

            if (cachedRegion) {
                //console.log(`Region ${regionId} retrieved from cache`);
                return cachedRegion;
            }

            //console.log(`Fetching region ${regionId} from Notion API`);
            const response = await notion.pages.retrieve({ page_id: regionId });
            const region = {
                id: response.id,
                name: response.properties.Région?.title[0].plain_text,
                cepages: response.properties.Cépages?.relation || [],
            };

            cache.set(cacheKey, region);
            return region;
        }));

        // Tri des régions par nom
        const sortedRegions = regions.sort((a, b) =>
            a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
        );

        return sortedRegions;
    } catch (error) {
        console.error('Error fetching regions from Notion:', error);
        return [];
    }
}

export async function getCepages(cepageIds) {
    try {
        const cepages = await Promise.all(cepageIds.map(async (cepageId) => {
            const cacheKey = `cepage_${cepageId}`;
            const cachedCepage = cache.get(cacheKey);

            if (cachedCepage) {
                //console.log(`Cepage ${cepageId} retrieved from cache`);
                return cachedCepage;
            }

            //console.log(`Fetching cepage ${cepageId} from Notion API`);
            const response = await notion.pages.retrieve({ page_id: cepageId });
            const cepage = {
                id: response.id,
                name: (response.properties.Nom?.title[0]?.plain_text || '')
                    .replace(/[^a-zA-ZÀ-ÿ\s]/g, '')  // Supprime tous les caractères non-alphabétiques
                    .trim(),  // Supprime les espaces au début et à la fin
                type: response.properties.Type.multi_select[0].name,
            };

            cache.set(cacheKey, cepage);
            return cepage;
        }));

        // Tri des cépages par nom
        const sortedCepages = cepages.sort((a, b) =>
            a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
        );

        return sortedCepages;
    } catch (error) {
        console.error('Error fetching cepages from Notion:', error);
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
                flag: countryResponse.icon?.emoji
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

        return {
            id: response.id,
            name: (response.properties.Nom?.title[0]?.plain_text || '').replace(/[^a-zA-ZÀ-ÿ\s]/g, '').trim(),
            type: response.properties.Type?.multi_select[0]?.name || 'Inconnu',
            countries, // Inclure les détails des pays ici
        };
    } catch (error) {
        console.error(`Erreur lors de la récupération du cépage ${grapeId} :`, error);
        return null;
    }
}

export async function getGrapes() {
    const cacheKey = 'grapes';
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
        // console.log('Cépages Data retrieved from cache');
        return cachedData;
    }

    console.log('Cépages Fetching data from Notion API');

    try {
        const response = await notion.databases.query({
            database_id: cepagesDatabaseId,

            sorts: [
                {
                    property: 'Nom', // Assurez-vous que c'est le bon nom de propriété pour trier par nom
                    direction: 'ascending',
                },
            ],
        });

        const grapes = await Promise.all(response.results.map(async (page) => {
            const countryIds = page.properties.Pays?.relation.map(c => c.id) || [];

            // Récupérer les pays associés
            const countries = await getCountriesByIds(countryIds);
            console.log('countries:', countries)

            return {
                id: page.id,
                name: page.properties.Nom?.title[0]?.plain_text,
                type: page.properties.Type?.multi_select[0]?.name || 'Inconnu', // Type du cépage
                countries, // Ajoutez les pays associés ici
            };
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
    return countries.filter(country => country !== null);
}


export default notion;