import { ArrowRight, Check, Download, MapPin } from "lucide-react";
import Image from "next/image";
import { PublicFooter, PublicNav } from "@/components/public/PublicChrome";
import { publicProducts } from "@/lib/publicProducts";

type SolutionPageData = {
  eyebrow: string;
  title: string;
  intro: string;
  cta: string;
  heroImage: string;
  proof: string[];
  overviewEyebrow: string;
  overviewTitle: string;
  overviewBody: string;
  featureImage: string;
  capabilities: string[];
  supportEyebrow: string;
  supportTitle: string;
  steps: { title: string; body: string }[];
  darkTitle: string;
  darkCards: { image: string; title: string; body: string }[];
  faqs: string[];
  footerTitle: string;
  footerBody: string;
  footerButton: string;
};

const products = publicProducts.slice(0, 6);

function Eyebrow({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <div className={`flex items-center gap-2 text-[12px] font-semibold uppercase tracking-normal ${light ? "text-white" : "text-[#020202]"}`}>
      <span className="h-1.5 w-1.5 bg-[#58c7e8]" />
      {children}
    </div>
  );
}

function AngledButton({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <a
      href="#contact"
      className={`inline-flex h-12 items-center gap-5 px-4 text-sm font-semibold transition ${
        light ? "bg-white text-[#020202] hover:bg-[#58c7e8]" : "bg-[#58c7e8] text-[#020202] hover:bg-[#41b7d9]"
      }`}
      style={{ clipPath: "polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 0 100%)" }}
    >
      {children}
      <ArrowRight size={16} />
    </a>
  );
}

export function SolutionPage({ data }: { data: SolutionPageData }) {
  return (
    <main className="min-h-screen bg-white text-[#020202]">
      <PublicNav />

      <section className="relative min-h-[760px] overflow-hidden bg-[#101010] text-white lg:min-h-[860px]">
        <Image src={data.heroImage} alt="" fill priority sizes="100vw" className="object-cover opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-black/10" />
        <div className="relative mx-auto flex min-h-[760px] max-w-[1920px] flex-col justify-end px-6 pb-28 lg:min-h-[860px] lg:px-[60px]">
          <div className="max-w-[760px]">
            <h1 className="text-[54px] font-normal leading-[0.95] tracking-normal lg:text-[92px]">{data.title}</h1>
            <div className="mt-8">
              <AngledButton light>{data.cta}</AngledButton>
            </div>
            <p className="mt-8 max-w-[520px] text-sm leading-[1.55] text-white/78">{data.intro}</p>
          </div>
          <div className="mt-14 flex flex-wrap gap-2">
            {data.proof.map((item) => (
              <span key={item} className="border border-white/25 bg-black/25 px-3 py-2 text-xs text-white/85 backdrop-blur">
                {item}
              </span>
            ))}
          </div>
        </div>
        <div className="absolute bottom-0 right-0 h-16 w-[45%] bg-white" style={{ clipPath: "polygon(48px 0, 100% 0, 100% 100%, 0 100%)" }} />
      </section>

      <section className="border-b border-[#e4e4e4] px-6 py-24 lg:px-[60px] lg:py-[100px]">
        <div className="mx-auto grid max-w-[1800px] gap-14 lg:grid-cols-[0.82fr_1.18fr]">
          <div>
            <Eyebrow>{data.overviewEyebrow}</Eyebrow>
            <h2 className="mt-6 max-w-[520px] text-5xl font-normal leading-tight tracking-normal">{data.overviewTitle}</h2>
            <p className="mt-8 max-w-[612px] text-lg leading-[1.45] text-[#595959]">{data.overviewBody}</p>
          </div>
          <div className="grid overflow-hidden bg-[#f0f0f0] lg:grid-cols-[0.95fr_1fr]">
            <div className="relative min-h-[360px]">
              <Image src={data.featureImage} alt="" fill sizes="(min-width: 1024px) 45vw, 94vw" className="object-cover" />
            </div>
            <div className="p-8 lg:p-12">
              <p className="text-sm font-medium text-[#595959]">Built around your growth</p>
              <div className="mt-8 grid gap-5">
                {data.capabilities.map((item) => (
                  <div key={item} className="flex items-center justify-between border-b border-[#d8d8d8] pb-4 text-lg">
                    <span>{item}</span>
                    <Check size={18} className="text-[#020202]" />
                  </div>
                ))}
              </div>
              <div className="mt-9">
                <AngledButton>{data.cta}</AngledButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-24 lg:px-[60px] lg:py-[100px]">
        <div className="mx-auto grid max-w-[1800px] gap-12 lg:grid-cols-[0.82fr_1.18fr]">
          <div>
            <Eyebrow>{data.supportEyebrow}</Eyebrow>
            <h2 className="mt-6 max-w-[560px] text-5xl font-normal leading-tight tracking-normal">{data.supportTitle}</h2>
            <div className="mt-8">
              <AngledButton>Start the Program</AngledButton>
            </div>
          </div>
          <div className="grid gap-1">
            {data.steps.map((step, index) => (
              <article key={step.title} className="grid min-h-[178px] bg-[#f0f0f0] md:grid-cols-[220px_1fr]">
                <div className="flex items-center justify-center border-b border-white md:border-b-0 md:border-r">
                  <span className="text-[82px] font-normal leading-none">{String(index + 1).padStart(2, "0")}</span>
                </div>
                <div className="flex flex-col justify-center p-8">
                  <p className="text-xs uppercase text-[#7a7a7a]">Step {String(index + 1).padStart(2, "0")}</p>
                  <h3 className="mt-3 text-2xl font-medium">{step.title}</h3>
                  <p className="mt-4 max-w-[620px] text-sm leading-[1.5] text-[#595959]">{step.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#101010] px-6 py-24 text-white lg:px-[60px] lg:py-[120px]">
        <div className="mx-auto max-w-[1800px]">
          <Eyebrow light>Network</Eyebrow>
          <h2 className="mt-6 max-w-[980px] text-5xl font-normal leading-tight tracking-normal">{data.darkTitle}</h2>
          <div className="mt-16 grid gap-6 lg:grid-cols-3">
            {data.darkCards.map((card) => (
              <article key={card.title}>
                <div className="relative aspect-[520/340] overflow-hidden rounded-[28px] bg-[#1f1f1f]">
                  <Image src={card.image} alt="" fill sizes="(min-width: 1024px) 31vw, 94vw" className="object-cover" />
                </div>
                <h3 className="mt-6 text-xl font-medium">{card.title}</h3>
                <p className="mt-3 text-sm leading-[1.55] text-white/62">{card.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-24 lg:px-[60px] lg:py-[100px]">
        <div className="mx-auto max-w-[1800px]">
          <div className="flex min-h-[86px] flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <Eyebrow>Product Range</Eyebrow>
              <h2 className="mt-6 text-5xl font-normal tracking-normal">Browse by Product Category</h2>
            </div>
            <AngledButton>
              <Download size={16} /> Download Catalog
            </AngledButton>
          </div>
          <div className="mt-[60px] grid gap-[42px] md:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <article key={product.slug} className="flex min-h-[310px] flex-col justify-between bg-[#f5f5f5] p-8">
                <div>
                  <p className="text-xs font-semibold uppercase text-[#58c7e8]">{product.category}</p>
                  <h3 className="mt-5 text-2xl font-medium">{product.title}</h3>
                  <p className="mt-4 text-base leading-[1.45] text-[#595959]">{product.summary}</p>
                </div>
                <a href={`/products/${product.slug}`} className="mt-8 inline-flex text-sm font-semibold">
                  Know more
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f5f5f5] px-6 py-24 lg:px-[60px] lg:py-[100px]">
        <div className="mx-auto grid max-w-[1800px] gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <Eyebrow>Questions</Eyebrow>
            <h2 className="mt-6 text-5xl font-normal tracking-normal">Everything You Need to Know</h2>
          </div>
          <div className="border-t border-[#d8d8d8] bg-white">
            {data.faqs.map((question) => (
              <button key={question} className="flex min-h-[72px] w-full items-center justify-between gap-6 border-b border-[#d8d8d8] px-6 text-left text-base">
                <span>{question}</span>
                <span className="text-2xl font-light">+</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#111] px-6 py-24 text-white lg:px-[60px] lg:py-[100px]">
        <div className="mx-auto max-w-[1800px] text-center">
          <Eyebrow light>Where We Operate</Eyebrow>
          <h2 className="mt-6 text-4xl font-normal tracking-normal">Where We Operate</h2>
          <div className="mx-auto mt-12 grid max-w-3xl gap-4 text-left sm:grid-cols-2">
            {["Delhi NCR", "Ankleshwar, Gujarat"].map((location) => (
              <div key={location} className="bg-white/10 p-6">
                <MapPin size={20} className="text-[#58c7e8]" />
                <p className="mt-4 font-semibold">{location}</p>
                <p className="mt-2 text-sm text-white/60">Sales, support, production coordination and dispatch coverage.</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PublicFooter ctaTitle={data.footerTitle} ctaBody={data.footerBody} ctaButton={data.footerButton} />
    </main>
  );
}

