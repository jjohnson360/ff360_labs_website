import type { Metadata } from "next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroCircuits from "@/components/HeroCircuits";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ff360_labs",
  description: "Creative Technology Studio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable} ${jetbrainsMono.variable}`}>
      <body className="antialiased min-h-screen flex flex-col relative overflow-x-hidden">
        {/* Background Textures */}
        <div className="blueprint-grid z-0"></div>
        
        {/* Global Circuit Animation Background */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <HeroCircuits />
        </div>
        
        <Header />
        
        <main className="flex-grow pt-24 relative z-10">
          {children}
        </main>
        
        <Footer />
      </body>
    </html>
  );
}
