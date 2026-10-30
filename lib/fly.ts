/**
 * Un pequeño sticker con la imagen del producto vuela desde donde se pulsó hasta el icono del carrito
 * y, al llegar, se ejecuta `onDone` (que es cuando se añade de verdad). Sin animación si se pide menos movimiento.
 */
export function flyToCart(sources: (Element | null | undefined)[], image: string | undefined, onDone: () => void) {
  const target = document.querySelector("[data-cart-btn]");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const visible = (el: Element) => {
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < window.innerHeight && r.right > 0 && r.left < window.innerWidth;
  };
  const from = sources.find((s): s is Element => !!s && visible(s));
  if (!from || !target || reduce || typeof Element.prototype.animate !== "function") return onDone();

  const a = from.getBoundingClientRect();
  const b = target.getBoundingClientRect();
  const size = Math.round(Math.min(112, Math.max(64, Math.min(a.width, a.height) * 0.5)));
  const cx = a.left + a.width / 2;
  const cy = a.top + a.height / 2;

  const el = document.createElement("div");
  el.setAttribute("aria-hidden", "true");
  Object.assign(el.style, {
    position: "fixed",
    left: `${cx - size / 2}px`,
    top: `${cy - size / 2}px`,
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: "16px",
    border: "2px solid var(--color-ink)",
    boxShadow: "3px 3px 0 var(--color-mauve)",
    background: image ? `center / cover url("${image}") var(--color-paper)` : "var(--color-aqua)",
    zIndex: "60",
    pointerEvents: "none",
  });
  document.body.appendChild(el);

  const dx = b.left + b.width / 2 - cx;
  const dy = b.top + b.height / 2 - cy;
  const anim = el.animate(
    [
      { transform: "translate(0,0) scale(1) rotate(0deg)", opacity: 1 },
      { transform: `translate(${dx * 0.5}px, ${dy * 0.3 - 70}px) scale(0.8) rotate(-8deg)`, opacity: 1, offset: 0.45 },
      { transform: `translate(${dx}px, ${dy}px) scale(0.12) rotate(14deg)`, opacity: 0.75 },
    ],
    { duration: 760, easing: "cubic-bezier(0.5, 0, 0.6, 1)" },
  );
  let done = false;
  const end = () => {
    if (done) return;
    done = true;
    el.remove();
    onDone();
  };
  anim.onfinish = end;
  anim.oncancel = end;
}
