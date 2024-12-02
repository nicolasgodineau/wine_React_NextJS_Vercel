import { getGrapeById } from '@lib/notion';
import { groupSections } from '@utils/notionUtils';
import BackButton from '@components/BackButton';
import AccordionSection from '@app/components/AccordionSection.js';
import ListAside from '@components/ListAside';

// icônes
import GrappeRedSvg from '@components/icons/GrappeRedSvg.js';
import GrappeWhiteSvg from '@components/icons/GrappeWhiteSvg.js';
import Header from '@app/components/Header.js';


export default async function GrapePage({ params }) {
    const { id } = await params;
    const grapeData = await getGrapeById(id);
    const sections = groupSections(grapeData.blocks);

    if (!grapeData) {
        return <div>Cépage non trouvé</div>;
    }

    return (
        <>
            <Header icon={grapeData.type.toLowerCase() === 'rouge' ? (
                <GrappeRedSvg className="inline-block mr-2" width={72} height={72} />
            ) : (
                <GrappeWhiteSvg className="inline-block mr-2" width={72} height={72} />
            )} title={grapeData.name}>
            </Header>
            {sections.map((section, index) => (
                <AccordionSection key={index} section={section} />
            ))}
            {/*  <BackButton />  */}{/* Redirige vers la page des pays */}
            <ListAside
                title="Pays avec ce cépage"
                data={grapeData.countries}
                isCountryData={true} // On indique que ce sont des pays (ce qui va afficher des flags)
            />
        </>
    );
}