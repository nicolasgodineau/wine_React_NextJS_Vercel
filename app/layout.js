
import "./globals.css";
import Footer from "@components/Footer.js";
import BackToTop from "@components/BackToTop.js";

export const metadata = {
  title: "Wiki Wine App",
  description: "information on countries, regions and grape varieties",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className="flex flex-col h-screen text-black bg-white"
      >
        <BackToTop />

        <main className="flex-grow p-4 pb-20">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
