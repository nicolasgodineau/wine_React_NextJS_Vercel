import { getCountries, getCountryById, getRegions, getCepages } from '../../lib/notion';
import Image from 'next/image';
import BackButton from '../../components/BackButton';

// icônes
import rougeIcon from '../../icons/grape_red.png';
import blancIcon from '../../icons/grape_white.png';


export async function generateStaticParams() {
    // Cette fonction reste nécessaire pour la génération statique
    const countries = await getCountries();
    return countries.map((country) => ({
        id: country.id,
    }));
}


export default async function CountryPage({ params }) {
    const country = await getCountryById(params.id);

    if (!country) {
        return <div>Pays non trouvé</div>;
    }


    const regions = await getRegions(country.regions.map(r => r.id));

    // Récupérer tous les IDs de cépages uniques de toutes les régions
    const allCepageIds = [...new Set(regions.flatMap(region => region.cepages?.map(c => c.id) || []))];

    // Récupérer tous les cépages
    const cepages = await getCepages(allCepageIds);

    // Associer les cépages à chaque région
    const regionsWithCepages = regions.map(region => ({
        ...region,
        cepages: region.cepages?.map(c => cepages.find(cepage => cepage.id === c.id)).filter(Boolean) || []
    }));
    console.log('regionsWithCepages:', regionsWithCepages)


    return (
        <main className="text-primary pb-12 lg:px-8 p-4">
            <header className="">
                <h1 className=" flex flex-col text-4xl font-bold text-center my-10">
                    <span className="px-4 text-7xl">{country.flag}</span> {country.name}
                </h1>
            </header>
            <BackButton />
            <section className="">
                <h2 className="text-2xl font-bold text-center p-2">Régions</h2>
                <ul className="flex flex-col justify-center items-center gap-4">
                    {regionsWithCepages.map((region) => (
                        <li className='w-full flex flex-col items-center justify-center py-4 rounded-xl shadow-md shadow-gray-500/20 dark:shadow-none dark:text-gray-950 dark:bg-gray-200 bg-gray-200/50' key={region.id}>
                            <h3 className='text-xl font-semibold p-4'>{region.name}</h3>
                            {region.cepages.length > 0 && (
                                <ul className="w-3/4 flex flex-col gap-2">
                                    {region.cepages.map((cepage) => (
                                        <li key={cepage.id} className="flex items-center">
                                            <Image
                                                src={cepage.type.toLowerCase() === 'rouge' ? rougeIcon : blancIcon} // Condition pour le type de vin
                                                alt={cepage.type.toLowerCase() === 'rouge' ? "Rouge" : "Blanc"} // Alt dynamique
                                                width={30}
                                                height={30}
                                                className="inline-block mr-2"
                                            />
                                            {cepage.name}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </li>
                    ))}
                </ul>
            </section>
        </main>
    );
}