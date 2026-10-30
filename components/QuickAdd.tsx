"use client";

import Link from "next/link";
import { useRef, useState, type MouseEvent } from "react";
import { useCart } from "@/lib/cart";
import { productCover, unitPrice, type Product } from "@/lib/data";
import { flyToCart } from "@/lib/fly";
import { optimized } from "@/lib/img";

/**
 * Botón sobre la foto de la ficha. Marcapáginas y pegatinas se añaden directamente;
 * las skins e inserts necesitan modelo, así que llevan a la ficha para elegirlo.
 */
export function QuickAdd({ product }: { product: Product }) {
  const { add } = useCart();
  const [done, setDone] = useState(false);
  const busy = useRef(false);

  if (product.needsDevice) {
    return (
      <Link
        href={`/producto/${product.slug}`}
        className="pointer-events-auto absolute bottom-2 right-2 rounded-full border-2 border-ink bg-cream px-3 py-1 text-xs font-extrabold shadow-[2px_2px_0_var(--color-ink)] transition hover:-translate-y-0.5 hover:bg-aqua"
      >
        Elegir modelo
      </Link>
    );
  }

  const cover = productCover(product);
  const variant = product.variants?.options[0];

  const onClick = (e: MouseEvent<HTMLButtonElement>) => {
    if (busy.current) return;
    busy.current = true;
    const button = e.currentTarget;
    const card = button.closest("article");
    flyToCart([card?.querySelector("[data-card-image]"), button], optimized(cover.src, 640), () => {
      add(
        {
          name: product.name,
          image: { src: cover.src, kind: "plain" },
          variant: variant?.label,
          unitPrice: unitPrice(product),
        },
        { open: false },
      );
      setDone(true);
      setTimeout(() => {
        setDone(false);
        busy.current = false;
      }, 1400);
    });
  };

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={done ? `${product.name} añadido al carrito` : `Añadir ${product.name} al carrito`}
      className={`pointer-events-auto absolute bottom-2 right-2 flex h-11 w-11 items-center justify-center rounded-full border-2 border-ink shadow-[2px_2px_0_var(--color-ink)] transition duration-300 [transition-timing-function:var(--ease-stick)] hover:-translate-y-0.5 hover:rotate-6 active:translate-y-0.5 active:shadow-none ${
        done ? "scale-110 bg-ink text-aqua" : "bg-aqua text-ink"
      }`}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        {done ? <path d="M5 12.5l4.5 4.5L19 7.5" /> : <path d="M12 5v14M5 12h14" />}
      </svg>
    </button>
  );
}
