import { notion, cache } from '../notion-client';
import { countriesDatabaseId } from '../config';

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

        const response = await notion.databases.query({
            database_id: countriesDatabaseId,
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

export async function getCountriesByIds(countryIds) {
    if (!Array.isArray(countryIds) || countryIds.length === 0) {
        console.warn('Aucun ID de pays fourni.');
        return [];
    }

    const cacheKey = `pays_ids_${countryIds.sort().join('_')}`;
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
        return cachedData;
    }

    try {
        const countries = await Promise.all(
            countryIds.map(async (id) => {
                const response = await notion.pages.retrieve({ page_id: id });
                return {
                    id: response.id,
                    name: response.properties.Pays?.title[0]?.plain_text,
                    flag: response.icon?.emoji,
                };
            })
        );

        const validCountries = countries.filter(country => country.name);
        cache.set(cacheKey, validCountries);
        return validCountries;
    } catch (error) {
        console.error('Erreur lors de la récupération des pays par IDs:', error);
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
        const countryResponse = await notion.pages.retrieve({ page_id: countryId });
        const regionIds = countryResponse.properties.Régions?.relation.map(r => r.id) || [];
        const countryGrapeIds = countryResponse.properties.Cépages?.relation.map(c => c.id) || [];

        const [regions, grapes] = await Promise.all([
            Promise.all(regionIds.map(id => notion.pages.retrieve({ page_id: id }))),
            Promise.all(countryGrapeIds.map(id => notion.pages.retrieve({ page_id: id })))
        ]);

        const mappedRegions = regions.map(r => ({
            id: r.id,
            name: r.properties.Région?.title[0]?.plain_text,
            grapeIds: r.properties.Cépages?.relation.map(c => c.id) || []
        }));

        const mappedGrapes = grapes.map(g => ({
            id: g.id,
            name: (g.properties.Nom?.title[0]?.plain_text || '').replace(/[^a-zA-ZÀ-ÿ\s]/g, '').trim(),
            type: g.properties.Type?.multi_select[0]?.name || 'Inconnu'
        }));

        const result = {
            country: {
                id: countryResponse.id,
                name: countryResponse.properties.Pays?.title[0]?.plain_text,
                flag: countryResponse.icon?.emoji,
                map: countryResponse.properties.Cartes?.files[0]?.file.url || ''
            },
            regions: mappedRegions.sort((a, b) => a.name.localeCompare(b.name)),
            grapes: mappedGrapes.sort((a, b) => a.name.localeCompare(b.name))
        };

        cache.set(cacheKey, result);
        return result;
    } catch (error) {
        console.error('Erreur lors de la récupération des données du pays:', error);
        return null;
    }
}
