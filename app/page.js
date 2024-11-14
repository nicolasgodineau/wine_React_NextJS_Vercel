import Link from "next/link";
import Search from "@components/Search.js";
import { searchCountries } from "@lib/notion.js";


export default async function Home() {

  const searchResults = await searchCountries('Fra');
  console.log('searchResults:', searchResults)

  return (
    <main className="flex flex-col items-center">
      <header className="flex flex-col items-center my-10">
        <h1 className=" text-4xl font-bold text-center ">
          Le Monde des Cépages
        </h1>
      </header>
      <Search placeholder="Rechercher un pays ou un cépage" />
      <section className='w-3/4 flex flex-col justify-center items-center gap-4 text-2xl font-bold mt-[40%]'>
        <div className="dropdown w-full ">
          <div tabIndex={0} role="button" className="btn w-full m-1">Voir la liste des pays</div>
          <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] p-2 ">
            <li>
              <Link href="/pays" className="text-blue-600 hover:underline">
                Tous les pays
              </Link>
            </li>
            <li>
              <Link href="/pays?continent=Afrique" className="text-blue-600 hover:underline">
                Afrique
              </Link>
            </li>
            <li>
              <Link href="/pays?continent=Amérique du Nord" className="text-blue-600 hover:underline">
                Amérique du Nord
              </Link>
            </li>
            <li>
              <Link href="/pays?continent=Amérique du Sud" className="text-blue-600 hover:underline">
                Amérique du Sud
              </Link>
            </li>
            <li>
              <Link href="/pays?continent=Asie" className="text-blue-600 hover:underline">
                Asie
              </Link>
            </li>
            <li>
              <Link href="/pays?continent=Europe" className="text-blue-600 hover:underline">
                Europe
              </Link>
            </li>
            <li>
              <Link href="/pays?continent=Océanie" className="text-blue-600 hover:underline">
                Océanie
              </Link>
            </li>
          </ul>
        </div>
        <div className="dropdown w-full">
          <div tabIndex={0} role="button" className="btn w-full m-1">Voir la liste des cépages</div>
          <ul tabIndex={0} className="dropdown-content w-full menu bg-base-100 rounded-box z-[1] p-2 shadow">
            <li>
              <Link href="/cepages" className="text-blue-600 hover:underline">
                Tous les cépages
              </Link>
            </li>
            <li>
              <Link href="/cepages?type=Rouge" className="text-blue-600 hover:underline">
                Cépages rouges
              </Link>
            </li>
            <li>
              <Link href="/cepages?type=Blanc" className="text-blue-600 hover:underline">
                Cépages blancs
              </Link>
            </li>
          </ul>
        </div>
      </section>
    </main>
  );
}

