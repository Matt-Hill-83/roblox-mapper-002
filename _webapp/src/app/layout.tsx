import "./globals.css";

import { Geist, Geist_Mono } from "next/font/google";

import DataProvider from "../components/DataProvider";
import Link from "next/link";
import type { Metadata } from "next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Data Viewer App",
  description: "Next.js Data Viewer with MUI Data Grid and Pivot Table",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <nav className="bg-gray-800 text-white p-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <h1 className="text-xl font-bold">Data Viewer</h1>
            <div className="flex space-x-4">
              <Link
                href="/"
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition-colors"
              >
                Data Grid
              </Link>
              <Link
                href="/pivot"
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition-colors"
              >
                Pivot Table
              </Link>
            </div>
          </div>
        </nav>
        <DataProvider>
          <main className="min-h-screen bg-gray-50">{children}</main>
        </DataProvider>
      </body>
    </html>
  );
}
