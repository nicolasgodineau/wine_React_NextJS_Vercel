import { search } from '@lib/notion';

export async function POST(req) {
    try {
        const { query } = await req.json();

        if (!query || typeof query !== 'string') {
            return new Response(
                JSON.stringify({ error: 'Requête invalide' }),
                { status: 400 }
            );
        }

        const results = await search(query);
        return new Response(JSON.stringify({ results }), { status: 200 });
    } catch (error) {
        console.error('Erreur dans l’API Search:', error);
        return new Response(
            JSON.stringify({ error: 'Erreur serveur' }),
            { status: 500 }
        );
    }
}
