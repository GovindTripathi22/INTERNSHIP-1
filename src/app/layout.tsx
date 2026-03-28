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
  description: "The premier golf subscription platform where every score generates charitable impact. Join the technical revolution of giving.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={`${manrope.variable} ${spaceGrotesk.variable} font-sans selection:bg-primary/30 antialiased`}>
        <div className="relative min-h-screen flex flex-col bg-background selection:bg-primary/20">
          {/* Subtle Global Glows */}
          <div className="fixed inset-0 pointer-events-none z-0">
            <div className="absolute top-0 left-1/4 w-[800px] h-[600px] bg-primary/5 rounded-full blur-[160px]" />
            <div className="absolute bottom-0 right-1/4 w-[800px] h-[600px] bg-secondary/3 rounded-full blur-[160px]" />
          </div>

          <Navbar />
          <main className="flex-grow pt-20 relative z-10">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
