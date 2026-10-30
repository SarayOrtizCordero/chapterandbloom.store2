"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import { categories, eur, kindLabel, productCover, searchProducts } from "@/lib/data";
import { Photo } from "./Photo";

/** Caja de búsqueda que se abre bajo la cabecera: escribes y ves resultados al momento. */
export const SearchPanel = forwardRef<HTMLDivElement, { onClose: () => void }>(function SearchPanel({ onClose }, ref) {
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const [q, setQ] = useState("");

  useEffect(() => {
    input.current?.focus();
  }, []);

  const results = useMemo(() => (q.trim() ? searchProducts(q) : []), [q]);
  const shown = results.slice(0, 5);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const term = q.trim();
    if (!term) return;
    router.push(`/tienda?q=${encodeURIComponent(term)}`);
    onClose();
  };

  return (
    <div ref={ref} id="buscador" className="sheet absolute inset-x-0 top-full max-h-[calc(100dvh-74px)] overflow-y-auto border-b-2 border-ink bg-cream shadow-[0_12px_0_-6px_rgb(49_42_68/0.12)]">
      <div className="mx-auto max-w-2xl px-4 pb-4 pt-3 sm:px-6">
        <form role="search" onSubmit={submit} className="flex gap-2">
          <label htmlFor="buscar-header" className="sr-only">
            Buscar productos
          </label>
          <input
            id="buscar-header"
            ref={input}
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Busca por nombre o libro"
            autoComplete="off"
            enterKeyHint="search"
            className="field min-w-0 flex-1 !py-2.5"
          />
          <button className="btn btn-primary !px-4 !py-2.5 !text-sm">Buscar</button>
        </form>

        <div aria-live="polite" className="mt-3">
          {!q.trim() ? (
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-hand text-xl font-bold leading-none">Mira por aquí:</span>
              {categories
                .filter((c) => !c.soon)
                .map((c) => (
                  <Link key={c.id} href={`/tienda?cat=${c.id}`} onClick={onClose} className="chip !px-3 !py-1 !text-[13px]">
                    {c.short}
                  </Link>
                ))}
            </div>
          ) : results.length === 0 ? (
            <p className="py-3 text-sm text-ink-soft">No hay nada con “{q.trim()}”. Prueba con otra palabra, como el nombre de un libro o “skin”.</p>
          ) : (
            <>
              <p className="sr-only">{results.length} resultados</p>
              <ul className="divide-y-2 divide-ink/10">
                {shown.map((p) => {
                  const cover = productCover(p);
                  return (
                    <li key={p.slug}>
                      <Link href={`/producto/${p.slug}`} onClick={onClose} className="flex items-center gap-3 py-2">
                        <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border-2 border-ink bg-mauve-soft">
                          <span className={`absolute inset-0 ${cover.kind === "spread" ? "scale-[1.28]" : ""}`}>
                            <Photo src={cover.src} size={640} alt="" fill sizes="56px" className="object-cover" />
                          </span>
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-bold leading-tight">{p.name}</span>
                          <span className="text-xs text-ink-soft">{kindLabel[p.kind]}</span>
                        </span>
                        <span className="shrink-0 rounded-full border-2 border-ink bg-aqua px-2.5 py-0.5 text-sm font-extrabold">
                          {p.hasFinish ? "Desde " : ""}
                          {eur(p.price)}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
              {results.length > shown.length && (
                <Link href={`/tienda?q=${encodeURIComponent(q.trim())}`} onClick={onClose} className="btn btn-aqua mt-3 w-full !py-2.5 !text-sm">
                  Ver los {results.length} resultados
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
});
