import { getCountries } from '@lib/notion';
import Link from "next/link";

export default async function CountriesPage({ searchParams }) {
    const continent = searchParams.continent || 'all';
    const countries = await getCountries(continent);

    return (
        <main className="flex flex-col">
            <header className="flex flex-col items-center my-10">
                <span className="text-7xl">🌎</span>
                <h1 className=" text-4xl font-bold text-center ">
                    {continent !== 'all' ? `${continent}` : 'Liste des pays'}
                </h1>
            </header>

            <section className="">
                <ul className="flex flex-col justify-center items-center gap-4 text-2xl font-medium">
                    {countries.map((country) => {
                        return (
                            <li className="w-full" key={country.id}>
                                <Link
                                    className="flex flex-col items-center justify-center custom_css_section mb-0 pt-2"
                                    href={`/pays/${country.id}`}
                                    title={country.name}
                                >
                                    <span className="px-4 text-7xl">{country.flag}</span>
                                    {country.name}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </section>
        </main>
    );
}