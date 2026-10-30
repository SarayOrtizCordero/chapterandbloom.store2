import Link from "next/link";
import { eur, productCover, type Product } from "@/lib/data";
import { Photo } from "./Photo";
import { QuickAdd } from "./QuickAdd";

const tag: Record<Product["kind"], string> = {
  skin: "Skin",
  insert: "Insert",
  bookmark: "Marcapáginas",
  stickers: "Pegatinas",
};

export function ProductCard({ product, tilt = 0 }: { product: Product; tilt?: number }) {
  const cover = productCover(product);
  const swatches = product.variants?.options.filter((o) => o.swatch);
  return (
    <div className="group h-full pt-3">
      <article className="tile tile-hover relative h-full p-2.5 pb-3.5" style={{ ["--tilt" as string]: `${tilt}deg` }}>
        <Link href={`/producto/${product.slug}`} className="block">
          <div data-card-image className="relative aspect-square overflow-hidden rounded-[14px] bg-mauve-soft">
            {/* Los diseños de skin vienen en un cuadrado con mucho blanco arriba y abajo: se amplían para llenar la ficha */}
            <div className={`absolute inset-0 ${cover.kind === "spread" ? "scale-[1.28]" : ""}`}>
              <Photo
                src={cover.src}
                size={640}
                alt={product.name}
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                className="object-cover transition duration-500 group-hover:scale-105"
              />
            </div>
            {product.badge && (
              <span className="absolute right-2 top-2 rounded-full border-2 border-ink bg-cream px-2.5 py-0.5 text-xs font-extrabold">{product.badge}</span>
            )}
          </div>
          <div className="mt-3 flex flex-wrap items-start justify-between gap-x-3 gap-y-1.5 px-1.5">
            <h3 className="min-w-[7rem] flex-1 font-bold leading-snug">{product.name}</h3>
            <span className="shrink-0 rounded-full border-2 border-ink bg-aqua px-2.5 py-0.5 text-sm font-extrabold leading-snug">
              {product.hasFinish ? "Desde " : ""}
              {eur(product.price)}
            </span>
          </div>
          {swatches && (
            <span className="mt-2 flex gap-1 px-1.5" aria-hidden>
              {swatches.map((o) => (
                <span key={o.id} className="h-4 w-4 rounded-full border-2 border-ink" style={{ background: o.swatch }} />
              ))}
            </span>
          )}
        </Link>

        <span className="pointer-events-none absolute -top-3 left-4 z-10 rounded-lg border-2 border-ink bg-aqua px-2.5 py-0.5 text-xs font-extrabold leading-tight">
          {tag[product.kind]}
        </span>

        {/* Capa del tamaño de la foto para colocar el botón sin meterlo dentro del enlace */}
        <div className="pointer-events-none absolute inset-x-2.5 top-2.5 z-10 aspect-square">
          <QuickAdd product={product} />
        </div>
      </article>
    </div>
  );
}
