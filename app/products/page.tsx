"use client";

import { PublicFooter, PublicNav } from "@/components/public/PublicChrome";
import { productCategories, publicProducts } from "@/lib/publicProducts";
import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

export default function ProductsPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const filteredProducts = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return publicProducts.filter((product) => {
      const matchesCategory = category === "All" || product.category === category;
      const matchesQuery = !normalized || `${product.title} ${product.category} ${product.summary}`.toLowerCase().includes(normalized);
      return matchesCategory && matchesQuery;
    });
  }, [category, query]);

  return (
    <main className="min-h-screen bg-white text-[#020202]">
      <PublicNav />

      <section className="px-6 pb-16 pt-20 lg:px-[60px] lg:pb-20 lg:pt-[72px]">
        <div className="mx-auto max-w-[1800px] text-center">
          <h1 className="text-[64px] font-normal leading-none tracking-normal lg:text-[96px]">Our Products</h1>
          <label className="mx-auto mt-14 flex h-10 max-w-[560px] items-center border-b border-[#d8d8d8] text-left">
            <Search size={16} className="mr-3 text-[#595959]" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search"
              className="h-full flex-1 bg-transparent text-sm outline-none"
            />
            <span className="text-sm text-[#595959]">[{filteredProducts.length}]</span>
          </label>
          <div className="mx-auto mt-12 flex max-w-5xl flex-wrap justify-center gap-x-3 gap-y-2 text-sm">
            {productCategories.map((item) => (
              <button
                key={item}
                onClick={() => setCategory(item)}
                className={`h-8 px-3 ${category === item ? "bg-[#020202] text-white" : "text-[#595959] hover:bg-[#f5f5f5]"}`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 pb-28 lg:px-[60px]">
        <div className="mx-auto grid max-w-[1800px] gap-x-2 gap-y-20 md:grid-cols-2 xl:grid-cols-3">
          {filteredProducts.map((product) => (
            <Link key={product.slug} href={`/products/${product.slug}`} className="group block">
              <div className="relative aspect-[594/447] overflow-hidden bg-[#f1f1f1]">
                <Image src={product.image} alt="" fill sizes="(min-width: 1280px) 31vw, (min-width: 768px) 47vw, 94vw" className="object-cover transition duration-500 group-hover:scale-105" />
              </div>
              <div className="mt-5 max-w-[535px]">
                <p className="flex flex-wrap items-center gap-3 text-xs text-[#666]">
                  <span>{product.date}</span>
                  <span className="h-[3px] w-[3px] rounded-full bg-[#666]" />
                  <span>{product.category}</span>
                </p>
                <h2 className="mt-3 text-2xl font-medium leading-tight">{product.title}</h2>
                <p className="mt-5 inline-flex text-sm font-medium">Know more</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <PublicFooter ctaTitle="Ready to build?" ctaButton="Start a Project" />
    </main>
  );
}
