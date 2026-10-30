"use client";

import Link from "next/link";
import { useState } from "react";
import { Marquee } from "./Marquee";

export function Footer() {
  const [sent, setSent] = useState(false);
  return (
    <footer className="border-t-2 border-ink">
      <a
        href="https://www.instagram.com/chapterandbloom.shop/"
        target="_blank"
        rel="noreferrer"
        aria-label="Síguenos en Instagram: @chapterandbloom.shop"
        className="block bg-mauve py-4 text-ink"
      >
        <Marquee className="font-display text-2xl sm:text-3xl" items={["Síguenos en @chapterandbloom.shop", "Novedades y sorteos", "Mucho cariño por la lectura"]} />
      </a>

      <div data-tone="ink" className="overflow-hidden bg-ink text-cream">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 pb-10 pt-14 sm:px-6 md:grid-cols-[1.2fr_1fr_1fr_1.4fr]">
          <div>
            <p className="font-display max-w-[16rem] text-3xl leading-tight">Hecho con cariño para lectoras</p>
            <p className="mt-3 max-w-xs text-sm text-cream/75">Skins e inserts con diseños originales para tu e-reader.</p>
          </div>

          <div>
            <h3 className="font-display text-xl">Tienda</h3>
            <ul className="mt-3 space-y-2 text-[15px] font-semibold text-cream/85">
              <li><Link href="/tienda?cat=skins" className="marker hover:text-ink">Skins</Link></li>
              <li><Link href="/tienda?cat=inserts" className="marker hover:text-ink">Inserts</Link></li>
              <li><Link href="/tienda?cat=marcapaginas-magneticos" className="marker hover:text-ink">Marcapáginas</Link></li>
              <li><Link href="/tienda?cat=pegatinas" className="marker hover:text-ink">Pegatinas</Link></li>
              <li><Link href="/personalizadas" className="marker hover:text-ink">Skins personalizadas</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-display text-xl">Ayuda</h3>
            <ul className="mt-3 space-y-2 text-[15px] font-semibold text-cream/85">
              <li>Envíos</li>
              <li>Devoluciones</li>
              <li>¿Cuál es mi modelo?</li>
              <li>Contacto</li>
            </ul>
          </div>

          <div>
            <h3 className="font-display text-xl">Novedades y sorteos</h3>
            {sent ? (
              <p className="mt-3 text-[15px] font-semibold text-aqua">Gracias, te avisaremos de las novedades (demo)</p>
            ) : (
              <form
                className="mt-3 flex gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  setSent(true);
                }}
              >
                <label className="sr-only" htmlFor="nl-email">Correo electrónico</label>
                <input
                  id="nl-email"
                  type="email"
                  required
                  placeholder="tu@correo.com"
                  className="min-w-0 flex-1 rounded-full border-2 border-cream bg-ink px-4 py-2.5 text-sm text-cream placeholder:text-cream/55"
                />
                <button className="btn btn-aqua !px-4 !py-2.5">Unirme</button>
              </form>
            )}
            <p className="mt-6 text-sm font-semibold text-cream/70">Métodos de pago (demo)</p>
            <div className="mt-2 flex flex-wrap gap-2 text-xs font-bold">
              {["Visa", "Mastercard", "PayPal", "Bizum", "Apple Pay"].map((p) => (
                <span key={p} className="rounded-md border-2 border-cream/30 px-2.5 py-1">{p}</span>
              ))}
            </div>
          </div>
        </div>

        <div aria-hidden className="wordmark-rise font-display select-none whitespace-nowrap px-2 text-center text-[10.6vw] leading-[0.95] text-cream [text-shadow:0.04em_0.04em_0_var(--color-mauve)]">
          Chapter &amp; Bloom
        </div>
        <p className="border-t border-cream/15 px-4 py-4 text-center text-xs text-cream/65">
          © 2026 Chapter &amp; Bloom · Demo de diseño, los pedidos no son reales
        </p>
      </div>
    </footer>
  );
}
