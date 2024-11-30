'use client';

import Link from 'next/link';
import { useState, useCallback } from 'react';
import RippleButton from '@components/RippleButton';

// icônes
import GrappeRedSvg from '@components/icons/GrappeRedSvg.js';
import GrappeWhiteSvg from '@components/icons/GrappeWhiteSvg.js';

export default function Search({ setIsSearchOpen }) {
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
        <div className="w-full flex flex-col-reverse items-stretch gap-4 pb-2 text-paragraph ">
            <div className="flex gap-1 rounded-lg bg-neutral-100/50 p-1">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Rechercher"
                    className="bg-transparent w-5/6 rounded-lg p-2"
                />
                <RippleButton className="w-1/2 rounded-lg bg-neutral-300/40 px-4 py-2 disabled:opacity-50" effectWidth={100} effectHeight={100} onClick={handleSearch}
                    disabled={loading}>
                    {loading ? 'Recherche...' : 'Valider'}
                </RippleButton>
            </div>
            {error && <p className="text-red mt-2">{error}</p>}
            <ul className="w-full flex flex-col gap-4 pt-4">
                {results.length > 0 ? (
                    results.map((result) => (
                        <li
                            onClick={() => setIsSearchOpen(false)}
                            key={result.id}
                            className="flex justify-center items-center bg-neutral-100/80 rounded-lg shadow pl-2 hover:bg-gray-100 text-paragraph"
                        >
                            {/* Condition pour afficher un émoji de drapeau ou l'image du cépage */}
                            {result.type === 'country' ? (
                                <RippleButton className="w-full rounded-lg" effectWidth={150} effectHeight={150}>
                                    <Link href={`/pays/${result.id}`} className="flex w-full items-center justify-start px-1 py-2 ">
                                        <>
                                            <span className="text-2xl mr-2">{result.icon}</span>
                                            <span>{result.name}</span>

                                        </>
                                    </Link>
                                </RippleButton>
                            ) : (
                                <RippleButton className="w-full rounded-lg " effectWidth={150} effectHeight={150}>
                                    <Link href={`/cepages/${result.id}`} className="flex w-full items-center justify-start px-1 py-2 ">
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
                        <p className="text-paragraph">Aucun résultat trouvé</p>
                    )
                )}
            </ul>
        </div>
    );
}
