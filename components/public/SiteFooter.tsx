"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { FormEvent } from "react";
import styles from "./SiteFooter.module.css";

const enquiry = (subject: string) =>
  `mailto:info@capcocapacitor.com?subject=${encodeURIComponent(subject)}`;

const socialLinks = [
  ["Instagram", enquiry("Instagram contact")],
  ["LinkedIn", enquiry("LinkedIn contact")],
  ["Facebook", enquiry("Facebook contact")],
  ["YouTube", enquiry("YouTube contact")],
] as const;

// Planned pages use relevant existing sections or the enquiry desk until published.
const linkGroups = [
  {
    title: "Company",
    links: [
      ["Home", "/"], ["About", "/about"], ["Gallery", "/gallery"],
      ["Awards & Achievements", "/about#compliance"],
      ["Careers", enquiry("Careers")], ["Contact", "/contact"],
    ],
  },
  {
    title: "Solutions",
    links: [
      ["OEMs", "/solutions/oem"],
      ["Dealership", "/contact?category=dealership#enquiry-form"],
      ["Industrial Enquiry", "/solutions/industrial-enquiry"],
    ],
  },
  {
    title: "Global Footprint",
    links: ["UAE", "USA", "Sri Lanka", "Bangladesh", "Turkey", "African Continent"]
      .map((country) => [country, enquiry(`${country} export enquiry`)]),
  },
  {
    title: "Media",
    links: [
      ["Newsroom", "/#projects"],
      ["Corporate Social Responsibility", enquiry("Corporate Social Responsibility")],
      ["Awards", "/about#compliance"], ["Certifications", "/about#compliance"],
    ],
  },
  { title: "Social", links: socialLinks },
];

export function SiteFooter({ showPartnerCta = true }: { showPartnerCta?: boolean }) {
  function handleNewsletter(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const email = new FormData(event.currentTarget).get("email");
    window.location.href = `${enquiry("Newsletter Signup")}&body=${encodeURIComponent(
      `Please subscribe ${email} to CAPCO updates.`
    )}`;
  }

  return (
    <>
      {showPartnerCta && (
        <section id="contact" className="relative grid min-h-[560px] place-items-center overflow-hidden bg-[#121212] px-6 py-24 text-white lg:min-h-[720px] lg:px-[60px]">
          <div className="pointer-events-none absolute inset-0" aria-hidden="true"><span className="absolute left-1/2 top-1/2 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" /><span className="absolute left-1/2 top-1/2 h-[980px] w-[980px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.06]" /><span className="absolute left-1/2 top-1/2 h-[1500px] w-[1500px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.04]" /><div className="absolute left-1/2 top-1/2 h-[636px] w-[636px] -translate-x-1/2 -translate-y-1/2 bg-contain bg-no-repeat" style={{ backgroundImage: 'url("/figma/solutions/527c0.svg")' }} /><div className="absolute left-1/2 top-1/2 h-[856px] w-[856px] -translate-x-1/2 -translate-y-1/2 bg-contain bg-no-repeat" style={{ backgroundImage: 'url("/figma/solutions/9c1db.svg")' }} /></div>
          <div className="relative z-10 mx-auto max-w-[860px] text-center"><h2 className="text-[36px] font-normal leading-[1.15] tracking-[-0.05em] sm:text-[42px] lg:text-[48px]">Ready to Partner?</h2><p className="mx-auto mt-6 max-w-[860px] text-[16px] leading-[1.42] text-white/90 lg:mt-8 lg:text-[18px]">Whether you need a single custom capacitor or a complete supply chain partnership, our OEM team is ready to support your requirements with technical expertise, competitive pricing, and reliable delivery.</p><Link href="/contact?category=oem#enquiry-form" className="mt-8 inline-flex min-h-[56px] min-w-[200px] items-end justify-between gap-4 bg-[#4E76F5] px-4 pb-3 pt-6 text-[14px] font-semibold text-white transition hover:-translate-y-0.5 hover:brightness-105" style={{ clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%)" }}><span>Request OEM Pricing</span><ArrowRight size={16} /></Link></div>
        </section>
      )}
      <footer className={styles.footer} aria-label="Site footer">
      <div className={styles.background} aria-hidden="true" />
      <div className={styles.content}>
        <div className={styles.top}>
          <div className={styles.newsletter}>
            <h2 className={styles.newsletterTitle}>Join our Newsletter</h2>
            <form onSubmit={handleNewsletter} className={styles.form}>
              <input
                type="email"
                name="email"
                autoComplete="email"
                required
                aria-label="Email address for newsletter"
                aria-describedby="newsletter-help"
                placeholder="Your email"
              />
              <button type="submit">Sign Up</button>
              <span id="newsletter-help" className="sr-only">
                Opens your email app to request a newsletter subscription.
              </span>
            </form>
            <div className={styles.contactCard}>
              <p className={styles.contactHeading}>Locate Us</p>
              <p>DADA ENERGIES (P) LTD.<br />Medak District,<br />Hyderabad,<br />Telangana- 502336.</p>
              <p className={styles.contactHeading}>Get In Touch</p>
              <p><a href="tel:+919848014000">+91-9848014000</a><br /><a href="mailto:info@capcocapacitor.com">info@capcocapacitor.com</a></p>
            </div>
          </div>

          <nav className={styles.links} aria-label="Footer navigation">
            {linkGroups.map((group) => (
              <div className={styles.group} key={group.title}>
                <h3>{group.title}</h3>
                <ul>
                  {group.links.map(([label, href]) => (
                    <li key={label}>
                      <Link href={href} prefetch={false}>{label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className={styles.bottom}>
          <Link href="/" aria-label="CAPCO home" className={styles.brand}>
            <Image src="/figma/solutions/caef4.png" alt="CAPCO Capacitors" width={95} height={34} priority />
          </Link>
          <span className={styles.copyright}>©2026 Capco Capacitors</span>
          <div className={styles.legal}>
            <Link href="/privacy-policy">Privacy Policy</Link>
            <Link href="/terms-and-conditions">Terms &amp; Conditions</Link>
          </div>
          <div className={styles.credits}>
            <span>All Rights Reserved.</span>
            <span>Website by Asterisks.Inc</span>
          </div>
        </div>
      </div>
      </footer>
    </>
  );
}
