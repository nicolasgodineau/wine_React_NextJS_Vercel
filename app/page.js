import { getCountries } from './lib/notion';
import Link from "next/link";

export default async function Home() {
  const countries = await getCountries();



  return (
    <main className="flex flex-col">
      <header className=" ">
        <h1 className="text-4xl font-bold text-center my-10">Pays</h1>
      </header>
      <section className="flex flex-col gap-4 md:px-4 sm:px-2">
        <ul className="flex flex-col justify-center items-center gap-4 text-2xl font-bold">
          {countries.map((country) => {
            return (
              <li className="w-full flex items-center justify-center gap-1" key={country.id}>
                <Link
                  className="w-full flex flex-col items-center justify-center gap-2 p-4 bg-gray-100 rounded-3xl shadow-md shadow-slate-500/20"
                  href={`/country/${country.id}`}
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