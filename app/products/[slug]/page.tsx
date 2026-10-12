import { ProductDetailView } from "@/components/public/ProductDetailView";
import { publicProducts } from "@/lib/publicProducts";

type ProductDetailProps = {
  params: Promise<{ slug: string }>;
};

export default async function ProductDetailPage({ params }: ProductDetailProps) {
  const { slug } = await params;
  const product = publicProducts.find((item) => item.slug === slug) ?? publicProducts[0];
  const index = publicProducts.findIndex((item) => item.slug === product.slug);
  const previous = publicProducts[(index + publicProducts.length - 1) % publicProducts.length];
  const next = publicProducts[(index + 1) % publicProducts.length];

  return <ProductDetailView product={product} previous={previous} next={next} />;
}

export function generateStaticParams() {
  return publicProducts.map((product) => ({ slug: product.slug }));
}
