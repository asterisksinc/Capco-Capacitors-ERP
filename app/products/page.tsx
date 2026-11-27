"use client";

import { PublicFooter, PublicNav } from "@/components/public/PublicChrome";
import { productCategories, publicProducts } from "@/lib/publicProducts";
import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

export default function ProductsPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    const requestedCategory = new URLSearchParams(window.location.search).get("category");
    if (requestedCategory && productCategories.includes(requestedCategory)) setCategory(requestedCategory);
  }, []);

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
          <h1 className="type-display font-normal">Our Products</h1>
          <label className="mx-auto mt-14 flex h-10 max-w-[560px] items-center border-b border-[#d8d8d8] text-left">
            <Search size={16} className="mr-3 text-[#595959]" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search"
              aria-label="Search products"
              className="h-full min-w-0 flex-1 bg-transparent text-base outline-none"
            />
            <span className="text-sm text-[#595959]">[{filteredProducts.length}]</span>
          </label>
          <div className="mx-auto mt-12 flex max-w-5xl flex-wrap justify-center gap-x-3 gap-y-2 text-sm">
            {productCategories.map((item) => (
              <button
                key={item}
                onClick={() => setCategory(item)}
                aria-pressed={category === item}
                className={`min-h-11 max-w-full px-3 py-2 ${category === item ? "bg-[#020202] text-white" : "text-[#595959] hover:bg-[#f5f5f5]"}`}
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
                <p className="type-caption text-[#666]">{product.category}</p>
                <h2 className="type-h4 mt-2.5 font-medium">{product.title}</h2>
                {/* Small tag (as in the reference); the whole card is the link */}
                <span className="type-caption mt-3 inline-block bg-[#F3F3F3] px-2 py-1 uppercase leading-none tracking-[0.04em] text-[#595959] transition group-hover:bg-[#58C7E8] group-hover:text-[#020202]">
                  Know more
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <PublicFooter ctaTitle="Ready to build?" ctaButton="Start a Project" />
    </main>
  );
}
