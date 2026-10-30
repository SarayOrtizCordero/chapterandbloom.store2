"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart";

/** Aviso breve cuando algo se añade sin abrir el carrito (por ejemplo, desde las fichas) */
export function CartToast() {
  const { lastAdded, open, setOpen } = useCart();
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (!lastAdded?.silent) return;
    setShown(true);
    const t = setTimeout(() => setShown(false), 3800);
    return () => clearTimeout(t);
  }, [lastAdded]);

  const visible = shown && !open && lastAdded;

  return (
    <div role="status" aria-live="polite" className="pointer-events-none fixed inset-x-4 bottom-4 z-40 flex justify-center sm:inset-x-6 sm:justify-end">
      {visible && (
        <div
          key={lastAdded.n}
          className="item-in pointer-events-auto flex w-full max-w-sm items-center justify-between gap-4 rounded-2xl border-2 border-ink bg-cream px-4 py-3 shadow-[4px_4px_0_var(--color-mauve)]"
        >
          <p className="min-w-0 truncate text-sm font-bold">
            Añadido: <span className="font-extrabold">{lastAdded.name}</span>
          </p>
          <button
            type="button"
            onClick={() => {
              setShown(false);
              setOpen(true);
            }}
            className="btn btn-aqua shrink-0 !px-4 !py-1.5 !text-sm"
          >
            Ver carrito
          </button>
        </div>
      )}
    </div>
  );
}
