"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart";

const nav = [
  { label: "Inicio", href: "/" },
  { label: "Skins", href: "/tienda?cat=skins" },
  { label: "Inserts", href: "/tienda?cat=inserts" },
  { label: "Marcapáginas", href: "/tienda?cat=marcapaginas-magneticos" },
  { label: "Pegatinas", href: "/tienda?cat=pegatinas" },
];

/** Si el enlace lleva a la página en la que ya estás, sube al inicio en lugar de no hacer nada */
function toTopIfHere(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
  if (window.location.pathname + window.location.search !== href) return;
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: "auto" }); // "auto" respeta el scroll suave del CSS y el modo de menos movimiento
}

export function Header() {
  const { count, setOpen } = useCart();
  const [menu, setMenu] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (!menu) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenu(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menu]);

  return (
    <header className="sticky top-0 z-40 border-b-2 border-ink bg-cream/95 backdrop-blur">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" aria-label="Chapter & Bloom, inicio" className="shrink-0" onClick={(e) => {
            toTopIfHere(e, "/");
            setMenu(false);
          }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/logo.png" alt="Chapter & Bloom" className="h-[60px] w-auto transition-transform duration-300 hover:-rotate-3 hover:scale-105" />
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Principal">
          {nav.map((n) => (
            <Link key={n.label} href={n.href} onClick={(e) => toTopIfHere(e, n.href)} aria-current={n.href === "/" && pathname === "/" ? "page" : undefined} className="marker px-1 py-1 text-[15px] font-extrabold">
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <Link href="/personalizadas" onClick={(e) => toTopIfHere(e, "/personalizadas")} className="btn btn-aqua mr-1 hidden !px-4 !py-2 !text-sm lg:inline-flex">
            Crea la tuya
          </Link>
          <Link href="/tienda?buscar=1" className="flex h-11 w-11 items-center justify-center rounded-full transition hover:bg-mauve/60" aria-label="Buscar">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3.5-3.5" />
            </svg>
          </Link>
          <button
            className="relative flex h-11 w-11 items-center justify-center rounded-full transition hover:bg-mauve/60"
            aria-label={`Abrir carrito, ${count} artículos`}
            onClick={() => setOpen(true)}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 8h14l-1.2 11.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8L5 8z" />
              <path d="M9 8V6a3 3 0 0 1 6 0v2" />
            </svg>
            {count > 0 && (
              <span key={count} className="pop absolute right-0 top-0 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-ink bg-aqua px-1 text-[11px] font-extrabold leading-none">
                {count}
              </span>
            )}
          </button>
          <button
            className="flex h-11 w-11 items-center justify-center rounded-full lg:hidden"
            aria-label={menu ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={menu}
            aria-controls="menu-movil"
            onClick={() => setMenu((v) => !v)}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              {menu ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>

      {menu && (
        <nav id="menu-movil" className="sheet absolute inset-x-0 top-full border-b-2 border-ink bg-mauve px-4 pb-6 pt-3 lg:hidden" aria-label="Móvil">
          {nav.map((n, i) => (
            <Link
              key={n.label}
              href={n.href}
              onClick={(e) => {
                toTopIfHere(e, n.href);
                setMenu(false);
              }}
              style={{ ["--d" as string]: `${0.08 + i * 0.05}s` }}
              className="font-display block border-b-2 border-ink/15 py-3 text-3xl"
            >
              {n.label}
            </Link>
          ))}
          <Link
            href="/personalizadas"
            onClick={(e) => {
              toTopIfHere(e, "/personalizadas");
              setMenu(false);
            }}
            style={{ ["--d" as string]: "0.32s" }} className="btn btn-primary mt-5 w-full !shadow-[3px_3px_0_var(--color-cream)]">
            Crea la tuya
          </Link>
        </nav>
      )}
    </header>
  );
}
