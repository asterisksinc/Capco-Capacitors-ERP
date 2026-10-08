import { ArrowRight, ChevronDown, Mail, Menu, Phone } from "lucide-react";
import Link from "next/link";

export function PublicNav({ variant = "light" }: { variant?: "light" | "transparent" }) {
  const isTransparent = variant === "transparent";

  return (
    <header className={`${isTransparent ? "absolute border-transparent bg-transparent text-white" : "sticky border-[#e4e4e4] bg-white/94 text-black backdrop-blur"} top-0 z-30 w-full border-b`}>
      <div className="mx-auto flex h-[86px] max-w-[1920px] items-center justify-between px-7">
        <Link href="/" className={`text-2xl font-extrabold tracking-normal ${isTransparent ? "text-white" : "text-[#020202]"}`}>
          capco<span className="text-[#58c7e8]">.</span>
        </Link>
        <nav className="hidden items-center gap-8 text-base lg:flex">
          <Link href="/#why" className="inline-flex items-center gap-1">
            Company
            <ChevronDown size={16} />
          </Link>
          <div className="group relative">
            <Link href="/solutions/oem" className="inline-flex items-center gap-1">
              Solutions
              <ChevronDown size={16} />
            </Link>
            <div className="invisible absolute left-0 top-full z-40 min-w-[210px] border border-[#e4e4e4] bg-white p-2 text-black opacity-0 shadow-xl transition group-hover:visible group-hover:opacity-100">
              <Link href="/solutions/oem" className="block px-4 py-3 text-sm hover:bg-[#f5f5f5]">
                OEM
              </Link>
              <Link href="/solutions/dealership" className="block px-4 py-3 text-sm hover:bg-[#f5f5f5]">
                Dealership
              </Link>
            </div>
          </div>
          <Link href="/products" className="inline-flex items-center gap-1">
            Products
            <ChevronDown size={16} />
          </Link>
          <Link href="/#projects" className="inline-flex items-center gap-1">
            Resources
            <ChevronDown size={16} />
          </Link>
          <Link href="/#contact">Contact</Link>
        </nav>
        <div className="hidden items-center gap-4 lg:flex">
          <a href="tel:18000000000" className="inline-flex h-12 items-center gap-2 px-4 text-sm font-medium">
            <Phone size={16} />
            1800-XXX-XXXX
          </a>
          <Link href="/login" className={`inline-flex h-12 items-center border px-4 text-sm font-semibold ${isTransparent ? "border-white/35 text-white" : "border-black"}`}>
            Dealer Login
          </Link>
          <Link href="/#contact" className="inline-flex h-12 items-center bg-[#58c7e8] px-4 text-sm font-semibold text-[#020202]">
            Request Quote
          </Link>
        </div>
        <button className={`rounded-lg p-3 lg:hidden ${isTransparent ? "bg-white/10" : "bg-[#f5f5f5]"}`} aria-label="Open menu">
          <Menu size={20} />
        </button>
      </div>
    </header>
  );
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-normal text-[#020202]">
      <span className="h-1.5 w-1.5 bg-[#58c7e8]" />
      {children}
    </div>
  );
}

export function ArrowButton({
  children,
  href = "/#contact",
  light = false,
}: {
  children: React.ReactNode;
  href?: string;
  light?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex h-14 items-center gap-7 px-4 text-sm font-semibold transition ${
        light ? "bg-white text-[#020202] hover:bg-[#58c7e8]" : "bg-[#58c7e8] text-[#020202] hover:bg-[#41b7d9]"
      }`}
      style={{ clipPath: "polygon(0 0, calc(100% - 18px) 0, 100% 18px, 100% 100%, 0 100%)" }}
    >
      <span>{children}</span>
      <ArrowRight size={18} />
    </Link>
  );
}

export function PublicFooter({
  ctaTitle = "Ready to build?",
  ctaBody,
  ctaButton = "Start a Project",
}: {
  ctaTitle?: string;
  ctaBody?: string;
  ctaButton?: string;
}) {
  return (
    <>
      <section id="contact" className="relative overflow-hidden bg-[#0f0f0f] px-6 py-24 text-center text-white lg:px-[60px] lg:py-40">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[980px] w-[980px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" />
        <div className="relative mx-auto max-w-3xl">
          <h2 className="text-5xl font-normal tracking-normal">{ctaTitle}</h2>
          {ctaBody ? <p className="mx-auto mt-8 max-w-4xl text-lg leading-[1.45] text-white/70">{ctaBody}</p> : null}
          <div className="mt-8">
            <ArrowButton href="/#contact">{ctaButton}</ArrowButton>
          </div>
        </div>
      </section>
      <footer className="border-t border-white/10 bg-[#0a0a0a] px-6 py-16 text-white lg:px-[60px]">
        <div className="mx-auto grid max-w-[1800px] gap-12 lg:grid-cols-[1fr_1.55fr]">
          <div>
            <h3 className="text-3xl font-normal">Talk with an expert at CAPCO</h3>
            <form className="mt-6 flex max-w-sm gap-2">
              <input aria-label="Email" placeholder="Your email" className="h-10 flex-1 bg-white/10 px-3 text-sm outline-none" />
              <button className="h-10 bg-white px-5 text-sm font-semibold text-[#020202]">Sign Up</button>
            </form>
          </div>
          <div className="grid gap-8 sm:grid-cols-3 lg:grid-cols-6">
            {[
              ["Company", "Home", "About", "Gallery", "Awards", "Careers", "Contact"],
              ["Solutions", "OEMs", "Dealership", "Industrial Enquiry"],
              ["Products", "MPP Film", "Fan Capacitors", "Motor Capacitors", "PFC Capacitors"],
              ["Global", "UAE", "USA", "Sri Lanka", "Bangladesh", "Turkey", "Egypt"],
              ["Media", "Newsroom", "CSR", "Certifications"],
              ["Social", "Instagram", "LinkedIn", "Facebook", "YouTube"],
            ].map(([head, ...links]) => (
              <div key={head}>
                <p className="mb-4 text-sm text-white/55">{head}</p>
                <div className="grid gap-2 text-sm">
                  {links.map((label) => (
                    <Link key={label} href="#" className="text-white/90 hover:text-[#58c7e8]">
                      {label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="mx-auto mt-16 flex max-w-[1800px] flex-col gap-4 border-t border-white/15 pt-8 text-sm text-white/60 lg:flex-row lg:items-center lg:justify-between">
          <strong className="text-2xl text-white">capco.</strong>
          <span>&copy;2026 CAPCO Capacitors. All Rights Reserved.</span>
          <div className="flex flex-wrap gap-4 text-white">
            <Link href="/privacy-policy">Privacy Policy</Link>
            <Link href="/terms-and-conditions">Terms & Conditions</Link>
            <Link href="/cookie-policy">Cookie Policy</Link>
          </div>
          <span className="inline-flex items-center gap-2">
            <Mail size={16} /> sales@capco.example
          </span>
        </div>
      </footer>
    </>
  );
}
