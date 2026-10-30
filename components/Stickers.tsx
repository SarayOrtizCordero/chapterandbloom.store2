import type { CSSProperties } from "react";

/* Pegatinas dibujadas con los cuatro colores de la marca. Contorno en tinta, relleno plano. */
type P = { className?: string; style?: CSSProperties; fill?: string; accent?: string };

const INK = "var(--color-ink)";

export function Sparkle({ className, style, fill = "var(--color-aqua)" }: P) {
  return (
    <svg viewBox="0 0 100 100" className={className} style={style} aria-hidden>
      <path d="M50 5C54 34 66 46 95 50 66 54 54 66 50 95 46 66 34 54 5 50 34 46 46 34 50 5Z" fill={fill} stroke={INK} strokeWidth="4.5" strokeLinejoin="round" />
    </svg>
  );
}

export function Heart({ className, style, fill = "var(--color-cream)" }: P) {
  return (
    <svg viewBox="0 0 100 100" className={className} style={style} aria-hidden>
      <path
        d="M50 88C20 66 6 49 6 33 6 19 17 9 30 9 40 9 47 15 50 23 53 15 60 9 70 9 83 9 94 19 94 33 94 49 80 66 50 88Z"
        fill={fill}
        stroke={INK}
        strokeWidth="4.5"
        strokeLinejoin="round"
      />
      <path d="M24 30c1-6 5-10 11-10" fill="none" stroke={INK} strokeWidth="4" strokeLinecap="round" opacity="0.35" />
    </svg>
  );
}

export function Flower({ className, style, fill = "var(--color-cream)", accent = "var(--color-aqua)" }: P) {
  const petals = [0, 72, 144, 216, 288].map((a) => <circle key={a} cx="50" cy="26" r="17" transform={`rotate(${a} 50 50)`} />);
  return (
    <svg viewBox="0 0 100 100" className={className} style={style} aria-hidden>
      <g stroke={INK} strokeWidth="9" strokeLinejoin="round">
        {petals}
        <circle cx="50" cy="50" r="14" />
      </g>
      <g fill={fill}>{petals}</g>
      <circle cx="50" cy="50" r="12" fill={accent} stroke={INK} strokeWidth="3.5" />
    </svg>
  );
}

export function Ribbon({ className, style, fill = "var(--color-mauve)" }: P) {
  return (
    <svg viewBox="0 0 70 120" className={className} style={style} aria-hidden>
      <path d="M8 6H62V112L35 90 8 112Z" fill={fill} stroke={INK} strokeWidth="4.5" strokeLinejoin="round" />
      <path
        d="M35 62C22 52 18 46 18 40 18 34 22 31 26 31 30 31 33 33 35 37 37 33 40 31 44 31 48 31 52 34 52 40 52 46 48 52 35 62Z"
        fill="var(--color-cream)"
        stroke={INK}
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Squiggle({ className, style }: P) {
  return (
    <svg viewBox="0 0 120 20" className={className} style={style} aria-hidden>
      <path d="M4 12C14 2 22 2 30 10S46 18 56 10 72 2 82 10 98 18 116 8" pathLength="1" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

/** Flecha a mano que apunta hacia abajo y a la derecha */
export function HandArrow({ className, style }: P) {
  return (
    <svg viewBox="0 0 90 70" className={className} style={style} aria-hidden>
      <path d="M6 8C20 6 40 14 52 34 58 44 62 52 64 60" fill="none" stroke={INK} strokeWidth="3.5" strokeLinecap="round" />
      <path d="M50 54l15 8 7-16" fill="none" stroke={INK} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
