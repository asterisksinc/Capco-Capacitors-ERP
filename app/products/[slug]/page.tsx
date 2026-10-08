import { ArrowLeft, ArrowRight, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { PublicFooter, PublicNav } from "@/components/public/PublicChrome";
import { publicProducts } from "@/lib/publicProducts";

type ProductDetailProps = {
  params: Promise<{ slug: string }>;
};

const included = ["Vacuum Sealed", "Heavy Edge", "Precisely Slitted", "Superior Quality", "Customizable"];

const specs = [
  ["Type", "Standard / Customised"],
  ["Thickness", "3.5 - 14 Micron"],
  ["Film Width", "25, 30, 37.5, 45, 50, 60, 75, 100 mm"],
  ["Roll OD", "Up to 350mm"],
  ["Core ID", "75 mm"],
  ["Surface Resistivity", "6-9 OHMS / Square"],
  ["Free Margin", "1.5 - 1.8 mm"],
];

const faqs = [
  "What comes inside each enclosure?",
  "How is the system certified?",
  "How long do the systems last?",
  "Can we run our own software on your hardware?",
];

export default async function ProductDetailPage({ params }: ProductDetailProps) {
  const { slug } = await params;
  const product = publicProducts.find((item) => item.slug === slug) ?? publicProducts[0];
  const index = publicProducts.findIndex((item) => item.slug === product.slug);
  const previous = publicProducts[(index + publicProducts.length - 1) % publicProducts.length];
  const next = publicProducts[(index + 1) % publicProducts.length];

  return (
    <main className="min-h-screen bg-white text-[#020202]">
      <PublicNav />

      <section className="px-6 py-16 lg:px-[60px] lg:py-24">
        <div className="mx-auto max-w-[1800px]">
          <div className="flex items-center justify-between text-sm text-[#666]">
            <Link href={`/products/${previous.slug}`}>Previous Product</Link>
            <Link href={`/products/${next.slug}`}>Next Product</Link>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <Link href={`/products/${previous.slug}`} className="flex h-[52px] w-[52px] items-center justify-center rounded-lg bg-[#f5f5f5]" aria-label="Previous product">
              <ArrowLeft size={22} />
            </Link>
            <Link href={`/products/${next.slug}`} className="flex h-[52px] w-[52px] items-center justify-center rounded-lg bg-[#f5f5f5]" aria-label="Next product">
              <ArrowRight size={22} />
            </Link>
          </div>
          <div className="mx-auto mt-8 max-w-[760px] text-center">
            <p className="inline-flex items-center gap-3 text-sm text-[#595959]">
              <span className="h-1 w-1 rounded-full bg-[#58c7e8]" />
              {product.category}
            </p>
            <h1 className="mt-5 text-[54px] font-normal leading-[1.05] tracking-normal lg:text-[76px]">{product.title}</h1>
          </div>
        </div>
      </section>

      <section className="border-y border-[#dedcd7]">
        <div className="grid lg:grid-cols-2">
          <div className="min-h-[480px] border-b border-[#dedcd7] p-6 lg:border-b-0 lg:border-r">
            <h2 className="text-2xl font-medium">Premium-Grade Metallized Dielectric Film</h2>
            <p className="mt-72 max-w-md text-lg leading-[1.4] text-[#595959]">
              In-house Leybold-metallized BOPP film engineered for self-healing, high-voltage capacitor applications with superior volumetric efficiency.
            </p>
          </div>
          <div className="p-6">
            <h2 className="text-2xl font-medium">Engineered for Reliability</h2>
            <div className="relative mx-auto mt-14 aspect-[759/280] max-w-[760px] overflow-hidden bg-[#f5f5f5]">
              <Image src="/figma/products/detail-hero.jpeg" alt="" fill sizes="(min-width: 1024px) 40vw, 90vw" className="object-cover" />
            </div>
          </div>
        </div>
        <div className="grid border-t border-[#dedcd7] lg:grid-cols-2">
          <div className="border-b border-[#dedcd7] p-6 lg:border-b-0 lg:border-r">
            <h2 className="text-2xl font-medium">What&apos;s included</h2>
            <div className="mt-6 flex flex-wrap gap-3">
              {included.map((item) => (
                <span key={item} className="border border-[#dedcd7] px-4 py-3 text-sm">
                  {item}
                </span>
              ))}
            </div>
          </div>
          <div className="p-6">
            <h2 className="text-2xl font-medium">Specs</h2>
            <div className="mt-6">
              {specs.map(([label, value]) => (
                <div key={label} className="flex justify-between border-b border-[#dedcd7] py-3 text-sm">
                  <span className="text-[#595959]">{label}</span>
                  <span className="text-right font-medium">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-20 lg:px-[60px]">
        <div className="mx-auto max-w-[1800px] text-center">
          <p className="inline-block border border-[#dedcd7] px-4 py-2 text-sm text-[#595959]">
            Trusted by Leading Capacitor Manufacturers Across India, Middle East & Southeast Asia
          </p>
          <div className="mt-14 flex flex-wrap justify-center gap-x-16 gap-y-6 text-2xl font-semibold text-[#8a8a8a]">
            {["OEM", "BIS", "ERDA", "CPRI", "CE", "RoHS"].map((label) => (
              <span key={label}>{label}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f5f5f5] px-6 py-24 lg:px-[60px]">
        <div className="mx-auto grid max-w-[1800px] gap-12 lg:grid-cols-[1fr_800px]">
          <div>
            <p className="text-sm uppercase text-[#666]">Product support</p>
            <h2 className="mt-5 text-5xl font-normal tracking-normal">Frequently asked questions</h2>
          </div>
          <div className="grid gap-2">
            {faqs.map((question) => (
              <button key={question} className="flex h-[76px] items-center justify-between bg-white px-6 text-left text-xl font-medium">
                {question}
                <Plus size={22} />
              </button>
            ))}
          </div>
        </div>
      </section>

      <PublicFooter ctaTitle="Ready to build?" ctaButton="Start a Project" />
    </main>
  );
}

export function generateStaticParams() {
  return publicProducts.map((product) => ({ slug: product.slug }));
}
