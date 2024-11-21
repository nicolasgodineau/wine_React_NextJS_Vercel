import { getCompleteCountryData } from '@lib/notion';
import BackButton from '@components/BackButton';
import ImageModal from '@components/ImageModal';
import Image from 'next/image';
import Link from 'next/link.js';

// icônes
import rougeIcon from '@icons/grape_red.png';
import blancIcon from '@icons/grape_white.png';



export default async function CountryPage({ params }) {
    const { id } = await params;
    const countryData = await getCompleteCountryData(id);

    if (!countryData) {
        return <div>Pays non trouvé</div>;
    }

    return (
        <>
            <header className="flex flex-col items-center my-10">
                <span className="text-7xl">{countryData.country.flag}</span>
                <h1 className=" text-4xl font-bold text-center text-[#660708]">
                    {countryData.country.name}
                </h1>
            </header>
            <BackButton />
            {/* affiche l'image */}
            {(countryData.grapes.length > 0 && countryData.country.map) && (
                <div className='w-full flex justify-center mb-8'>
                    <div className='w-3/4 flex justify-center'>
                        <ImageModal
                            src={countryData.country.map}  // L'URL de l'image
                            alt="Carte de pays"  // Texte alternatif pour l'image
                        />
                    </div>
                    {/* Modal */}
                </div>

            )}
            <section className="custom_css_section">
                <div className="collapse-title text-xl font-medium pe-0">
                    <h2 className="text-2xl font-bold text-left text-[#660708] p-2">Cépages du pays</h2></div>
                <div className="collapse-content">
                    {countryData.grapes.length > 0 && (
                        <ul className="w-3/4 flex flex-col gap-2 px-4 text-[#660708]">
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
        </>
    );
}