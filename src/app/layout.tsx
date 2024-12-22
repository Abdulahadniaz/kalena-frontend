"use client";

import "./globals.css";
import Link from "next/link";
import { getUser, isLoggedIn } from "./utils/utils";
import { useState } from "react";
import { User } from "./utils/utils";
import { useEffect } from "react";
import Avatar from "./components/Avatar";
import { Roboto } from "next/font/google";

const roboto = Roboto({
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (isLoggedIn()) {
      setUser(getUser());
    }
  }, []);

  return (
    <html>
      <body className="bg-gray-50 text-gray-900 font-sans min-h-screen flex flex-col">
        <header className="bg-white shadow-sm">
          <nav className=" mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <Link
              href="/"
              className="text-2xl font-bold font-serif text-gray-900"
            >
              Kalena
            </Link>
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="text-blue-600 hover:text-blue-800 transition-colors"
              >
                Home
              </Link>
              {user ? (
                <Avatar user={user} />
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    Login Now
                  </Link>
                  <Link
                    href={"/signup"}
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    Signup
                  </Link>
                </>
              )}
            </div>
          </nav>
        </header>

        <main>{children}</main>
      </body>
    </html>
  );
}
