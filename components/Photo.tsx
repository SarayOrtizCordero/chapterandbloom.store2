import type { CSSProperties } from "react";
import { optimized, type ImgSize } from "@/lib/img";

type Props = {
  src: string;
  /** Tamaño máximo que se necesita. Con 1100 se ofrece también el de 640 para que el móvil descargue menos */
  size: ImgSize;
  alt: string;
  fill?: boolean;
  priority?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
  className?: string;
  style?: CSSProperties;
  "aria-hidden"?: boolean;
};

/**
 * Imagen de producto: sirve directamente los WebP ya optimizados (sin pasar por el optimizador).
 * Con `size={1100}` lleva `srcset` de 640 y 1100: cada pantalla descarga solo lo que necesita.
 */
export function Photo({ src, size, alt, fill, priority, width, height, sizes, className = "", style, ...rest }: Props) {
  const base = optimized(src, size);
  const responsive = size === 1100 && src.startsWith("/brand/");
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={base}
      srcSet={responsive ? `${optimized(src, 640)} 640w, ${base} 1100w` : undefined}
      sizes={responsive ? sizes : undefined}
      alt={alt}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      decoding="async"
      draggable={false}
      className={fill ? `absolute inset-0 h-full w-full ${className}` : className}
      style={style}
      {...rest}
    />
  );
}
