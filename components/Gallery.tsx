"use client";

import { useEffect, useRef, useState } from "react";
import { finishById, type FinishId, type Img } from "@/lib/data";
import { FinishFx } from "./finish";
import { Photo } from "./Photo";

export function Gallery({
  images,
  alt,
  finish,
  portrait = false,
}: {
  images: Img[];
  alt: string;
  finish?: FinishId;
  portrait?: boolean;
}) {
  const [i, setI] = useState(0);
  const [rendering, setRendering] = useState(false);
  const first = useRef(true);
  const idx = Math.min(i, images.length - 1);
  const main = images[idx];

  // Al cambiar de acabado: "generando vista previa…" un instante y luego "vista previa"
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    setRendering(true);
    const t = setTimeout(() => setRendering(false), 650);
    return () => clearTimeout(t);
  }, [finish]);

  const showFx = finish && main.kind === "spread";

  return (
    <div>
      <div className={`relative overflow-hidden rounded-[24px] border-2 border-ink bg-paper shadow-[6px_6px_0_var(--color-mauve)] ${portrait ? "aspect-[4/5]" : "aspect-square"}`}>
        {/* Todas las imágenes están montadas: al cambiar solo se alterna la visibilidad (sin esperas) */}
        {images.map((img, k) => (
          <Photo
            key={img.src}
            src={img.src}
            size={1100}
            alt={k === idx ? alt : ""}
            fill
            priority={k === 0}
            sizes="(min-width: 1024px) 560px, 100vw"
            aria-hidden={k !== idx}
            className={`object-cover transition-opacity duration-300 ${k === idx ? "opacity-100" : "opacity-0"}`}
          />
        ))}

        {showFx && (
          /* Capa de acabado solo sobre la zona donde está la skin; entra con un fundido */
          <div
            key={finish}
            className={`fx-in absolute overflow-hidden rounded-[3%] ${rendering ? "opacity-60" : ""}`}
            style={{ left: "9%", top: "16%", width: "84%", height: "65%" }}
          >
            <FinishFx finish={finish} animate />
          </div>
        )}

        {showFx && (
          <p
            role="status"
            className="absolute left-3 top-3 flex items-center gap-2 rounded-full border-2 border-ink bg-cream px-3 py-1.5 text-xs font-extrabold"
          >
            <span className={`h-2.5 w-2.5 rounded-full border-2 border-ink bg-aqua ${rendering ? "animate-pulse" : ""}`} aria-hidden />
            {finishById(finish).name} · {rendering ? "generando vista previa…" : "vista previa"}
          </p>
        )}
      </div>

      {images.length > 1 && (
        <ul className="mt-3 flex gap-3.5 overflow-x-auto p-2">
          {images.map((img, k) => (
            <li key={img.src} className="shrink-0">
              <button
                type="button"
                onClick={() => setI(k)}
                aria-label={`Ver imagen ${k + 1}`}
                aria-current={k === idx}
                className={`relative block h-20 w-20 overflow-hidden rounded-xl border-2 border-ink bg-paper transition duration-300 [transition-timing-function:var(--ease-stick)] ${
                  k === idx ? "-rotate-3 shadow-[0_0_0_3px_var(--color-aqua),0_0_0_5px_var(--color-ink)]" : "opacity-75 hover:-translate-y-0.5 hover:rotate-2 hover:opacity-100"
                }`}
              >
                <Photo src={img.src} size={640} alt="" fill sizes="80px" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
