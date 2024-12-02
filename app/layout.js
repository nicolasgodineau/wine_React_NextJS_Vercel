import "./globals.css";
import Footer from "@components/Footer.js";
import BackToTop from "@components/BackToTop.js";
import { LoadingProvider } from '@app/context/LoadingContext';

export const metadata = {
  title: "Wiki Wine App",
  description: "Découvrez le monde du vin",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className="flex flex-col h-screen text-paragraph bg-white">
        <LoadingProvider>

          <main className="flex-grow ">
            {children}
          </main>
          <Footer />
        </LoadingProvider>
      </body>
    </html>
  );
}
