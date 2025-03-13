import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import ThemeToggle from "./components/ThemeToggle";
import Header from "./components/Header";
import { ViewModeProvider } from './contexts/ViewModeContext';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ketket's Developments",
  description: "Yazılım geliştirme üzerine deneyimler ve öğrendiklerim",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={`${inter.className} bg-white dark:bg-gray-900 transition-colors duration-300`}>
        <ThemeProvider attribute="class">
          <ViewModeProvider>
            <Header />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {children}
            </main>
            <ThemeToggle />
          </ViewModeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}