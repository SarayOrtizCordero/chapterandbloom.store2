import Link from "next/link";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { Personalize } from "@/components/Personalize";
import { Photo } from "@/components/Photo";
import { ProductCard } from "@/components/ProductCard";
import { Reveal } from "@/components/Reveal";
import { Squiggle } from "@/components/Stickers";
import { categories, productBySlug, productCover, reviews } from "@/lib/data";

const featuredSlugs = [
  "lazos-coquette-skin",
  "acotar-skin",
  "spooky-book-club-insert",
  "jude-duarte-marcapaginas",
  "pack-4-hojas-pegatinas",
  "celestial-dreams-skin",
  "vampire-bite-insert",
  "cinnamon-cafe-skin",
];

const tilts = [-1.4, 1, -0.6, 1.6];
const noteTilts = [-2.2, 1.6, -1.2, 2.4];

export default function Home() {
  const featured = featuredSlugs.map((s) => productBySlug(s)!);
  const available = categories.filter((c) => !c.soon);
  const soon = categories.filter((c) => c.soon);

  return (
    <>
      <Hero />

      {/* Cinta sobre la unión entre el hero y las categorías */}
      <div aria-hidden className="relative z-10 -my-2 overflow-hidden py-5 [background:linear-gradient(var(--color-cream)_50%,var(--color-mauve)_50%)]">
        <div className="-mx-[3%] w-[106%] -rotate-[1.2deg] border-y-2 border-ink bg-ink py-2.5 text-cream">
          <Marquee className="font-display text-xl sm:text-2xl" items={["Kindle", "Kobo", "Onyx Boox", "Xteink", "Bigme", "A medida de tu modelo"]} />
        </div>
      </div>

      {/* Categorías */}
      <section data-tone="mauve" className="overflow-x-clip bg-mauve pb-20 pt-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-4xl leading-none sm:text-5xl">¿Qué buscas hoy?</h2>
              <Squiggle className="draw mt-3 h-4 w-32 text-ink" />
            </div>
            <Link href="/tienda" className="btn btn-ghost !px-5 !py-2.5 !text-sm">
              Ver toda la tienda
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-4 lg:gap-x-6">
            {available.map((c, i) => (
              <Reveal key={c.id} delay={i * 0.08} className="h-full">
                <Link href={`/tienda?cat=${c.id}`} className="group block h-full">
                  <article className="tile tile-hover h-full p-2.5 pb-4" style={{ ["--tilt" as string]: `${tilts[i % tilts.length]}deg` }}>
                    <div className="relative aspect-[4/5] overflow-hidden rounded-t-[999px] rounded-b-[14px] border-2 border-ink bg-mauve-soft">
                      {c.cover && (
                        <Photo
                          src={c.cover}
                          size={640}
                          alt=""
                          fill
                          sizes="(min-width: 1024px) 22vw, 45vw"
                          className="object-cover transition duration-500 group-hover:scale-110"
                        />
                      )}
                    </div>
                    <div className="mt-3 flex items-center justify-between gap-2 px-1.5">
                      <h3 className="font-display text-xl leading-tight sm:text-2xl">{c.name}</h3>
                      <span
                        aria-hidden
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-aqua transition duration-300 [transition-timing-function:var(--ease-stick)] group-hover:rotate-[-45deg] group-hover:scale-110"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12h14M13 6l6 6-6 6" />
                        </svg>
                      </span>
                    </div>
                    <p className="mt-1 line-clamp-2 px-1.5 text-sm text-ink-soft">{c.blurb}</p>
                  </article>
                </Link>
              </Reveal>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <p className="font-hand text-2xl font-bold">Muy pronto:</p>
            {soon.map((c) => (
              <Link
                key={c.id}
                href={`/tienda?cat=${c.id}`}
                className="rounded-full border-2 border-dashed border-ink px-4 py-1.5 text-sm font-bold transition hover:bg-cream"
              >
                {c.short}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Favoritas */}
      <section className="paper overflow-x-clip pb-4 pt-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-4xl leading-none sm:text-5xl">Las favoritas del momento</h2>
              <Squiggle className="draw mt-3 h-4 w-32 text-ink" />
            </div>
            <Link href="/tienda" className="btn btn-aqua !px-5 !py-2.5 !text-sm">
              Ver todo
            </Link>
          </div>
          <div className="grid auto-rows-fr grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-10">
            {featured.map((p, i) => (
              <Reveal key={p.slug} delay={(i % 4) * 0.07} className="h-full min-w-0">
                <ProductCard product={p} tilt={[-1, 0.8, -0.5, 1.2][i % 4]} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Personalize />

      {/* Reseñas */}
      <section className="paper overflow-x-clip pb-24 pt-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="font-display text-4xl leading-none sm:text-5xl">Lo que dicen las lectoras</h2>
          <Squiggle className="draw mt-3 h-4 w-32 text-ink" />
          <p className="mt-3 text-sm font-semibold text-ink-soft">Reseñas de ejemplo para la demo</p>
          <div className="mt-14 grid gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-12">
            {reviews.map((r, i) => {
              const p = productBySlug(r.slug)!;
              const cover = productCover(p);
              return (
                <Reveal key={r.name} delay={i * 0.08} className="h-full">
                  <figure
                    className="tile tile-hover relative h-full bg-cream p-3 pt-6"
                    style={{ ["--tilt" as string]: `${noteTilts[i % noteTilts.length]}deg`, borderRadius: 6 }}
                  >
                    <span aria-hidden className="absolute -top-3 left-1/2 z-10 h-6 w-20 -translate-x-1/2 -rotate-3 border-2 border-ink/25 bg-mauve" />
                    <Link href={`/producto/${p.slug}`} className="block">
                      <div className="relative aspect-[4/3] overflow-hidden border-2 border-ink bg-mauve-soft">
                        <div className={`absolute inset-0 ${cover.kind === "spread" ? "scale-[1.28]" : ""}`}>
                          <Photo src={cover.src} size={640} alt={p.name} fill sizes="(min-width: 1024px) 22vw, 45vw" className="object-cover" />
                        </div>
                      </div>
                    </Link>
                    <div className="px-2 pb-2">
                      <div aria-label={`${r.stars} de 5 estrellas`} className="mt-3 text-lg tracking-widest">
                        {"★".repeat(r.stars)}
                      </div>
                      <blockquote className="mt-1 leading-relaxed">“{r.text}”</blockquote>
                      <figcaption className="mt-4">
                        <span className="font-hand block text-2xl font-bold leading-none">{r.name}</span>
                        <span className="text-xs font-bold text-ink-soft">Compró {p.name}</span>
                      </figcaption>
                    </div>
                  </figure>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
