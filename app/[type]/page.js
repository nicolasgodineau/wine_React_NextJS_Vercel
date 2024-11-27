
import { getGrapes, getCountries } from '@lib/notion';
import Link from "next/link";
import Image from 'next/image';
import RippleButton from '@components/RippleButton.js';

// icônes
import GrappeRedSvg from '@components/icons/GrappeRedSvg.js';
import GrappeWhiteSvg from '@components/icons/GrappeWhiteSvg.js';

export default async function DynamicPage({ params, searchParams }) {
    const { type } = await params;

    // Pour le filtre en fonction des continents et couleurs des cépages
    const continent = searchParams?.continent || 'all';
    const grapesType = searchParams?.type || 'all';

    let data = [];
    let title = '';
    let icon = '';

    if (type === 'cepages') {
        switch (grapesType.toLowerCase()) {
            case 'rouge':
                title = 'Liste des cépages rouges';
                break;
            case 'blanc':
                title = 'Liste des cépages blancs';
                break;
            default:
                title = 'Liste des cépages';
                break;
        }
        icon = '🍇';
    } else if (type === 'pays') {
        data = await getCountries(continent);
        switch (continent.toLowerCase()) {
            case 'afrique':
                title = 'Les pays d\'Afrique';
                break;
            case 'amérique du nord':
                title = 'Les pays d\'Amérique du Nord';
                break;
            case 'amérique du sud':
                title = 'Les pays d\'Amérique du Sud';
                break;
            case 'asie':
                title = 'Les pays d\'Asie';
                break;
            case 'europe':
                title = 'Les pays d\'Europe';
                break;
            case 'océanie':
                title = 'Les pays d\'Océanie';
                break;
            default:
                title = 'Liste des pays';
                break;
        }
        icon = '🌍';
    } else {
        return (
            <div className="text-red text-center my-10">
                Page non trouvée : type inconnu.
            </div>
        );
    }

    return (
        <>
            <header className="flex flex-col items-center my-10">
                <span className="text-7xl">{icon}</span>
                <h1 className="text-h1 font-bold text-center text-primary ">
                    {title}
                </h1>
            </header>
            <section className="flex flex-col gap-4 text-primary">
                {data.map((item) => (
                    <li key={item.id} className="w-full custom_css_section">
                        {type === 'cepages' ? (
                            <RippleButton className="w-full" effectWidth={150} effectHeight={150}>
                                <Link
                                    className="w-full flex flex-row items-center justify-start mb-0 pt-2"
                                    href={`/cepages/${item.id}`}
                                    title={item.name}
                                >
                                    <span className="px-4 text-7xl">
                                        {item.type[0].toLowerCase() === 'rouge' ? (
                                            <GrappeRedSvg width={45} height={45} />
                                        ) : (
                                            <GrappeWhiteSvg width={45} height={45} />
                                        )}
                                    </span>
                                    {item.name}
                                </Link>
                            </RippleButton>
                        ) : (
                            <RippleButton className="w-full rounded-xl" effectWidth={200} effectHeight={200}>
                                <Link
                                    className="w-full flex flex-row items-center justify-start mb-0"
                                    href={`/pays/${item.id}`}
                                    title={item.name}
                                >
                                    <span className="px-4 text-5xl">{item.flag}</span>
                                    {item.name}
                                </Link>
                            </RippleButton>
                        )}
                    </li>
                ))}

            </section>
        </>
    );
}