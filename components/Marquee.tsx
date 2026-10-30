/** Cinta de texto que se desplaza. El segundo bloque es una copia para cerrar el bucle y se oculta a los lectores de pantalla. */
export function Marquee({ items, className = "" }: { items: string[]; className?: string }) {
  const row = (hidden: boolean) => (
    <div className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((t, i) => (
        <span key={i} className="flex items-center whitespace-nowrap">
          <span className="px-6">{t}</span>
          <svg width="18" height="18" viewBox="0 0 100 100" className="shrink-0" aria-hidden>
            <path d="M50 4C54 34 66 46 96 50 66 54 54 66 50 96 46 66 34 54 4 50 34 46 46 34 50 4Z" fill="currentColor" />
          </svg>
        </span>
      ))}
    </div>
  );
  return (
    <div className={`overflow-hidden ${className}`}>
      <div className="marquee">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
