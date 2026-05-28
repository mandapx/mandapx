import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "MandapX — Find the Perfect Wedding Venue",
  description: "India's largest wedding venue booking platform with 50,000+ venues. Discover banquet halls, resorts, lawns, and more across 700+ cities.",
  keywords: ["wedding venues", "banquet halls", "party lawns", "MandapX", "venue booking India", "wedding venues India"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`h-full antialiased ${inter.variable} ${playfair.variable}`}>
      <body className="min-h-full flex flex-col bg-white font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
