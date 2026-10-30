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

const icon = { width: 22, height: 22, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true } as const;

/** Formas de pago que se ofrecen. Los iconos son genéricos, dibujados con el estilo de la web. */
const payments = [
  {
    id: "card",
    label: "Tarjeta",
    hint: "Visa o Mastercard",
    info: "Pagarías con tu tarjeta de forma segura. En esta demo no se pide ningún dato.",
    icon: (
      <svg {...icon}>
        <rect x="3" y="5.5" width="18" height="13" rx="2.5" />
        <path d="M3 10h18M6.5 15h4" />
      </svg>
    ),
  },
  {
    id: "paypal",
    label: "PayPal",
    hint: "Con tu cuenta",
    info: "Te llevaríamos a PayPal para confirmar el pago. En esta demo se simula.",
    icon: (
      <svg {...icon}>
        <path d="M7 20l2.2-14h5.1a3.7 3.7 0 010 7.4H10.4" />
        <path d="M6.2 11.5h4.2" />
      </svg>
    ),
  },
  {
    id: "bizum",
    label: "Bizum",
    hint: "Con tu móvil",
    info: "Recibirías la solicitud en la app de tu banco. En esta demo se simula.",
    icon: (
      <svg {...icon}>
        <rect x="7" y="2.5" width="10" height="19" rx="2.5" />
        <path d="M11 18.5h2M9.8 9.5l1.6 1.6 3-3" />
      </svg>
    ),
  },
  {
    id: "apple",
    label: "Apple Pay",
    hint: "Pago rápido",
    info: "Confirmarías con Face ID o Touch ID. En esta demo se simula.",
    icon: (
      <svg {...icon}>
        <path d="M4 7.5A2.5 2.5 0 016.5 5H18a2 2 0 012 2v1.5" />
        <path d="M4 7.5V17a2.5 2.5 0 002.5 2.5H18a2 2 0 002-2V11a2 2 0 00-2-2H6.5A2.5 2.5 0 014 7.5z" />
        <circle cx="16" cy="14" r="1.1" fill="currentColor" />
      </svg>
    ),
  },
];

const Page = ({ children }: { children: ReactNode }) => <div className="paper min-h-[60vh] overflow-x-clip">{children}</div>;

export default function Checkout() {
  const { items, subtotal, clear } = useCart();
  const [order, setOrder] = useState<string | null>(null);
  const [method, setMethod] = useState(payments[0].id);
  const [paidWith, setPaidWith] = useState("");
  const chosen = payments.find((p) => p.id === method) ?? payments[0];

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
            Pedido <strong className="text-ink">{order}</strong> registrado con pago por {paidWith}. Esto es una demo: no se ha realizado ningún cobro ni se enviará nada.
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
            setPaidWith(chosen.label);
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
              <fieldset>
                <legend className="sr-only">Forma de pago</legend>
                <div className="grid gap-3 min-[440px]:grid-cols-2">
                  {payments.map((p) => (
                    <label key={p.id} className="relative block cursor-pointer">
                      <input type="radio" name="pago" value={p.id} checked={method === p.id} onChange={() => setMethod(p.id)} className="peer sr-only" />
                      <span className="flex h-full items-center gap-2.5 rounded-2xl border-2 border-ink bg-paper p-2.5 shadow-[3px_3px_0_var(--color-mauve)] transition duration-300 [transition-timing-function:var(--ease-stick)] hover:-translate-y-0.5 peer-checked:-translate-y-1 peer-checked:rotate-[-1deg] peer-checked:bg-aqua peer-checked:shadow-[4px_4px_0_var(--color-ink)] peer-focus-visible:outline peer-focus-visible:outline-[3px] peer-focus-visible:outline-offset-[3px] peer-focus-visible:outline-ink sm:p-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-cream">{p.icon}</span>
                        <span className="min-w-0">
                          <span className="block font-extrabold leading-tight">{p.label}</span>
                          <span className="block text-xs leading-tight text-ink-soft">{p.hint}</span>
                        </span>
                      </span>
                      <span aria-hidden className="absolute -right-2 -top-2 hidden h-6 w-6 items-center justify-center rounded-full border-2 border-ink bg-ink text-aqua peer-checked:flex">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12.5l4.5 4.5L19 7.5" />
                        </svg>
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>
              <p aria-live="polite" className="rounded-2xl border-2 border-dashed border-ink bg-mauve-soft p-4 text-sm text-ink-soft">
                {chosen.info}
              </p>
            </Section>
          </div>

          <aside className="tile h-fit space-y-5 p-6">
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
              <div className="flex justify-between text-ink-soft">
                <span>Pago</span>
                <span className="font-bold text-ink">{chosen.label}</span>
              </div>
            </div>
            <div className="flex items-baseline justify-between border-t-2 border-ink/15 pt-4">
              <span className="font-extrabold">Total</span>
              <span className="font-display text-4xl">{eur(subtotal)}</span>
            </div>
            <button className="btn btn-primary w-full !py-4 text-base">Pagar con {chosen.label} (demo)</button>
          </aside>
        </form>
      </div>
    </Page>
  );
}
