import { getCompleteCountryData } from '@lib/notion';
import BackButton from '@components/BackButton';
import ImageModal from '@components/ImageModal';
import ListAside from '@components/ListAside';


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
                <h1 className="text-h1 font-bold text-center text-primary">
                    {countryData.country.name}
                </h1>
            </header>
            {/* <BackButton /> */}
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
            <ListAside
                title="Cépages dans ce pays"
                data={countryData.grapes}
                isCountryData={false} // On indique que ce sont des cépages (ce qui va afficher des icônes)
            />
        </>
    );
}