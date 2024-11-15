import Link from "next/link";
import Search from "@components/Search.js";
import { searchCountries } from "@lib/notion.js";
import Menu from "./components/Menu.js";


export default async function Home() {

  return (
    <>
      <header className="flex flex-col items-center my-10">
        <h1 className=" text-4xl font-bold text-center ">
          Le Monde des Cépages
        </h1>
      </header>
    </>
  );
}

