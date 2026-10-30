import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ProductCard } from "@/components/ProductCard";
import { ProductView } from "@/components/ProductView";
import { productBySlug, products } from "@/lib/data";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = productBySlug(slug);
  return { title: p ? `${p.name} · Chapter & Bloom` : "Producto" };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = productBySlug(slug);
  if (!product) notFound();

  const related = products.filter((p) => p.category === product.category && p.slug !== product.slug).slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-10 sm:px-6">
      <ProductView product={product} />

      <section className="mt-16 grid gap-3 md:grid-cols-2">
        <details className="tile !rounded-2xl px-6 py-4">
          <summary className="cursor-pointer font-extrabold">Envíos y devoluciones</summary>
          <p className="mt-3 text-sm text-ink-soft">
            Texto de ejemplo para la demo. Aquí irán los plazos de preparación, los costes y zonas de envío y la política de devoluciones de Chapter & Bloom.
          </p>
        </details>
        <details className="tile !rounded-2xl px-6 py-4">
          <summary className="cursor-pointer font-extrabold">{product.needsDevice ? "Cómo colocar tu skin" : "Cuidados"}</summary>
          <p className="mt-3 text-sm text-ink-soft">
            {product.needsDevice
              ? "Limpia la superficie, retira el papel protector poco a poco y alinea con los bordes. Si te equivocas, puedes recolocarla con calma. (Texto de ejemplo)"
              : "Texto de ejemplo para la demo."}
          </p>
        </details>
      </section>

      {related.length > 0 && (
        <section className="mt-20 overflow-x-clip">
          <h2 className="font-display text-3xl sm:text-4xl">También te puede gustar</h2>
          <div className="mt-8 grid auto-rows-fr grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4 lg:gap-x-6">
            {related.map((p, i) => (
              <div key={p.slug} className="h-full min-w-0">
                <ProductCard product={p} tilt={[-1, 0.8, -0.5, 1.2][i % 4]} />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
