import Image from "next/image.js";
import Loader from "./components/Loader.js";
import logo from "@icons/logo.png"
export default async function Home() {

  return (
    <>
      <header className="h-full flex flex-col items-center justify-around px-1 overflow-hidden">
        <h1 className="text-h2 font-bold text-center text-primary ">
          Le Monde des Cépages
        </h1>
        <div className="h-1/2 w-1/2">
          <Image src={logo} height={800} width={800} alt="logo" />
        </div>
      </header>
    </>
  );
}

