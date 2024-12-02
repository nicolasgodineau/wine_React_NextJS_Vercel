import Image from "next/image.js";
import Loader from "./components/Loader.js";
import logo from "@icons/logo.png"

export default async function Home() {
  return (
    <section className="w-full overflow-x-hidden">
      <header className="min-h-screen flex flex-col items-center justify-around px-4 py-8 md:px-8">
        <h1 className="text-h2 md:text-[2.5rem] font-bold text-center text-primary">
          Le Monde des Cépages
        </h1>
        <div className="w-full max-w-md md:max-w-lg relative aspect-square">
          <Image 
            src={logo} 
            alt="logo"
            fill
            priority
            className="object-contain"
            sizes="(max-width: 768px) 90vw, 800px"
          />
        </div>
      </header>
    </section>
  );
}
