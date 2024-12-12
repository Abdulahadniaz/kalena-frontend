import Link from "next/link";
import "./globals.css";
import { Inter, Roboto_Slab } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const robotoSlab = Roboto_Slab({
  subsets: ["latin"],
  variable: "--font-roboto-slab",
});

export const metadata = {
  title: "Kalena",
  description: "A professional calendar application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${robotoSlab.variable}`}>
      <body className="bg-gray-50 text-gray-900 font-sans min-h-screen flex flex-col">
        <header className="bg-white shadow-sm">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <Link href="/">
              <h1 className="text-2xl font-bold font-serif text-gray-900">
                Kalena
              </h1>
            </Link>
            <a
              href="/login"
              className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              Link Accounts
            </a>
          </nav>
        </header>
        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <footer className="bg-white border-t border-gray-200 py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500">
            © 2023 Calendar App. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}
