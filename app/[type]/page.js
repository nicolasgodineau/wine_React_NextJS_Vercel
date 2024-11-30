import { getGrapes, getCountries } from '@lib/notion';
import Link from "next/link";
import RippleButton from '@components/RippleButton.js';
import GrappeRedSvg from '@components/icons/GrappeRedSvg.js';
import GrappeWhiteSvg from '@components/icons/GrappeWhiteSvg.js';
import { Suspense } from 'react';
import Loader from '@app/components/Loader.js';
import Header from '@app/components/Header.js';

// Metadata optimization
export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Revalidate every hour

// Title mapping for better maintenance
const TITLE_MAPPING = {
    cepages: {
        rouge: 'Les cépages rouges',
        blanc: 'Les cépages blancs',
        default: 'Liste des cépages'
    },
    pays: {
        afrique: 'Les pays d\'Afrique',
        'amérique du nord': 'Les pays d\'Amérique du Nord',
        'amérique du sud': 'Les pays d\'Amérique du Sud',
        asie: 'Les pays d\'Asie',
        europe: 'Les pays d\'Europe',
        océanie: 'Les pays d\'Océanie',
        default: 'Liste des pays'
    }
};


// Optimized data fetching based on type
async function fetchData(type, filterValue) {
    try {
        switch (type) {
            case 'cepages':
                return {
                    data: await getGrapes(filterValue),
                    icon: '🍇',
                    title: TITLE_MAPPING.cepages[filterValue.toLowerCase()] || TITLE_MAPPING.cepages.default
                };
            case 'pays':
                return {
                    data: await getCountries(filterValue),
                    icon: '🌍',
                    title: TITLE_MAPPING.pays[filterValue.toLowerCase()] || TITLE_MAPPING.pays.default
                };
            default:
                return null;
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
        return null;
    }
}

export default async function DynamicPage({ params, searchParams }) {
    const { type } = params;
    const filterValue = type === 'cepages'
        ? (searchParams?.type || 'all')
        : (searchParams?.continent || 'all');

    const result = await fetchData(type, filterValue);

    if (!result) {
        return (
            <div className="text-red text-center my-10">
                Page non trouvée : type inconnu.
            </div>
        );
    }

    const { data, icon, title } = result;

    return (
        <Suspense fallback={<Loader />}>
            <>
                <Header icon={icon} title={title} />
                <section className="flex flex-col gap-4 text-primary">
                    {data.map((item) => (
                        <li key={item.id} className="w-full flex flex-col items-center custom_css_rounded_shadow_bg">
                            {type === 'cepages' ? (
                                <RippleButton className="w-full rounded-xl" effectWidth={200} effectHeight={200}>
                                    <Link
                                        className="w-full flex flex-row items-center justify-start mb-0 py-1"
                                        href={`/cepages/${item.id}`}
                                        title={item.name}
                                    >
                                        <span className="px-4 text-4xl">
                                            {item.type[0]?.toLowerCase() === 'rouge' ? (
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
                                        className="w-full flex flex-row items-center justify-start mb-0 py-1"
                                        href={`/pays/${item.id}`}
                                        title={item.name}
                                    >
                                        <span className="h-[45px] text-5xl px-4">{item.flag}</span>
                                        {item.name}
                                    </Link>
                                </RippleButton>
                            )}
                        </li>
                    ))}
                </section>
            </>
        </Suspense>
    );
}