"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { useCart } from "@/lib/cart";
import { eur, finishById } from "@/lib/data";
import { CartThumb } from "./CartThumb";

export function CartDrawer() {
  const { items, open, setOpen, subtotal, setQty, remove } = useCart();

  const panel = useRef<HTMLElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const opener = document.activeElement as HTMLElement | null;
    closeBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return setOpen(false);
      if (e.key !== "Tab") return;
      // Atrapa el foco dentro del carrito mientras está abierto
      const f = panel.current?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])");
      if (!f?.length) return;
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      opener?.focus?.();
    };
  }, [open, setOpen]);

  return (
    <div className={`fixed inset-0 z-50 ${open ? "" : "pointer-events-none"}`} inert={!open}>
      <div
        className={`absolute inset-0 bg-ink/50 transition-opacity ${open ? "opacity-100" : "opacity-0"}`}
        onClick={() => setOpen(false)}
      />
      <aside
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label="Carrito"
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l-2 border-ink bg-cream shadow-pop transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between border-b-2 border-ink px-5 py-4">
          <h2 className="font-display text-3xl">Tu carrito</h2>
          <button ref={closeBtn} onClick={() => setOpen(false)} className="rounded-full p-3 hover:bg-mauve/60" aria-label="Cerrar carrito">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <p className="font-display text-xl">Tu carrito está vacío</p>
            <p className="text-ink-soft">Encuentra el diseño perfecto para tu e-reader.</p>
            <Link href="/tienda" onClick={() => setOpen(false)} className="btn btn-primary">
              Seguir comprando
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
              {items.map((i) => (
                <li key={i.id} className="item-in flex gap-3 rounded-2xl border-2 border-ink bg-paper p-3 shadow-[3px_3px_0_var(--color-mauve)]">
                  <CartThumb item={i} className="w-16 shrink-0 self-start" />
                  <div className="min-w-0 flex-1">
                    <p className="font-bold leading-tight">{i.name}</p>
                    {i.variant && <p className="text-xs text-ink-soft">{i.variant}</p>}
                    {i.model && <p className="text-xs text-ink-soft">{i.model}</p>}
                    {i.finish && <p className="text-xs text-ink-soft">Acabado: {finishById(i.finish).name}</p>}
                    {i.custom && (
                      <p className="truncate text-xs text-ink-soft">
                        {i.custom.files.length} imagen(es){i.custom.note ? " · con mensaje" : ""}
                      </p>
                    )}
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center rounded-full border-2 border-ink">
                        <button className="h-11 w-11 text-lg" aria-label="Quitar uno" onClick={() => setQty(i.id, i.qty - 1)}>
                          −
                        </button>
                        <span className="w-6 text-center text-sm font-bold">{i.qty}</span>
                        <button className="h-11 w-11 text-lg" aria-label="Añadir uno" onClick={() => setQty(i.id, i.qty + 1)}>
                          +
                        </button>
                      </div>
                      <p className="font-extrabold">{eur(i.unitPrice * i.qty)}</p>
                    </div>
                  </div>
                  <button className="-mr-1 -mt-1 self-start rounded-full p-3 text-ink-soft hover:text-ink" aria-label={`Eliminar ${i.name}`} onClick={() => remove(i.id)}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M6 6l12 12M18 6L6 18" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
            <div className="space-y-3 border-t-2 border-ink px-5 py-4">
              <div className="flex items-baseline justify-between">
                <span className="font-semibold">Subtotal</span>
                <span className="font-display text-3xl">{eur(subtotal)}</span>
              </div>
              <p className="text-xs text-ink-soft">Gastos de envío calculados al finalizar la compra. Esto es una demo: no se realiza ningún cobro.</p>
              <Link href="/checkout" onClick={() => setOpen(false)} className="btn btn-primary w-full">
                Finalizar compra
              </Link>
              <button onClick={() => setOpen(false)} className="w-full text-center text-sm font-semibold underline underline-offset-4">
                Seguir comprando
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
