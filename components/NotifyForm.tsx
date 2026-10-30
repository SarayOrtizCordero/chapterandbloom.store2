"use client";

import { useState } from "react";

export function NotifyForm() {
  const [sent, setSent] = useState(false);
  if (sent) return <p className="font-bold text-ink">Apuntado. Te avisaremos cuando llegue (demo).</p>;
  return (
    <form
      className="flex w-full max-w-md gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
    >
      <label htmlFor="notify" className="sr-only">
        Correo electrónico
      </label>
      <input id="notify" type="email" required placeholder="tu@correo.com" className="field min-w-0 flex-1" />
      <button className="btn btn-primary !px-5">Avísame</button>
    </form>
  );
}
