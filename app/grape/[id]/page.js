import { getGrapeById } from '../../lib/notion';
import BackButton from '../../components/BackButton';
import Image from 'next/image';
import Link from 'next/link.js';

// Blocks
import { Heading2Block } from '../../components/blocks/Heading2Block.js';

// icônes
import rougeIcon from '../../icons/grape_red.png';
import blancIcon from '../../icons/grape_white.png';



export default async function GrapePage({ params }) {
    const { id } = await params;

    const grapeData = await getGrapeById(id);
    const blocks = grapeData.blocks;

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
            {blocks[1] && blocks[1].type === 'heading_2' && (
                <Heading2Block block={blocks[1]} />
            )}
            {blocks[3] && blocks[3].type === 'heading_2' && (
                <Heading2Block block={blocks[3]} />
            )}
            <BackButton /> {/* Redirige vers la page des pays */}
            <section className='p-4 mb-8 rounded-xl shadow-md shadow-gray-500/20 dark:shadow-none dark:text-gray-950 dark:bg-gray-200 bg-gray-200/50'>
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

            {/* Ajoutez d'autres détails que vous souhaitez afficher */}
        </main>
    );
}