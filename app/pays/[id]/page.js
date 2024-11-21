import { getCompleteCountryData } from '@lib/notion';
import BackButton from '@components/BackButton';
import Image from 'next/image';
import Link from 'next/link.js';

// icônes
import rougeIcon from '@icons/grape_red.png';
import blancIcon from '@icons/grape_white.png';



export default async function CountryPage({ params }) {
    const { id } = await params;
    const countryData = await getCompleteCountryData(id);
    console.log('countryData:', countryData)



    if (!countryData) {
        return <div>Pays non trouvé</div>;
    }


    return (
        <>
            <header className="flex flex-col items-center my-10">
                <span className="text-7xl">{countryData.country.flag}</span>
                <h1 className=" text-4xl font-bold text-center ">
                    {countryData.country.name}
                </h1>
            </header>
            <BackButton />
            {(countryData.grapes.length > 0 && countryData.country.map) && (
                <div className='w-full flex justify-center mb-8'>
                    <div className='w-3/4 flex justify-center'>
                        <Image
                            width={500}
                            height={500}
                            alt="map"
                            loading='lazy'
                            src={countryData.country.map}
                        />
                    </div>
                </div>
            )}
            <section className="mb-8 custom_css_section">
                {countryData.grapes.length > 0 && (
                    <ul className="w-full self-start flex flex-col gap-2 pl-4">
                        {countryData.grapes.map((cepage) => (
                            <li key={cepage.id}>
                                <Link className='flex items-center gap-2' href={`/cepages/${cepage.id}`}> {/* Lien vers la page du cépage */}
                                    <Image
                                        src={cepage.type.toLowerCase() === 'rouge' ? rougeIcon : blancIcon}
                                        alt={cepage.type.toLowerCase() === 'rouge' ? "Rouge" : "Blanc"}
                                        width={30}
                                        height={30}
                                        className="inline-block mr-2"
                                    />
                                    {cepage.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}

                <div className="collapse-title text-xl font-medium pe-0">
                    <h2 className="text-2xl font-bold text-center p-2">Cépages du pays</h2></div>
                <div className="collapse-content">
                    {countryData.grapes.length > 0 && (
                        <ul className="w-full self-start flex flex-col gap-2 pl-4">
                            {countryData.grapes.map((cepage) => (
                                <li key={cepage.id}>
                                    <Link className='flex items-center gap-2' href={`/cepages/${cepage.id}`}> {/* Lien vers la page du cépage */}
                                        <Image
                                            src={cepage.type.toLowerCase() === 'rouge' ? rougeIcon : blancIcon}
                                            alt={cepage.type.toLowerCase() === 'rouge' ? "Rouge" : "Blanc"}
                                            width={30}
                                            height={30}
                                            className="inline-block mr-2"
                                        />
                                        {cepage.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </section>
            <section className="collapse collapse-arrow mb-8 custom_css_section">
                <input type="checkbox" />
                <div className="collapse-title text-xl font-medium pe-0">
                    <h2 className="text-2xl font-bold text-center p-2">Régions</h2></div>
                <div className="collapse-content">

                    <ul className="flex flex-col justify-center items-center gap-4">
                        {countryData.regions.map((region) => (
                            <li className='w-full flex flex-col items-center justify-center py-4 rounded-xl bg-gray-300/20 shadow-sm' key={region.id}>
                                <h3 className='text-xl font-semibold p-4'>{region.name}</h3>
                                {region.grapes.length > 0 && (
                                    <ul className="w-full self-start flex flex-col gap-2 px-4">
                                        {region.grapes.map((cepage) => (
                                            <li key={cepage.id} className="flex items-center">
                                                <Link className='flex items-center gap-2' href={`/cepages/${cepage.id}`}> {/* Lien vers la page du cépage */}
                                                    <Image
                                                        src={cepage.type.toLowerCase() === 'rouge' ? rougeIcon : blancIcon}
                                                        alt={cepage.type.toLowerCase() === 'rouge' ? "Rouge" : "Blanc"}
                                                        width={30}
                                                        height={30}
                                                        className="inline-block mr-2"
                                                    />
                                                    {cepage.name}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            </section>
        </>
    );
}