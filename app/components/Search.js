'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Search() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchInitiated, setSearchInitiated] = useState(false);

    const handleSearch = async () => {
        if (!query.trim()) {
            return; // Empêche les recherches vides
        }

        setSearchInitiated(true);
        setLoading(true);
        setError(null);

        try {
            // Appel à la route API
            const response = await fetch('/api/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query }), // Envoie la requête avec le champ "query"
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la recherche');
            }

            const data = await response.json();
            setResults(data.results || []);
        } catch (err) {
            setError(err.message || 'Erreur inconnue');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full flex flex-col-reverse items-stretch gap-4 mb-8 text-black ">
            <div className="flex items-center">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Rechercher"
                    className="bg-neutral-100/50 rounded-l-xl p-2 flex-1"
                />
                <button
                    onClick={handleSearch}
                    disabled={loading}
                    className="rounded-r-xl bg-neutral-200/80 px-4 py-2 disabled:opacity-50"
                >
                    {loading ? 'Recherche...' : 'Valider'}
                </button>
            </div>
            {error && <p className="text-red-500 mt-2">{error}</p>}
            <ul className="w-full">
                {results.length > 0 ? (
                    results.map((result) => (
                        <li
                            key={result.id}
                            className="p-2 bg-neutral-200 rounded-xl shadow hover:bg-gray-100"
                        >
                            <Link
                                href={`/pays/${result.id}`} // Lien vers la page du pays
                                className="flex items-center"
                            >
                                <span className="text-2xl mr-2">{result.flag}</span>
                                <span>{result.name}</span>
                                <span className="ml-auto text-sm text-gray-500">{result.continent}</span>
                            </Link>
                        </li>
                    ))
                ) : (
                    searchInitiated && !loading && results.length === 0 && (
                        <p className="text-gray-500">Aucun résultat trouvé</p>
                    )
                )}
            </ul>
        </div>
    );
}
