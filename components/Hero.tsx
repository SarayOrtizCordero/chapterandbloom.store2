"use client";

import Link from "next/link";
import { Fragment, useEffect, useRef, useState } from "react";
import { eur, productBySlug, productCover } from "@/lib/data";
import { optimized } from "@/lib/img";
import { Photo } from "./Photo";
import { Flower, HandArrow, Heart, Ribbon, Sparkle } from "./Stickers";

const slugs = [
  "lazos-coquette-skin",
  "acotar-skin",
  "celestial-dreams-skin",
  "enchanted-garden-skin",
  "cinnamon-cafe-skin",
  "emerald-bloom-skin",
];

const skins = slugs.map((s) => {
  const p = productBySlug(s)!;
  return { slug: p.slug, name: p.name, price: p.price, src: productCover(p).src };
});

/*
  Todas las imágenes de skin son la misma plantilla: trasera a la izquierda, e-reader de frente a la derecha.
  Estas fracciones recortan el e-reader de frente (para el hero) y un trozo del dibujo de la trasera (para las muestras).
*/
const FRONT = { x: 0.493, y: 0.161, w: 0.435, h: 0.65 };
const PATTERN = { x: 0.13, y: 0.3, s: 0.3 };

function Front({ src, alt }: { src: string; alt: string }) {
  return (
    <Photo
      src={src}
      size={1100}
      alt={alt}
      width={1100}
      height={1100}
      sizes="520px"
      priority
      style={{
        position: "absolute",
        maxWidth: "none",
        height: "auto",
        width: `${100 / FRONT.w}%`,
        left: `${(-FRONT.x / FRONT.w) * 100}%`,
        top: `${(-FRONT.y / FRONT.h) * 100}%`,
      }}
    />
  );
}

function Swatch({ src }: { src: string }) {
  return (
    <Photo
      src={src}
      size={640}
      alt=""
      width={640}
      height={640}
      sizes="80px"
      style={{
        position: "absolute",
        maxWidth: "none",
        height: "auto",
        width: `${100 / PATTERN.s}%`,
        left: `${(-PATTERN.x / PATTERN.s) * 100}%`,
        top: `${(-PATTERN.y / PATTERN.s) * 100}%`,
      }}
    />
  );
}

/** El e-reader sin vestir: aparece debajo de la primera skin y de cualquier skin anterior */
function Bare() {
  return (
    <div className="absolute inset-0 bg-ink">
      <div className="absolute left-[9.7%] top-[6%] h-[77.4%] w-[82.5%] rounded-[3%] bg-cream px-[8%] pt-[12%]">
        {[100, 92, 100, 78, 96, 88, 60].map((w, i) => (
          <div key={i} className="mb-[5.5%] h-[1.6%] rounded-full bg-mauve" style={{ width: `${w}%` }} />
        ))}
      </div>
    </div>
  );
}

export function Hero() {
  const [cur, setCur] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [turn, setTurn] = useState(0);
  const stage = useRef<HTMLDivElement>(null);
  const skin = skins[cur];

  // Precarga las demás para que el cambio de skin sea inmediato
  useEffect(() => {
    skins.forEach((s) => {
      const im = new Image();
      im.src = optimized(s.src, 1100);
    });
  }, []);

  // Las pegatinas siguen un poco al cursor (solo con ratón)
  useEffect(() => {
    const el = stage.current;
    if (!el || !window.matchMedia("(pointer: fine) and (prefers-reduced-motion: no-preference)").matches) return;
    let raf = 0;
    const move = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.setProperty("--mx", String((e.clientX / window.innerWidth - 0.5) * 2));
        el.style.setProperty("--my", String((e.clientY / window.innerHeight - 0.5) * 2));
      });
    };
    window.addEventListener("pointermove", move);
    return () => {
      window.removeEventListener("pointermove", move);
      cancelAnimationFrame(raf);
    };
  }, []);

  const choose = (i: number) => {
    if (i === cur) return;
    setPrev(cur);
    setCur(i);
    setTurn((t) => t + 1);
  };

  const first = turn === 0;

  return (
    <section className="paper relative overflow-hidden">
      <div className="mx-auto grid max-w-7xl items-center gap-x-10 gap-y-8 px-4 pb-16 pt-8 sm:px-6 md:grid-cols-[1.05fr_1fr] md:pb-24 md:pt-10">
        <div className="relative z-10">
          <h1 className="font-display text-[clamp(2.6rem,6.2vw,5.2rem)] leading-[1.02] [text-shadow:3px_3px_0_var(--color-mauve)] sm:[text-shadow:4px_4px_0_var(--color-mauve)]">
            {["Dale", "un", "nuevo", "capítulo", "a", "tu", "e-reader"].map((w, i) => (
              <Fragment key={w}>
                <span className="word-in" style={{ ["--i" as string]: i }}>
                  {w}
                </span>{" "}
              </Fragment>
            ))}
          </h1>
          <p className="mt-5 max-w-[34rem] text-lg text-ink-soft">
            Skins, inserts, marcapáginas magnéticos y pegatinas con diseños originales, a medida de tu Kindle, Kobo, Boox, Xteink o Bigme.
          </p>
          <div className="mt-7 flex flex-wrap gap-4">
            <Link href="/tienda?cat=skins" className="btn btn-primary !px-7 !py-3.5 !text-base">
              Ver skins
            </Link>
            <Link href="/personalizadas" className="btn btn-aqua !px-7 !py-3.5 !text-base">
              Crear la mía
            </Link>
          </div>
        </div>

        <div className="mx-auto w-full max-w-[460px]">
          <div ref={stage} className="relative mx-auto aspect-[1/1.08] w-full">
            {/* Ventana en arco */}
            <div style={{ ["--to" as string]: "-8px" }} className="scroll-rise absolute inset-x-[7%] bottom-0 top-[2%] rounded-t-[999px] rounded-b-[28px] border-2 border-ink bg-mauve shadow-[6px_6px_0_var(--color-ink)]" />

            {/* E-reader: al bajar, sale un poco del arco */}
            <div className="scroll-rise absolute inset-0" style={{ ["--to" as string]: "-40px" }}>
            <div className="absolute left-1/2 top-[12%] w-[54%] -translate-x-1/2 rotate-[-3.5deg]">
              <div
                className="relative aspect-[0.669] overflow-hidden rounded-[7%/5%] border-[3px] border-cream bg-ink shadow-[8px_9px_0_var(--color-ink)]"
                style={{ ["--peel-delay" as string]: first ? "0.5s" : "0s" }}
              >
                {prev === null ? <Bare /> : <Front src={skins[prev].src} alt="" />}
                <div key={turn} className="peel-top absolute inset-0">
                  <Front src={skin.src} alt={`${skin.name}: skin sobre un e-reader`} />
                </div>
                <div key={`e${turn}`} className="peel-edge absolute inset-0" />
              </div>
            </div>

            </div>

            {/* Pegatinas */}
            <div className="scroll-rise parallax absolute -left-[2%] top-[4%] w-[17%]" style={{ ["--k" as string]: 14, ["--to" as string]: "-48px" }}>
              <div className="sticker-in" style={{ ["--d" as string]: "1.3s" }}>
                <Ribbon className="sticker-bob w-full rotate-[-12deg]" />
              </div>
            </div>
            <div className="scroll-rise parallax absolute -right-[3%] top-[0%] w-[24%]" style={{ ["--k" as string]: -20, ["--to" as string]: "-22px" }}>
              <div className="sticker-in" style={{ ["--d" as string]: "1.45s" }}>
                <Sparkle className="sticker-bob w-full" style={{ ["--bd" as string]: "-1s" }} />
              </div>
            </div>
            <div className="scroll-rise parallax absolute -left-[4%] top-[50%] w-[18%]" style={{ ["--k" as string]: 24, ["--to" as string]: "-56px" }}>
              <div className="sticker-in" style={{ ["--d" as string]: "1.6s" }}>
                <Heart className="sticker-bob w-full -rotate-12" style={{ ["--bd" as string]: "-2.5s" }} />
              </div>
            </div>
            <div className="scroll-rise parallax absolute -right-[2%] bottom-[16%] w-[22%]" style={{ ["--k" as string]: -16, ["--to" as string]: "-30px" }}>
              <div className="sticker-in" style={{ ["--d" as string]: "1.75s" }}>
                <Flower className="sticker-bob w-full" style={{ ["--bd" as string]: "-3.5s" }} />
              </div>
            </div>
            <div className="scroll-rise parallax absolute left-[27%] top-[-3%] w-[9%]" style={{ ["--k" as string]: 30, ["--to" as string]: "-64px" }}>
              <div className="sticker-in" style={{ ["--d" as string]: "1.9s" }}>
                <Sparkle className="sticker-bob w-full" fill="var(--color-cream)" style={{ ["--bd" as string]: "-4.5s" }} />
              </div>
            </div>
          </div>

          {/* Muestras: eligen la skin del e-reader */}
          <div className="mt-6">
            <p className="font-hand mb-4 flex items-end gap-2 pl-5 text-2xl font-bold leading-none" aria-hidden>
              <HandArrow className="h-9 w-12 -scale-x-100 -translate-y-0.5" />
              elige la tuya
            </p>
            <div role="group" aria-label="Elige una skin" className="grid grid-cols-6 gap-2.5">
              {skins.map((s, i) => (
                <button
                  key={s.slug}
                  type="button"
                  onClick={() => choose(i)}
                  aria-pressed={i === cur}
                  aria-label={s.name}
                  title={s.name}
                  className={`relative aspect-square overflow-hidden rounded-2xl border-2 border-ink bg-mauve transition duration-300 [transition-timing-function:var(--ease-stick)] ${
                    i === cur ? "-translate-y-1.5 rotate-[-4deg] shadow-[0_0_0_3px_var(--color-aqua),0_0_0_5px_var(--color-ink)]" : "hover:-translate-y-1 hover:rotate-2"
                  }`}
                >
                  <Swatch src={s.src} />
                </button>
              ))}
            </div>
            <div className="mt-5 flex items-center justify-between gap-4">
              <div aria-live="polite">
                <p className="font-display text-2xl leading-tight">{skin.name}</p>
                <p className="text-sm font-bold text-ink-soft">Desde {eur(skin.price)}</p>
              </div>
              <Link href={`/producto/${skin.slug}`} className="btn btn-ghost shrink-0 !px-5 !py-2.5 !text-sm">
                Ver esta skin
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
