"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useCart } from "@/lib/cart";
import { categoryById, eur, finishById, kindLabel, unitPrice, type FinishId, type Img, type Product } from "@/lib/data";
import { flyToCart } from "@/lib/fly";
import { optimized } from "@/lib/img";
import { Gallery } from "./Gallery";
import { FinishPicker, ModelPicker } from "./Pickers";

const bullets: Record<Product["kind"], string[]> = {
  skin: ["Vinilo de calidad premium", "Se retira sin dejar residuos", "Fácil de colocar y recolocar", "Corte exacto a tu modelo"],
  insert: ["Impresión de calidad", "Cortado a medida de tu modelo", "Se ve a través de tu funda transparente", "Acabado mate, brillante u holográfico"],
  bookmark: ["Magnético: se queda en su sitio", "Diseño original de Chapter & Bloom", "Tamaño perfecto para tus libros"],
  stickers: ["Cuatro hojas por pack", "Pegatinas Flork para decorar lo que quieras", "Las hojas pueden variar entre packs"],
};

export function ProductView({ product }: { product: Product }) {
  const { add } = useCart();
  const [variantId, setVariantId] = useState(product.variants?.options[0].id ?? "");
  const [model, setModel] = useState("");
  const [finish, setFinish] = useState<FinishId>("matte");
  const [qty, setQty] = useState(1);
  const [error, setError] = useState(false);
  const buyRef = useRef<HTMLButtonElement>(null);
  const adding = useRef(false);
  const [buyVisible, setBuyVisible] = useState(true);

  // En móvil, muestra una barra de compra fija mientras el botón principal queda fuera de pantalla
  useEffect(() => {
    const el = buyRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setBuyVisible(e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const variant = product.variants?.options.find((o) => o.id === variantId);
  const images = variant?.images ?? product.images;
  const portrait = product.kind === "bookmark" || product.kind === "stickers";
  const category = categoryById(product.category);

  // Imagen sobre la que se previsualiza cada acabado
  const fxImage = useMemo<Img | null>(
    () => (product.hasFinish ? (images.find((i) => i.kind === "spread") ?? images[0]) : null),
    [images, product.hasFinish],
  );

  // Precarga las imágenes de todos los colores/versiones para que el cambio sea instantáneo
  useEffect(() => {
    const srcs = [...product.images, ...(product.variants?.options.flatMap((o) => o.images) ?? [])].map((i) => optimized(i.src, 1100));
    new Set(srcs).forEach((s) => {
      const im = new Image();
      im.src = s;
    });
  }, [product]);

  const price = unitPrice(product, product.hasFinish ? finish : undefined);

  const submit = () => {
    if (product.needsDevice && !model) {
      setError(true);
      document.getElementById("model")?.focus();
      return;
    }
    if (adding.current) return;
    adding.current = true;
    const cover = fxImage ?? images[0];
    const item = {
      name: product.name,
      image: product.hasFinish ? cover : { src: cover.src, kind: "plain" as const },
      model: product.needsDevice ? model : undefined,
      finish: product.hasFinish ? finish : undefined,
      variant: variant?.label,
      unitPrice: price,
      qty,
    };
    // La foto vuela hasta el carrito y, al llegar, se añade y se abre el panel
    flyToCart([document.querySelector("[data-fly-source]"), buyRef.current], optimized(cover.src, 640), () => {
      add(item);
      adding.current = false;
    });
  };

  return (
    <div className="flex flex-col gap-8 lg:grid lg:grid-cols-[1.05fr_1fr] lg:gap-14">
      {/* En móvil, volver va arriba del todo */}
      <Link href={`/tienda?cat=${product.category}`} className="marker self-start px-1 text-sm font-extrabold lg:hidden">
        ← {category?.name}
      </Link>

      {/* La imagen se queda fija solo en escritorio; en móvil y tablet se va con la página */}
      <div className="sm:mx-auto sm:w-full sm:max-w-[560px] lg:sticky lg:top-28 lg:mx-0 lg:max-w-none lg:self-start">
        <Gallery key={variantId} images={images} alt={product.name} finish={product.hasFinish ? finish : undefined} portrait={portrait} />
      </div>

      <div className="space-y-7">
        <div>
          <Link href={`/tienda?cat=${product.category}`} className="marker hidden px-1 text-sm font-extrabold lg:inline-block">
            ← {category?.name}
          </Link>
          <p className="lg:mt-5">
            <span className="inline-block rounded-lg border-2 border-ink bg-aqua px-2.5 py-0.5 text-xs font-extrabold">{kindLabel[product.kind]}</span>
          </p>
          <h1 className="font-display mt-3 text-4xl leading-[1.05] [text-shadow:3px_3px_0_var(--color-mauve)] sm:text-5xl">{product.name}</h1>
          <p className="mt-4 flex flex-wrap items-center gap-3">
            <span className="font-display text-4xl">{eur(price)}</span>
            {product.hasFinish && finishById(finish).holo && (
              <span className="rounded-full border-2 border-ink bg-aqua px-3 py-0.5 text-xs font-extrabold">incluye acabado holográfico</span>
            )}
          </p>
          <p className="mt-4 max-w-prose text-lg text-ink-soft">{product.description}</p>
        </div>

        {product.variants && (
          <fieldset>
            <legend className="mb-3 font-extrabold">
              {product.variants.label}: <span className="font-medium">{variant?.label}</span>
            </legend>
            <div role="radiogroup" aria-label={product.variants.label} className="flex flex-wrap gap-3">
              {product.variants.options.map((o) => {
                const active = o.id === variantId;
                return o.swatch ? (
                  <button
                    key={o.id}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    aria-label={o.label}
                    title={o.label}
                    onClick={() => setVariantId(o.id)}
                    className={`h-11 w-11 rounded-full border-2 border-ink p-0.5 transition duration-300 [transition-timing-function:var(--ease-stick)] ${
                      active ? "scale-110 shadow-[0_0_0_3px_var(--color-aqua),0_0_0_5px_var(--color-ink)]" : "hover:-translate-y-0.5 hover:scale-105"
                    }`}
                  >
                    <span className="block h-full w-full rounded-full border-2 border-ink/20" style={{ background: o.swatch }} />
                  </button>
                ) : (
                  <button key={o.id} type="button" role="radio" aria-checked={active} onClick={() => setVariantId(o.id)} className={`chip !px-4 !py-2 ${active ? "is-on" : ""}`}>
                    {o.label}
                  </button>
                );
              })}
            </div>
          </fieldset>
        )}

        {product.needsDevice && (
          <ModelPicker
            model={model}
            error={error}
            onModel={(m) => {
              setModel(m);
              setError(false);
            }}
          />
        )}

        {product.hasFinish && <FinishPicker value={finish} onChange={setFinish} image={fxImage} />}

        <div className="flex flex-wrap items-center gap-4 pt-2">
          <div className="flex items-center rounded-full border-2 border-ink bg-paper shadow-[3px_3px_0_var(--color-mauve)]">
            <button type="button" className="h-12 w-12 rounded-full text-xl font-bold transition hover:bg-aqua" aria-label="Menos" onClick={() => setQty((q) => Math.max(1, q - 1))}>
              −
            </button>
            <span className="w-8 text-center font-extrabold" aria-live="polite">
              {qty}
            </span>
            <button type="button" className="h-12 w-12 rounded-full text-xl font-bold transition hover:bg-aqua" aria-label="Más" onClick={() => setQty((q) => q + 1)}>
              +
            </button>
          </div>
          <button ref={buyRef} type="button" onClick={submit} className="btn btn-primary min-w-0 flex-1 !py-3.5 text-base">
            Añadir al carrito · {eur(price * qty)}
          </button>
        </div>

        {!buyVisible && (
          <div className="fixed inset-x-0 bottom-0 z-30 border-t-2 border-ink bg-cream/95 p-3 backdrop-blur lg:hidden">
            <button type="button" onClick={submit} className="btn btn-primary w-full !py-3.5 text-base">
              Añadir al carrito · {eur(price * qty)}
            </button>
          </div>
        )}

        <div className="rounded-2xl border-2 border-ink bg-aqua-soft p-5">
          <p className="font-hand text-2xl font-bold leading-none">Lo que tienes que saber</p>
          <ul className="mt-3 space-y-2 text-[15px]">
            {bullets[product.kind].map((b) => (
              <li key={b} className="flex items-start gap-2.5">
                <svg width="16" height="16" viewBox="0 0 100 100" className="mt-1 shrink-0" aria-hidden>
                  <path d="M50 5C54 34 66 46 95 50 66 54 54 66 50 95 46 66 34 54 5 50 34 46 46 34 50 5Z" fill="var(--color-aqua)" stroke="var(--color-ink)" strokeWidth="9" strokeLinejoin="round" />
                </svg>
                {b}
              </li>
            ))}
          </ul>
          {product.needsDevice && <p className="mt-4 text-sm text-ink-soft">Solo decorativa: no es una funda de protección. Los colores pueden variar según la pantalla.</p>}
        </div>
      </div>
    </div>
  );
}
