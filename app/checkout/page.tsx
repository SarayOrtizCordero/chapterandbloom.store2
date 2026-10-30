"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { useCart } from "@/lib/cart";
import { eur, finishById } from "@/lib/data";
import { CartThumb } from "@/components/CartThumb";
import { Flower, Heart, Sparkle } from "@/components/Stickers";

function Field({ label, className = "", optional, ...input }: { label: string; optional?: boolean } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-sm font-extrabold">
        {label}
        {optional && <span className="font-medium text-ink-soft"> (opcional)</span>}
      </span>
      <input required={!optional} className="field w-full !rounded-2xl" {...input} />
    </label>
  );
}

/** Contacto, envío y pago van en este orden: es una secuencia de verdad */
function Section({ n, title, children }: { n: number; title: string; children: ReactNode }) {
  return (
    <section className="space-y-4">
      <h2 className="font-display flex items-center gap-3 text-3xl leading-none">
        <span aria-hidden className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-aqua font-sans text-base font-extrabold">
          {n}
        </span>
        {title}
      </h2>
      {children}
    </section>
  );
}

const Page = ({ children }: { children: ReactNode }) => <div className="paper min-h-[60vh] overflow-x-clip">{children}</div>;

export default function Checkout() {
  const { items, subtotal, clear } = useCart();
  const [order, setOrder] = useState<string | null>(null);

  if (order) {
    return (
      <Page>
        <div className="mx-auto max-w-xl px-4 py-24 text-center">
          <div className="relative mx-auto h-28 w-40" aria-hidden>
            <Flower className="sticker-in sticker-bob absolute left-1/2 top-0 w-24 -translate-x-1/2" />
            <Sparkle className="sticker-in sticker-bob absolute left-0 top-2 w-10" style={{ ["--d" as string]: "0.25s" }} />
            <Heart className="sticker-in sticker-bob absolute bottom-0 right-0 w-12 rotate-12" style={{ ["--d" as string]: "0.4s" }} />
          </div>
          <h1 className="font-display mt-6 text-5xl leading-none [text-shadow:3px_3px_0_var(--color-mauve)]">Gracias por tu pedido</h1>
          <p className="mt-5 text-lg text-ink-soft">
            Pedido <strong className="text-ink">{order}</strong> registrado. Esto es una demo: no se ha realizado ningún cobro ni se enviará nada.
          </p>
          <Link href="/" className="btn btn-primary mt-8">
            Volver al inicio
          </Link>
        </div>
      </Page>
    );
  }

  if (items.length === 0) {
    return (
      <Page>
        <div className="mx-auto max-w-xl px-4 py-24 text-center">
          <h1 className="font-display text-5xl leading-none [text-shadow:3px_3px_0_var(--color-mauve)]">Tu carrito está vacío</h1>
          <p className="mt-5 text-lg text-ink-soft">Añade algo bonito antes de finalizar la compra.</p>
          <Link href="/tienda" className="btn btn-aqua mt-8">
            Ir a la tienda
          </Link>
        </div>
      </Page>
    );
  }

  return (
    <Page>
      <div className="mx-auto max-w-6xl px-4 pb-24 pt-10 sm:px-6">
        <h1 className="font-display text-5xl leading-none [text-shadow:3px_3px_0_var(--color-mauve)]">Finalizar compra</h1>
        <p className="mt-5 inline-block rounded-2xl border-2 border-ink bg-aqua px-4 py-2 text-sm font-bold">Modo demo: el pago es simulado y no se guardan datos.</p>

        <form
          className="mt-10 grid gap-10 lg:grid-cols-[1fr_420px]"
          onSubmit={(e) => {
            e.preventDefault();
            setOrder(`CB-${Math.floor(1000 + Math.random() * 9000)}`);
            clear();
          }}
        >
          <div className="tile space-y-10 p-5 sm:p-8">
            <Section n={1} title="Contacto">
              <Field label="Correo electrónico" type="email" name="email" autoComplete="email" />
            </Section>
            <Section n={2} title="Envío">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Nombre" name="nombre" autoComplete="given-name" />
                <Field label="Apellidos" name="apellidos" autoComplete="family-name" />
              </div>
              <Field label="Dirección" name="direccion" autoComplete="street-address" />
              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="Código postal" name="cp" autoComplete="postal-code" inputMode="numeric" />
                <Field label="Ciudad" name="ciudad" autoComplete="address-level2" className="sm:col-span-2" />
              </div>
              <Field label="Teléfono" name="telefono" type="tel" autoComplete="tel" optional />
              <p className="text-sm text-ink-soft">Solo lo usamos si hay algún problema con la entrega.</p>
            </Section>
            <Section n={3} title="Pago">
              <div className="rounded-2xl border-2 border-dashed border-ink bg-mauve-soft p-5 text-sm text-ink-soft">
                Aquí irá el pago real (por ejemplo, tarjeta, PayPal o Bizum). En esta demo basta con pulsar el botón.
              </div>
            </Section>
          </div>

          <aside className="tile h-fit space-y-5 p-6 lg:sticky lg:top-28">
            <h2 className="font-display text-3xl leading-none">Resumen</h2>
            <ul className="space-y-4">
              {items.map((i) => (
                <li key={i.id} className="flex gap-3">
                  <div className="relative w-14 shrink-0 self-start">
                    <CartThumb item={i} />
                    <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full border-2 border-cream bg-ink text-[11px] font-extrabold text-cream">{i.qty}</span>
                  </div>
                  <div className="min-w-0 flex-1 text-sm">
                    <p className="font-bold leading-tight">{i.name}</p>
                    <p className="text-xs text-ink-soft">{[i.variant, i.model, i.finish && finishById(i.finish).name].filter(Boolean).join(" · ")}</p>
                  </div>
                  <p className="text-sm font-extrabold">{eur(i.unitPrice * i.qty)}</p>
                </li>
              ))}
            </ul>
            <div className="space-y-1.5 border-t-2 border-ink/15 pt-4 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-extrabold">{eur(subtotal)}</span>
              </div>
              <div className="flex justify-between text-ink-soft">
                <span>Envío</span>
                <span>Se calcula al pagar (demo)</span>
              </div>
            </div>
            <div className="flex items-baseline justify-between border-t-2 border-ink/15 pt-4">
              <span className="font-extrabold">Total</span>
              <span className="font-display text-4xl">{eur(subtotal)}</span>
            </div>
            <button className="btn btn-primary w-full !py-4 text-base">Realizar pedido (demo)</button>
          </aside>
        </form>
      </div>
    </Page>
  );
}
