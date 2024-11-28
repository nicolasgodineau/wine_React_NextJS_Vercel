import Loader from "./components/Loader.js";

export default async function Home() {

  return (
    <>
      <header className="flex flex-col items-center my-10">
        <h1 className="text-h1 font-bold text-center text-primary ">
          Le Monde des Cépages
        </h1>
        <Loader></Loader>
      </header>
    </>
  );
}

