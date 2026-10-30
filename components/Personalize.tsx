"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { eur, finishById, finishes, HOLO_EXTRA, PRICES, type FinishId } from "@/lib/data";
import { FinishFx } from "./finish";
import { Squiggle } from "./Stickers";

const steps = ["Elige tu e-reader y el acabado", "Sube tu diseño (hasta 2 imágenes)", "Cuéntanos cómo lo quieres"];

export function Personalize() {
  const [finish, setFinish] = useState<FinishId>("stars");
  const [lit, setLit] = useState(false);
  const list = useRef<HTMLOListElement>(null);
  const f = finishById(finish);

  // Los pasos se encienden uno tras otro cuando llegan a pantalla
  useEffect(() => {
    const el = list.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setLit(true);
          io.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section data-tone="ink" className="mt-24 border-y-2 border-ink bg-ink text-cream">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
        <div>
          <h2 className="font-display text-4xl leading-[1.05] sm:text-5xl">Crea tu skin en 3 pasos</h2>
          <Squiggle className="draw mt-3 h-4 w-32 text-aqua" />
          <p className="mt-4 max-w-md text-cream/80">
            Skin desde {eur(PRICES.customSkin)} e insert desde {eur(PRICES.customInsert)}, con acabado mate o brillante. Los holográficos suman {eur(HOLO_EXTRA)}.
          </p>

          <ol ref={list} className={`mt-8 ${lit ? "lit" : ""}`}>
            {steps.map((t, i) => (
              <li key={t} className="relative flex items-center gap-4 pb-7 last:pb-0" style={{ ["--d" as string]: `${i * 0.55}s` }}>
                {i < steps.length - 1 && (
                  <span aria-hidden className="step-line absolute left-[19px] top-10 h-[calc(100%-2.5rem)] w-0.5 bg-aqua" style={{ ["--d" as string]: `${i * 0.55 + 0.3}s` }} />
                )}
                <span
                  className="step-dot relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-cream text-lg font-extrabold"
                  style={{ ["--d" as string]: `${i * 0.55}s` }}
                >
                  {i + 1}
                </span>
                <span className="step-text text-lg font-bold" style={{ ["--d" as string]: `${i * 0.55}s` }}>
                  {t}
                </span>
              </li>
            ))}
          </ol>

          <Link href="/personalizadas" className="btn btn-aqua mt-9 !px-7 !py-3.5 !text-base">
            Crear mi skin
          </Link>
        </div>

        <div className="mx-auto w-full max-w-[520px] rounded-[26px] border-2 border-ink bg-cream p-4 text-ink shadow-[8px_8px_0_var(--color-mauve)] sm:p-5">
          <div key={finish} className="fx-in relative aspect-[4/3] overflow-hidden rounded-2xl border-2 border-ink bg-mauve-soft">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={f.thumb} alt={`Muestra del acabado ${f.name}`} className="h-full w-full object-cover" />
            <FinishFx finish={f.id} animate />
          </div>
          <div className="mt-4 flex items-start justify-between gap-3" aria-live="polite">
            <div>
              <p className="font-display text-2xl leading-tight">{f.name}</p>
              <p className="text-sm text-ink-soft">{f.desc}</p>
            </div>
            <span className="shrink-0 rounded-full border-2 border-ink bg-aqua px-3 py-1 text-sm font-extrabold">
              {f.holo ? `+${eur(HOLO_EXTRA)}` : "Incluido"}
            </span>
          </div>
          <div role="group" aria-label="Elige un acabado" className="mt-4 grid grid-cols-6 gap-2">
            {finishes.map((x) => (
              <button
                key={x.id}
                type="button"
                onClick={() => setFinish(x.id)}
                aria-pressed={x.id === finish}
                aria-label={x.name}
                title={x.name}
                className={`relative aspect-square overflow-hidden rounded-xl border-2 border-ink transition duration-300 [transition-timing-function:var(--ease-stick)] ${
                  x.id === finish ? "-translate-y-1 rotate-[-4deg] shadow-[0_0_0_3px_var(--color-aqua),0_0_0_5px_var(--color-ink)]" : "hover:-translate-y-0.5 hover:rotate-2"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={x.thumb} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
