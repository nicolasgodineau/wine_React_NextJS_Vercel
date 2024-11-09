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
        console.log('Pays Data retrieved from cache');
        return cachedData;
    }

    console.log('Pays Fetching data from Notion API');

    try {
        const response = await notion.databases.query({
            database_id: countriesDatabaseId,
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
        console.log(`Country ${id} retrieved from cache`);
        return cachedCountry;
    }

    console.log(`Fetching country ${id} from Notion API`);
    try {
        const response = await notion.pages.retrieve({ page_id: id });
        const country = {
            id: response.id,
            name: response.properties.Pays?.title[0]?.plain_text,
            flag: response.icon?.emoji,
            regions: response.properties.Régions?.relation || [],
        };

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
                console.log(`Region ${regionId} retrieved from cache`);
                return cachedRegion;
            }

            console.log(`Fetching region ${regionId} from Notion API`);
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
                console.log(`Cepage ${cepageId} retrieved from cache`);
                return cachedCepage;
            }

            console.log(`Fetching cepage ${cepageId} from Notion API`);
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

export default notion;