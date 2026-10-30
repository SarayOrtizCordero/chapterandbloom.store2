"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useCart } from "@/lib/cart";
import { eur, finishById, HOLO_EXTRA, PRICES, type FinishId } from "@/lib/data";
import { Art } from "./Art";
import { FinishPicker, ModelPicker } from "./Pickers";
import { Flower, HandArrow, Heart, Sparkle } from "./Stickers";

type Upload = { name: string; url: string };

/** Cada bloque del formulario es un paso de verdad: se elige en este orden. */
function Step({ n, children }: { n: number; children: ReactNode }) {
  return (
    <div className="flex gap-3.5">
      <span aria-hidden className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-aqua text-sm font-extrabold">
        {n}
      </span>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

export function CustomForm() {
  const { add } = useCart();
  const [kind, setKind] = useState<"skin" | "insert">("skin");
  const [model, setModel] = useState("");
  const [finish, setFinish] = useState<FinishId>("matte");
  const [files, setFiles] = useState<Upload[]>([]);
  const [note, setNote] = useState("");
  const [modelError, setModelError] = useState(false);
  const [fileError, setFileError] = useState(false);
  const [done, setDone] = useState(false);
  const [drag, setDrag] = useState(false);
  const urls = useRef<string[]>([]);

  useEffect(() => () => urls.current.forEach((u) => URL.revokeObjectURL(u)), []);

  const base = kind === "skin" ? PRICES.customSkin : PRICES.customInsert;
  const price = base + (finishById(finish).holo ? HOLO_EXTRA : 0);

  const addFiles = (list: FileList | null) => {
    if (!list) return;
    const next = [...files];
    for (const f of Array.from(list)) {
      if (!f.type.startsWith("image/") || next.length >= 2) continue;
      const url = URL.createObjectURL(f);
      urls.current.push(url);
      next.push({ name: f.name, url });
    }
    setFiles(next);
    setFileError(false);
    setDone(false);
  };

  const submit = () => {
    setModelError(!model);
    setFileError(files.length === 0);
    if (!model || files.length === 0) return;
    add({
      name: kind === "skin" ? "Skin personalizada" : "Insert personalizado",
      image: { src: files[0].url, kind: "plain" },
      model,
      finish,
      unitPrice: price,
      custom: { files: files.map((f) => f.name), note, kind },
    });
    setDone(true);
  };

  return (
    <div className="grid gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-14">
      {/* Vista previa */}
      <div className="lg:sticky lg:top-28 lg:self-start">
        <div className="relative mx-auto aspect-[1/1.05] w-full max-w-[460px]">
          <div className="absolute inset-x-[7%] bottom-0 top-[2%] rounded-t-[999px] rounded-b-[28px] border-2 border-ink bg-mauve shadow-[6px_6px_0_var(--color-ink)]" />
          <div className="absolute left-1/2 top-[11%] h-[78%] -translate-x-1/2">
            <div key={`${kind}-${files[0]?.url ?? "base"}`} className="item-in h-full">
              <div className="h-full rotate-[-3deg] [filter:drop-shadow(7px_8px_0_var(--color-ink))]">
                <Art designId="lavanda" variant={kind} finish={finish} image={files[0]?.url} className="h-full w-auto" />
              </div>
            </div>
          </div>
          <Sparkle className="sticker-bob absolute -right-[2%] top-0 w-[22%]" />
          <Heart className="sticker-bob absolute -left-[3%] top-[48%] w-[16%] -rotate-12" style={{ ["--bd" as string]: "-2s" }} />
          <Flower className="sticker-bob absolute -right-[2%] bottom-[14%] w-[20%]" style={{ ["--bd" as string]: "-3.5s" }} />
        </div>
        <div className="mt-5 text-center">
          {!files[0] ? (
            <p className="font-hand inline-flex items-start gap-1 text-2xl font-bold leading-none">
              Aquí verás tu diseño
              <HandArrow className="mt-1 h-7 w-9 rotate-[-70deg]" />
            </p>
          ) : (
            <p className="font-hand text-2xl font-bold leading-none">Así va quedando</p>
          )}
          <p className="mx-auto mt-2 max-w-sm text-sm text-ink-soft">
            Vista orientativa. Revisaremos tu imagen y te escribiremos si necesitamos ajustar algo.
          </p>
        </div>
      </div>

      {/* Formulario */}
      <div className="tile space-y-8 p-5 sm:p-8">
        <div>
          <h1 className="font-display text-4xl leading-[1.05] [text-shadow:3px_3px_0_var(--color-mauve)] sm:text-5xl">Crea tu skin personalizada</h1>
          <p className="mt-4 max-w-prose text-ink-soft">
            Elige tu e-reader y el acabado, y sube tu diseño (hasta 2 imágenes). Cuéntanos en el mensaje cómo lo imaginas y nosotras lo preparamos.
          </p>
        </div>

        <Step n={1}>
          <fieldset>
            <legend className="mb-3 font-extrabold">Qué quieres crear</legend>
            <div className="grid grid-cols-2 gap-3" role="radiogroup">
              {(
                [
                  ["skin", "Skin personalizada", PRICES.customSkin],
                  ["insert", "Insert personalizado", PRICES.customInsert],
                ] as const
              ).map(([k, label, p]) => (
                <button
                  key={k}
                  type="button"
                  role="radio"
                  aria-checked={kind === k}
                  onClick={() => setKind(k)}
                  className={`rounded-2xl border-2 border-ink p-4 text-left transition duration-300 [transition-timing-function:var(--ease-stick)] ${
                    kind === k ? "-translate-y-1 rotate-[-1deg] bg-aqua shadow-[4px_4px_0_var(--color-ink)]" : "bg-paper shadow-[3px_3px_0_var(--color-mauve)] hover:-translate-y-0.5"
                  }`}
                >
                  <span className="block text-sm font-bold">{label}</span>
                  <span className="font-display text-2xl">{eur(p)}</span>
                </button>
              ))}
            </div>
          </fieldset>
        </Step>

        <Step n={2}>
          <ModelPicker
            model={model}
            error={modelError}
            onModel={(m) => {
              setModel(m);
              setModelError(false);
            }}
          />
        </Step>

        <Step n={3}>
          <FinishPicker value={finish} onChange={setFinish} image={files[0] ? { src: files[0].url, kind: "plain" } : null} />
        </Step>

        <Step n={4}>
          <fieldset>
            <legend className="mb-3 font-extrabold">Tu diseño (máx. 2 imágenes)</legend>
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDrag(true);
              }}
              onDragLeave={() => setDrag(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDrag(false);
                addFiles(e.dataTransfer.files);
              }}
              className={`rounded-2xl border-2 border-dashed p-6 text-center transition ${
                fileError ? "border-berry bg-mauve/40" : drag ? "border-ink bg-aqua" : "border-ink bg-paper"
              }`}
            >
              <input type="file" accept="image/*" multiple className="sr-only" id="files" onChange={(e) => addFiles(e.target.files)} />
              {files.length < 2 ? (
                <>
                  <p className="font-bold">Arrastra aquí tu imagen o</p>
                  <label htmlFor="files" className="btn btn-aqua mt-3 !py-2.5">
                    Elegir archivo
                  </label>
                  <p className="mt-3 text-xs text-ink-soft">{files.length}/2 subidas · JPG o PNG</p>
                </>
              ) : (
                <p className="font-bold">Has subido las 2 imágenes</p>
              )}
              {files.length > 0 && (
                <ul className="mt-4 grid grid-cols-2 gap-3">
                  {files.map((f, i) => (
                    <li key={f.url} className="item-in relative rounded-xl border-2 border-ink bg-cream p-2 text-left">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={f.url} alt={`Imagen ${i + 1}`} className="aspect-square w-full rounded-lg object-cover" />
                      <p className="mt-1 truncate text-xs">{f.name}</p>
                      <button
                        type="button"
                        onClick={() => setFiles((fs) => fs.filter((_, k) => k !== i))}
                        className="absolute right-3.5 top-3.5 flex h-7 w-7 items-center justify-center rounded-full border-2 border-cream bg-ink text-cream"
                        aria-label={`Quitar ${f.name}`}
                      >
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {fileError && (
              <p role="alert" className="mt-2 text-sm font-bold text-berry">
                Sube al menos una imagen con tu diseño.
              </p>
            )}
          </fieldset>
        </Step>

        <Step n={5}>
          <label htmlFor="note" className="mb-3 block font-extrabold">
            Mensaje para nosotras
          </label>
          <textarea
            id="note"
            rows={4}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Cuéntanos cómo lo quieres: colocación de las imágenes, textos, colores, dudas…"
            className="field w-full !rounded-2xl"
          />
        </Step>

        <div className="space-y-3">
          <button type="button" onClick={submit} className="btn btn-primary w-full !py-3.5 text-base">
            Añadir al carrito · {eur(price)}
          </button>
          <p role="status" className="text-center text-sm font-bold">
            {done ? "Añadida al carrito. Puedes crear otra si quieres." : ""}
          </p>
          <p className="text-xs text-ink-soft">
            Skin personalizada {eur(PRICES.customSkin)} · insert personalizado {eur(PRICES.customInsert)} · acabados holográficos +{eur(HOLO_EXTRA)}.
          </p>
        </div>
      </div>
    </div>
  );
}
