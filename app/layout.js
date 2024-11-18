import localFont from "next/font/local";
import "./globals.css";
import Footer from "./components/Footer.js";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Wiki Wine App",
  description: "information on countries, regions and grape varieties",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased text-black dark:text-gray-100 bg-neutral-100 flex flex-col h-screen`}
      >
        <main className="flex-grow p-4 pb-12 bg-neutral-100 ">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
