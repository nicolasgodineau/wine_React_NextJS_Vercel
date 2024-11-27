'use client';

import Link from 'next/link';
import { useState, useCallback } from 'react';
import RippleButton from '@components/RippleButton';

// icônes
import GrappeRedSvg from '@components/icons/GrappeRedSvg.js';
import GrappeWhiteSvg from '@components/icons/GrappeWhiteSvg.js';

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
        <div className="w-full flex flex-col-reverse items-stretch gap-4 mb-8 text-paragraph ">
            <div className="flex rounded-xl bg-neutral-100/50 p-1">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Rechercher"
                    className="bg-transparent w-5/6 rounded-xl p-2"
                />
                <RippleButton className="w-1/2 rounded-xl bg-neutral-200/80 px-4 py-2 disabled:opacity-50" effectWidth={150} effectHeight={150} onClick={handleSearch}
                    disabled={loading}>
                    {loading ? 'Recherche...' : 'Valider'}
                </RippleButton>
            </div>
            {error && <p className="text-red mt-2">{error}</p>}
            <ul className="w-full flex flex-col gap-4">
                {results.length > 0 ? (
                    results.map((result) => (
                        <li
                            key={result.id}
                            className="flex justify-center items-center p-2 my-2 bg-neutral-200 rounded-xl shadow hover:bg-gray-100"
                        >
                            {/* Condition pour afficher un émoji de drapeau ou l'image du cépage */}
                            {result.type === 'country' ? (
                                <RippleButton className="w-full px-3 rounded-full shadow-none" effectWidth={150} effectHeight={150}>
                                    <Link href={`/pays/${result.id}`} className="flex w-full items-center justify-start">
                                        <>
                                            <span className="text-2xl mr-2">{result.icon}</span>
                                            <span>{result.name}</span>
                                            <span className="ml-auto text-sm text-gray-500">{result.continent}</span>
                                        </>
                                    </Link>
                                </RippleButton>
                            ) : (
                                <RippleButton className="w-full px-3 rounded-full shadow-none" effectWidth={150} effectHeight={150}>
                                    <Link href={`/cepages/${result.id}`} className="flex w-full items-center justify-start">
                                        <>
                                            {/* Vérifie si c'est un cépage de type "rouge" ou "blanc" */}
                                            {result.icon[0].toLowerCase() === 'rouge' ? (
                                                <GrappeRedSvg className="inline-block mr-2" width={24} height={32} />
                                            ) : (
                                                <GrappeWhiteSvg className="inline-block mr-2" width={24} height={32} />
                                            )}
                                            <span className=' ml-2'>{result.name}</span>
                                        </>
                                    </Link>
                                </RippleButton>

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
