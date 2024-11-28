import { notion, getCachedData } from '../notion-client';
import { getCountriesByIds } from './countries';
import { getBlocksByPageId } from './blocks';
import { cepagesDatabaseId } from '../config';

export async function getGrapes(type = 'all') {
    return getCachedData(
        `cepages_${type}`,
        async () => {
            try {
                let queryParams = {
                    database_id: cepagesDatabaseId,
                    sorts: [{ property: 'Nom', direction: 'ascending' }],
                    page_size: 100, // Optimize by limiting page size
                };

                if (type !== 'all') {
                    queryParams.filter = {
                        property: 'Type',
                        multi_select: { contains: type }
                    };
                }

                const response = await notion.databases.query(queryParams);
                return response.results.map((page) => ({
                    id: page.id,
                    name: (page.properties.Nom?.title[0]?.plain_text || '').replace(/[^a-zA-ZÀ-ÿ\s]/g, '').trim(),
                    type: page.properties.Type?.multi_select.map(t => t.name) || ['Inconnu'],
                }));
            } catch (error) {
                console.error('Erreur lors de la récupération des cépages:', error);
                return [];
            }
        }
    );
}

export async function getGrapeById(grapeId) {
    return getCachedData(
        `cepage_${grapeId}`,
        async () => {
            try {
                const [page, blocks] = await Promise.all([
                    notion.pages.retrieve({ page_id: grapeId }),
                    getBlocksByPageId(grapeId)
                ]);

                if (!page || !page.properties) {
                    console.error(`Aucune donnée trouvée pour le cépage ${grapeId}`);
                    return null;
                }

                const countryIds = page.properties['Pays d\'origine']?.relation?.map(c => c.id) || [];
                const countries = countryIds.length > 0 ? await getCountriesByIds(countryIds) : [];
                countries.sort((a, b) => a.name.localeCompare(b.name));

                return {
                    id: page.id,
                    name: (page.properties.Nom?.title[0]?.plain_text || '').replace(/[^a-zA-ZÀ-ÿ\s]/g, '').trim(),
                    type: page.properties.Type?.multi_select[0]?.name || 'Inconnu',
                    countries,
                    blocks,
                };
            } catch (error) {
                console.error(`Erreur lors de la récupération du cépage ${grapeId}:`, error);
                return null;
            }
        }
    );
}
