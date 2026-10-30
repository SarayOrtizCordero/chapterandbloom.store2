import Link from "next/link";
import type { Metadata } from "next";
import { CategoryArt } from "@/components/CategoryArt";
import { NotifyForm } from "@/components/NotifyForm";
import { ProductCard } from "@/components/ProductCard";
import { Reveal } from "@/components/Reveal";
import { categories, categoryById, products } from "@/lib/data";

export const metadata: Metadata = { title: "Tienda · Chapter & Bloom" };

const tilts = [-1, 0.8, -0.5, 1.2];

export default async function Shop({ searchParams }: { searchParams: Promise<{ cat?: string; q?: string; buscar?: string }> }) {
  const { cat, q, buscar } = await searchParams;
  const category = cat ? categoryById(cat) : undefined;
  const query = (q ?? "").trim().toLowerCase();

  const list = products.filter(
    (p) => (!category || p.category === category.id) && (!query || p.name.toLowerCase().includes(query)),
  );

  const chip = (active: boolean) => `chip ${active ? "is-on" : ""}`;

  return (
    <div className="paper overflow-x-clip">
      <div className="mx-auto max-w-7xl px-4 pb-24 pt-10 sm:px-6">
        <header className="mb-8">
          <h1 className="font-display text-5xl leading-none [text-shadow:3px_3px_0_var(--color-mauve)] sm:text-6xl">
            {category ? category.name : "Toda la tienda"}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-ink-soft">
            {category ? category.blurb : "Skins, inserts, marcapáginas y pegatinas para lectoras. Pronto, mucho más."}
          </p>
        </header>

        <nav className="mb-7 flex flex-wrap items-center gap-2.5" aria-label="Categorías">
          <Link href="/tienda" className={chip(!category)} aria-current={!category ? "page" : undefined}>
            Todo
          </Link>
          {categories.map((c) => (
            <Link key={c.id} href={`/tienda?cat=${c.id}`} className={chip(category?.id === c.id)} aria-current={category?.id === c.id ? "page" : undefined}>
              {c.short}
              {c.soon && <span className="rounded-full bg-aqua px-2 text-[11px] font-extrabold text-ink">pronto</span>}
            </Link>
          ))}
        </nav>

        <form id="buscar" action="/tienda" className="mb-10 flex max-w-md gap-3">
          {category && <input type="hidden" name="cat" value={category.id} />}
          <label htmlFor="q" className="sr-only">
            Buscar por nombre
          </label>
          <input id="q" name="q" defaultValue={q} autoFocus={buscar === "1"} placeholder="Busca por nombre" className="field min-w-0 flex-1" />
          <button className="btn btn-primary !px-6">Buscar</button>
        </form>

        {category?.soon ? (
          <div className="tile grid items-center gap-8 p-6 md:grid-cols-2 md:p-12">
            <CategoryArt id={category.id} className="h-64 rounded-2xl border-2 border-ink bg-mauve-soft" />
            <div className="space-y-4">
              <span className="inline-block rounded-full border-2 border-ink bg-aqua px-4 py-1 text-sm font-extrabold">Próximamente</span>
              <h2 className="font-display text-4xl leading-tight">{category.name}</h2>
              <p className="text-ink-soft">{category.blurb} Estamos preparando esta colección con mucho cariño.</p>
              <NotifyForm />
            </div>
          </div>
        ) : list.length === 0 ? (
          <div className="tile mx-auto max-w-lg p-8 text-center">
            <p className="font-display text-2xl">No hay nada con esa búsqueda</p>
            <p className="mt-2 text-ink-soft">Prueba con otra palabra o mira todo lo que tenemos.</p>
            <Link href="/tienda" className="btn btn-aqua mt-5">
              Ver toda la tienda
            </Link>
          </div>
        ) : (
          <>
            <p className="font-hand mb-6 text-2xl font-bold">
              {list.length} {list.length === 1 ? "producto" : "productos"}
            </p>
            <div className="grid auto-rows-fr grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-10">
              {list.map((p, i) => (
                <Reveal key={p.slug} delay={(i % 4) * 0.07} className="h-full min-w-0">
                  <ProductCard product={p} tilt={tilts[i % tilts.length]} />
                </Reveal>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
