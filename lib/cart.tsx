"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { FinishId, Img } from "./data";

export type CartItem = {
  id: string;
  name: string;
  /** Miniatura; si falta (p. ej. imagen personalizada tras recargar) se usa una ilustración */
  image?: Img | null;
  model?: string;
  finish?: FinishId;
  /** Color / versión elegida (p. ej. "Rosa") */
  variant?: string;
  unitPrice: number;
  qty: number;
  custom?: { files: string[]; note: string; kind: "skin" | "insert" };
};

type CartCtx = {
  items: CartItem[];
  count: number;
  subtotal: number;
  open: boolean;
  setOpen: (v: boolean) => void;
  /** Por defecto abre el carrito; con { open: false } se añade en silencio y sale un aviso */
  add: (item: Omit<CartItem, "id" | "qty"> & { qty?: number }, opts?: { open?: boolean }) => void;
  /** Último artículo añadido (para el aviso). n sube con cada alta */
  lastAdded: { name: string; n: number; silent: boolean } | null;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
};

const Ctx = createContext<CartCtx | null>(null);
const KEY = "cb-demo-cart-v2";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const [lastAdded, setLastAdded] = useState<CartCtx["lastAdded"]>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      // La vista previa de imágenes subidas no se guarda (solo el nombre de archivo).
      const slim = items.map((i) => (i.custom ? { ...i, image: null } : i));
      localStorage.setItem(KEY, JSON.stringify(slim));
    } catch {}
  }, [items, ready]);

  const add = useCallback<CartCtx["add"]>((item, opts) => {
    const qty = item.qty ?? 1;
    setItems((prev) => {
      if (!item.custom) {
        const same = prev.find(
          (p) => !p.custom && p.name === item.name && p.model === item.model && p.finish === item.finish && p.variant === item.variant,
        );
        if (same) return prev.map((p) => (p === same ? { ...p, qty: p.qty + qty } : p));
      }
      return [...prev, { ...item, qty, id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}` }];
    });
    setLastAdded((prev) => ({ name: item.name, n: (prev?.n ?? 0) + 1, silent: opts?.open === false }));
    if (opts?.open !== false) setOpen(true);
  }, []);

  const setQty = useCallback((id: string, qty: number) => {
    setItems((prev) => (qty <= 0 ? prev.filter((p) => p.id !== id) : prev.map((p) => (p.id === id ? { ...p, qty } : p))));
  }, []);
  const remove = useCallback((id: string) => setItems((prev) => prev.filter((p) => p.id !== id)), []);
  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<CartCtx>(
    () => ({
      items,
      count: items.reduce((n, i) => n + i.qty, 0),
      subtotal: items.reduce((n, i) => n + i.qty * i.unitPrice, 0),
      open,
      setOpen,
      add,
      lastAdded,
      setQty,
      remove,
      clear,
    }),
    [items, open, add, lastAdded, setQty, remove, clear],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart fuera de CartProvider");
  return c;
}
