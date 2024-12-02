import { getCompleteCountryData } from '@lib/notion';
import BackButton from '@components/BackButton';
import ImageModal from '@components/ImageModal';
import ListAside from '@components/ListAside';
import Header from '@app/components/Header.js';


export default async function CountryPage({ params }) {
    const { id } = await params;
    const countryData = await getCompleteCountryData(id);

    if (!countryData) {
        return <div>Pays non trouvé</div>;
    }

    return (
        <>
            <Header icon={countryData.country.flag} title={countryData.country.name} />


            {/* <BackButton /> */}
            {/* affiche l'image */}
            {
                (countryData.grapes.length > 0 && countryData.country.map) && (
                    <div className='w-full flex justify-center mb-8'>
                        <div className='w-3/4 flex justify-center'>
                            <ImageModal
                                src={countryData.country.map}  // L'URL de l'image
                                alt="Carte de pays"  // Texte alternatif pour l'image
                            />
                        </div>
                        {/* Modal */}
                    </div>

                )
            }
            <ListAside
                title="Cépages dans ce pays"
                data={countryData.grapes}
                isCountryData={false} // On indique que ce sont des cépages (ce qui va afficher des icônes)
            />
        </>
    );
}