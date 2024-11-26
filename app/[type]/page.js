
import { getGrapes, getCountries } from '@lib/notion';
import Link from "next/link";
import Image from 'next/image';


// icônes
import rougeIcon from '@icons/grape_red.png';
import blancIcon from '@icons/grape_white.png';

export default async function DynamicPage({ params, searchParams }) {
    const { type } = await params;

    // Pour le filtre en fonction des continents et couleurs des cépages
    const continent = searchParams?.continent || 'all';
    const grapesType = searchParams?.type || 'all';

    let data = [];
    let title = '';
    let icon = '';

    if (type === 'cepages') {
        data = await getGrapes(grapesType);
        title = 'Liste des cépages';
        icon = '🍇';
    } else if (type === 'pays') {
        data = await getCountries(continent);
        title = 'Liste des pays';
        icon = '🌍';
    } else {
        return (
            <div className="text-red-500 text-center my-10">
                Page non trouvée : type inconnu.
            </div>
        );
    }

    return (
        <>
            <header className="flex flex-col items-center my-10">
                <span className="text-7xl">{icon}</span>
                <h1 className="text-4xl font-bold text-center text-[#660708]">
                    {title}
                </h1>
            </header>
            <section className="mb-24 text-[#660708]">
                {data.length > 0 ? (
                    <ul className="flex flex-col justify-center items-center gap-4 text-2xl font-medium">
                        {data.map((item) => (
                            <li
                                key={item.id}
                                className="w-full"
                            >
                                {type === 'cepages' ? (
                                    <Link
                                        className="flex flex-row items-center justify-start custom_css_section mb-0 pt-2"
                                        href={`/cepages/${item.id}`}
                                        title={item.name}
                                    >
                                        <span className="px-4 text-7xl">
                                            <Image
                                                src={item.type[0].toLowerCase() === 'rouge' ? rougeIcon : blancIcon}
                                                alt={item.type[0].toLowerCase() === 'rouge' ? "Rouge" : "Blanc"}
                                                width={45}
                                                height={45}
                                            />
                                        </span>
                                        {item.name}
                                    </Link>
                                ) : ( //pays
                                    <Link
                                        className="flex flex-row items-center justify-start custom_css_section mb-0 pt-2"
                                        href={`/pays/${item.id}`}
                                        title={item.name}
                                    >
                                        <span className="px-4 text-5xl">{item.flag}</span>
                                        {item.name}
                                    </Link>
                                )}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>Aucun résultat trouvé.</p>
                )}
            </section>
        </>
    );
}