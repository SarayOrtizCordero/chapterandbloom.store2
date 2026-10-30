import type { CartItem } from "@/lib/cart";
import { Art } from "./Art";
import { CropBox } from "./Pickers";

export function CartThumb({ item, className = "" }: { item: CartItem; className?: string }) {
  if (item.image) {
    return <CropBox img={item.image} className={`rounded-xl border-2 border-ink ${className}`} />;
  }
  return (
    <div className={`flex aspect-square items-center justify-center overflow-hidden rounded-xl border-2 border-ink bg-mauve-soft ${className}`}>
      <Art designId="lavanda" finish={item.finish ?? "glossy"} variant={item.custom?.kind ?? "skin"} className="h-[90%]" />
    </div>
  );
}
