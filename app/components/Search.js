'use client';

import Link from 'next/link';
import { useState, useCallback } from 'react';

// icônes
import rougeIcon from '@icons/grape_red.png';
import blancIcon from '@icons/grape_white.png';
import Image from 'next/image.js';

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
            <div className="flex">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Rechercher"
                    className="bg-neutral-100/50 w-5/6 rounded-l-xl p-2"
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
            <ul className="w-full flex flex-col gap-4">
                {results.length > 0 ? (
                    results.map((result) => (
                        <li
                            key={result.id}
                            className="flex justify-center items-center p-2 bg-neutral-200 rounded-xl shadow hover:bg-gray-100"
                        >
                            {/* Condition pour afficher un émoji de drapeau ou l'image du cépage */}
                            {result.type === 'country' ? (
                                <Link href={`/pays/${result.id}`} className="flex w-full">
                                    <>
                                        <span className="text-2xl mr-2">{result.icon}</span>
                                        <span>{result.name}</span>
                                        <span className="ml-auto text-sm text-gray-500">{result.continent}</span>
                                    </>
                                </Link>
                            ) : (
                                <Link href={`/cepage/${result.id}`} className="flex w-full">
                                    <>
                                        {/* Vérifie si c'est un cépage de type "rouge" ou "blanc" */}
                                        <Image
                                            src={result.icon[0].toLowerCase() === 'rouge' ? rougeIcon : blancIcon}
                                            alt={result.icon[0].toLowerCase() === 'rouge' ? "Rouge" : "Blanc"}
                                            width={24}
                                            height={32}
                                        />
                                        <span className='flex-grow ml-2'>{result.name}</span>
                                    </>
                                </Link>
                            )}
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
