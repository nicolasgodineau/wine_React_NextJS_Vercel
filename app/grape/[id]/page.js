import { getGrapeById } from '@lib/notion';
import BackButton from '@components/BackButton';
import { extractSections } from '@utils/sectionUtils';

import Image from 'next/image';
import Link from 'next/link.js';

// Blocks
import { HeadingBlock } from '@components/blocks/HeadingBlock.js';
import { ParagraphBlock } from '@components/blocks/ParagraphBlock.js';
import { BulletedListBlock } from '@components/blocks/BulletedListBlock.js';

// icônes
import rougeIcon from '@icons/grape_red.png';
import blancIcon from '@icons/grape_white.png';




export default async function GrapePage({ params }) {
    const { id } = await params;

    const grapeData = await getGrapeById(id);
    const blocks = grapeData.blocks;
    const sections = extractSections(blocks); // Appel de la fonction pour extraire les sections

    if (!grapeData) {
        return <div>Cépage non trouvé</div>;
    }


    console.log('sections:', sections)
    const firstSection = sections[0];
    console.log('firstSection:', firstSection)

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
            <section className='section'>
                {/* Rendre le titre de la section */}
                <HeadingBlock key={sections[0].heading.id} block={sections[0].heading} />
                {/* Rendre le contenu de la section */}
                {sections[0].content.map((block) => {
                    switch (block.type) {
                        case 'heading_2':
                        case 'heading_3':
                            return <HeadingBlock key={block.id} block={block} />;
                        case 'paragraph':
                            return <ParagraphBlock key={block.id} block={block} />;
                        case 'bulleted_list_item':
                            return <BulletedListBlock key={block.id} block={block} />;

                        default:
                            return null; // Ou un composant par défaut
                    }
                })}
            </section>
            <section className='section'>
                {/* Rendre le titre de la section */}
                <HeadingBlock key={sections[1].heading.id} block={sections[1].heading} />
                {/* Rendre le contenu de la section */}
                {sections[1].content.map((block) => {
                    switch (block.type) {
                        case 'heading_2':
                        case 'heading_3':
                            return <HeadingBlock key={block.id} block={block} />;
                        case 'paragraph':
                            return <ParagraphBlock key={block.id} block={block} />;
                        case 'bulleted_list_item':
                            return <BulletedListBlock key={block.id} block={block} />;

                        default:
                            return null; // Ou un composant par défaut
                    }
                })}
            </section>
            <details className='section collapse'>
                {/* Rendre le titre de la section */}
                <summary className="collapse-title pe-0 text-xl font-medium">
                    <HeadingBlock key={sections[2].heading.id} block={sections[2].heading} />
                </summary>
                <div className="collapse-content">
                    <details className='section collapse'>
                        {/* Rendre le contenu de la section */}
                        {sections[2].content.map((block) => {
                            if (block.type === 'heading_2' || block.type === 'heading_3') {
                                return (
                                    <summary key={block.id} className="collapse-title pe-0 text-xl font-medium">
                                        <HeadingBlock block={block} />
                                    </summary>
                                );
                            } else {
                                return (
                                    <div key={block.id} className="collapse-content">
                                        {(() => {
                                            switch (block.type) {
                                                case 'paragraph':
                                                    return <ParagraphBlock block={block} />;
                                                case 'bulleted_list_item':
                                                    return <BulletedListBlock block={block} />;
                                                // Vous pouvez ajouter d'autres cas ici si nécessaire
                                                default:
                                                    return null; // Ou un composant par défaut
                                            }
                                        })()}
                                    </div>
                                );
                            }
                        })}
                    </details>
                </div>
            </details>
            <BackButton /> {/* Redirige vers la page des pays */}
            <section className='section'>
                <h2 className="text-2xl font-bold text-center p-2">Pays avec ce cépage</h2>
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