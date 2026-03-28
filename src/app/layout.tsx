import type { Metadata } from "next";
import { Manrope, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const manrope = Manrope({ 
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ['300', '400', '500', '600', '700', '800']
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ['300', '400', '500', '600', '700']
});

export const metadata: Metadata = {
  title: "Golf Clarity | Impact-Driven Competition",
  description: "The premier golf subscription platform where every score generates charitable impact. Join the professional athletic protocol for global impact.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={`${manrope.variable} ${spaceGrotesk.variable} font-sans bg-[#0e0e0e] text-white antialiased selection:bg-primary/30`}>
        {/* Environmental Layers */}
        <div className="mesh-gradient-bg" />
        <div className="grain-overlay" />
        
        {/* Perspective Fragments */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-[0]">
          <div className="glass-shard w-64 h-64 top-[10%] left-[-5%] rotate-12 opacity-10" />
          <div className="glass-shard w-96 h-96 bottom-[15%] right-[-10%] -rotate-12 opacity-15" />
          <div className="glass-shard w-48 h-48 top-[60%] left-[85%] rotate-45 opacity-10" />
        </div>

        <div className="relative min-h-screen flex flex-col z-10">
          <Navbar />
          <main className="flex-grow pt-20">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
