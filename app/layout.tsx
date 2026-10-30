import type { Metadata } from "next";
import { Caprasimo, Figtree, Gaegu } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { CartToast } from "@/components/CartToast";

const caprasimo = Caprasimo({ subsets: ["latin"], weight: "400", variable: "--font-caprasimo", display: "swap" });
const figtree = Figtree({ subsets: ["latin"], variable: "--font-figtree", display: "swap" });
const gaegu = Gaegu({ subsets: ["latin"], weight: "700", variable: "--font-gaegu", display: "swap" });

export const metadata: Metadata = {
  title: "Chapter & Bloom · Skins e inserts para e-readers",
  description:
    "Skins e inserts con diseños originales para Kindle, Kobo, Onyx Boox, Xteink y Bigme. Elige tu modelo y tu acabado, o crea el tuyo.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" data-scroll-behavior="smooth" className={`${caprasimo.variable} ${figtree.variable} ${gaegu.variable}`}>
      <body>
        <CartProvider>
          <Header />
          <main>{children}</main>
          <Footer />
          <CartDrawer />
          <CartToast />
        </CartProvider>
      </body>
    </html>
  );
}
