import { search } from '@lib/notion.js';
import Link from 'next/link';
import Search from '@components/Search';

export default async function SearchResults({ searchParams }) {
    const query = searchParams?.q || ''; // Utilisation de l'opérateur optionnel
    const results = await search(query); // Obtenez les résultats
    console.log('results:', results)

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Résultats de recherche pour "{query}"</h1>

            <div className="mb-6">
                <Search placeholder="Rechercher un pays ou un cépage" />
            </div>

            {results.length > 0 ? (
                <ul className="space-y-2">
                    {results.map(item => (
                        <li key={item.id} className="border p-3 rounded-md hover:bg-gray-100">
                            {item.typeResult === 'country' ? (
                                <Link href={`/country/${item.id}`} className="flex items-center">
                                    <span className="text-2xl mr-2">{item.flag}</span>
                                    <span>{item.name}</span>
                                    <span className="ml-auto text-sm text-gray-500">{item.continent}</span>
                                </Link>
                            ) : (
                                <Link href={`/grape/${item.id}`} className="flex items-center">
                                    <span>{item.name}</span>

                                </Link>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Aucun résultat trouvé pour cette recherche.</p>
            )}
        </div>
    );
}