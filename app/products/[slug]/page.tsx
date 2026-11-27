import { ProductDetailView } from "@/components/public/ProductDetailView";
import { redirect } from "next/navigation";
import { CUSTOM_CAPACITOR_HREF, publicProducts } from "@/lib/publicProducts";

type ProductDetailProps = {
  params: Promise<{ slug: string }>;
};

export default async function ProductDetailPage({ params }: ProductDetailProps) {
  const { slug } = await params;
  if (slug === "customized-capacitor") redirect(CUSTOM_CAPACITOR_HREF);
  const product = publicProducts.find((item) => item.slug === slug) ?? publicProducts[0];
  const index = publicProducts.findIndex((item) => item.slug === product.slug);
  const previous = publicProducts[(index + publicProducts.length - 1) % publicProducts.length];
  const next = publicProducts[(index + 1) % publicProducts.length];

  return <ProductDetailView product={product} previous={previous} next={next} />;
}

export function generateStaticParams() {
  return publicProducts.map((product) => ({ slug: product.slug }));
}
