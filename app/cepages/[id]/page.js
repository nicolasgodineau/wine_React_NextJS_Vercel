import { getGrapeById } from '@lib/notion';
import BackButton from '@components/BackButton';
import { groupSections } from '@utils/notionUtils';
import AccordionSection from '@app/components/AccordionSection.js';

import Image from 'next/image';
import Link from 'next/link.js';

// icônes
import rougeIcon from '@icons/grape_red.png';
import blancIcon from '@icons/grape_white.png';





export default async function GrapePage({ params }) {
    const { id } = await params;

    const grapeData = await getGrapeById(id);
    const sections = groupSections(grapeData.blocks);

    if (!grapeData) {
        return <div>Cépage non trouvé</div>;
    }

    return (
        <main className="">
            <header className="flex flex-col items-center my-10">
                <Image
                    src={grapeData.type.toLowerCase() === 'rouge' ? rougeIcon : blancIcon}
                    alt={grapeData.type.toLowerCase() === 'rouge' ? "Rouge" : "Blanc"}
                    width={72}
                    height={72}
                />
                <h1 className=" text-4xl font-bold text-center ">
                    {grapeData.name}
                </h1>
            </header>
            {sections.map((section, index) => (
                <AccordionSection key={index} section={section} />
            ))}
            <BackButton /> {/* Redirige vers la page des pays */}
            <section className='custom_css_section'>
                <h2 className="text-2xl font-bold text-left p-2">Pays avec ce cépage</h2>
                {grapeData.countries.length > 0 && (
                    <ul className="w-3/4 flex flex-col gap-2 px-4">
                        {grapeData.countries.map((country) => (
                            <li key={country.id}>
                                <Link className='flex items-center gap-2' href={`/country/${country.id}`}> {/* Lien vers la page du cépage */}
                                    <span className="text-3xl">{country.flag}</span>
                                    {country.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </main>
    );
}