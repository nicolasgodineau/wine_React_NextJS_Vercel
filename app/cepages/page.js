
import { getGrapes } from '@lib/notion';
import Link from "next/link";
import Image from 'next/image';


// icônes
import rougeIcon from '@icons/grape_red.png';
import blancIcon from '@icons/grape_white.png';

export default async function CepagesPage({ searchParams }) {
    const params = await searchParams;
    const type = params.type || 'all';
    const grapes = await getGrapes(type);
    console.log('grapes:', grapes)

    return (
        <>
            <header className="flex flex-col items-center my-10">
                <span className="text-7xl">🍇</span>
                <h1 className=" text-4xl font-bold text-center dark:text-[#F5F3F4] text-[#660708] ">
                    Liste des cépages
                </h1>
            </header>
            <section className="mb-24 dark:text-[#F5F3F4] text-[#660708]">
                <ul className="flex flex-col justify-center items-center gap-4 text-2xl font-medium">
                    {grapes.map((grape) => {
                        return (
                            <li className="w-full" key={grape.id}>
                                <Link
                                    className="flex flex-row items-center justify-start custom_css_section mb-0 pt-2"
                                    href={`/cepages/${grape.id}`}
                                    title={grape.name}
                                >
                                    <span className="px-4 py-1 text-7xl">
                                        <Image
                                            src={grape.type[0].toLowerCase() === 'rouge' ? rougeIcon : blancIcon}
                                            alt={grape.type[0].toLowerCase() === 'rouge' ? "Rouge" : "Blanc"}
                                            width={45}
                                            height={45}
                                        /></span>
                                    {grape.name}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </section>
        </>
    );
}