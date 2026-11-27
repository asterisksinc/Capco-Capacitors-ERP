"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { FormEvent } from "react";
import styles from "./SiteFooter.module.css";

const enquiry = (subject: string) =>
  `mailto:info@capcocapacitor.com?subject=${encodeURIComponent(subject)}`;

const FACEBOOK_URL = "https://www.facebook.com/capcocapacitorssocial";
const INSTAGRAM_URL = "https://www.instagram.com/capco_capacitors/";
const YOUTUBE_URL = "https://www.youtube.com/@CapcoCapacitors";

const socialLinks = [
  ["Instagram", INSTAGRAM_URL],
  ["LinkedIn", enquiry("LinkedIn contact")],
  ["Facebook", FACEBOOK_URL],
  ["YouTube", YOUTUBE_URL],
] as const;

/** Brand icons (simple-icons paths, 24x24). */
const socialIcons = [
  { label: "Facebook", href: FACEBOOK_URL, path: "M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z" },
  { label: "Instagram", href: INSTAGRAM_URL, path: "M7.03.084c-1.277.06-2.149.264-2.91.563a5.874 5.874 0 0 0-2.124 1.388 5.878 5.878 0 0 0-1.38 2.127C.321 4.926.12 5.8.064 7.076.008 8.354-.005 8.764.001 12.023c.007 3.259.021 3.667.083 4.947.061 1.277.264 2.149.563 2.911.308.789.72 1.457 1.388 2.123a5.872 5.872 0 0 0 2.129 1.38c.763.295 1.636.496 2.913.552 1.278.056 1.689.069 4.947.063 3.257-.007 3.668-.021 4.947-.082 1.28-.06 2.147-.265 2.91-.563a5.881 5.881 0 0 0 2.123-1.388 5.881 5.881 0 0 0 1.38-2.129c.295-.763.496-1.636.551-2.912.056-1.28.07-1.69.063-4.948-.006-3.258-.02-3.667-.081-4.947-.06-1.28-.264-2.148-.564-2.911a5.892 5.892 0 0 0-1.387-2.123 5.857 5.857 0 0 0-2.128-1.38C19.074.322 18.202.12 16.924.066 15.647.009 15.236-.006 11.977 0 8.718.008 8.31.021 7.03.084m.14 21.693c-1.17-.05-1.805-.245-2.228-.408a3.736 3.736 0 0 1-1.382-.895 3.695 3.695 0 0 1-.9-1.378c-.165-.423-.363-1.058-.417-2.228-.06-1.264-.072-1.644-.08-4.848-.006-3.204.006-3.583.061-4.848.05-1.169.246-1.805.408-2.228.216-.561.477-.96.895-1.382a3.705 3.705 0 0 1 1.379-.9c.423-.165 1.057-.361 2.227-.417 1.265-.06 1.644-.072 4.848-.08 3.203-.006 3.583.006 4.85.062 1.168.05 1.804.244 2.227.408.56.216.96.475 1.382.895.421.42.681.817.9 1.378.165.422.362 1.056.417 2.227.06 1.265.074 1.645.08 4.848.005 3.203-.006 3.583-.061 4.848-.051 1.17-.245 1.805-.408 2.23-.216.56-.477.96-.896 1.38a3.705 3.705 0 0 1-1.378.9c-.422.165-1.058.362-2.226.418-1.266.06-1.645.072-4.85.079-3.204.007-3.582-.006-4.848-.06m9.783-16.192a1.44 1.44 0 1 0 1.437-1.442 1.44 1.44 0 0 0-1.437 1.442M5.839 12.012a6.161 6.161 0 1 0 12.323-.024 6.162 6.162 0 0 0-12.323.024M8 12.008A4 4 0 1 1 12.008 16 4 4 0 0 1 8 12.008" },
  { label: "YouTube", href: YOUTUBE_URL, path: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" },
] as const;

// Planned pages use relevant existing sections or the enquiry desk until published.
const linkGroups = [
  {
    title: "Company",
    links: [
      ["Home", "/"], ["About", "/about"], ["Gallery", "/gallery"],
      ["Awards & Achievements", "/gallery?filter=awards"],
      ["Contact", "/contact"],
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
    links: [
      ["UAE", "/regions/uae"], ["USA", "/regions/usa"], ["Sri Lanka", "/regions/sri-lanka"],
      ["Bangladesh", "/regions/bangladesh"], ["Turkey", "/regions/turkey"],
      ["African Continent", "/regions/africa"], ["Egypt", "/regions/egypt"],
    ],
  },
  {
    title: "Media",
    links: [
      ["Awards", "/gallery?filter=awards"], ["Certifications", "/gallery?filter=certifications"],
    ],
  },
  { title: "Social", links: socialLinks },
];

/** Final "Ready to Partner?" CTA: the home page version, used before the footer on every public page. */
export function PartnerCtaSection({
  title = "Ready to Partner?",
  body = "Whether you need a single custom capacitor or a complete supply chain partnership, our OEM team is ready to support your requirements with technical expertise, competitive pricing, and reliable delivery.",
  button = "Request OEM Pricing",
  href = "/contact?category=oem#enquiry-form",
}: { title?: string; body?: string; button?: string; href?: string } = {}) {
  return (
    <section id="contact" className="relative grid min-h-[560px] place-items-center overflow-hidden bg-[#121212] px-6 py-24 text-white lg:min-h-[720px] lg:px-[60px]">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true"><span className="absolute left-1/2 top-1/2 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" /><span className="absolute left-1/2 top-1/2 h-[980px] w-[980px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.06]" /><span className="absolute left-1/2 top-1/2 h-[1500px] w-[1500px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.04]" /><div className="absolute left-1/2 top-1/2 h-[636px] w-[636px] -translate-x-1/2 -translate-y-1/2 bg-contain bg-no-repeat" style={{ backgroundImage: 'url("/figma/solutions/527c0.svg")' }} /><div className="absolute left-1/2 top-1/2 h-[856px] w-[856px] -translate-x-1/2 -translate-y-1/2 bg-contain bg-no-repeat" style={{ backgroundImage: 'url("/figma/solutions/9c1db.svg")' }} /></div>
      <div className="relative z-10 mx-auto max-w-[860px] text-center"><h2 className="type-h2 font-normal">{title}</h2><p className="type-lead mx-auto mt-6 max-w-[860px] text-white/90 lg:mt-8">{body}</p><Link href={href} className="mt-8 inline-flex min-h-[56px] min-w-[200px] items-end justify-between gap-4 bg-[#4E76F5] px-4 pb-3 pt-6 text-[14px] font-semibold text-white transition hover:-translate-y-0.5 hover:brightness-105" style={{ clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%)" }}><span>{button}</span><ArrowRight size={16} /></Link></div>
    </section>
  );
}

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
      {showPartnerCta && <PartnerCtaSection />}
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
              <p>Dada Energies Pvt. Ltd.,<br />Medak District, Hyderabad,<br />Telangana - 502336</p>
              <p className={styles.contactHeading}>Get In Touch</p>
              <p><a href="tel:+919848014000">+91 9848014000</a><br /><a href="mailto:info@capcocapacitor.com">info@capcocapacitor.com</a></p>
              <div className={styles.socialIcons}>
                {socialIcons.map((icon) => (
                  <a key={icon.label} href={icon.href} target="_blank" rel="noopener noreferrer" aria-label={`CAPCO on ${icon.label}`} title={icon.label}>
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                      <path d={icon.path} />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          </div>

          <nav className={styles.links} aria-label="Footer navigation">
            {linkGroups.map((group) => (
              <div className={styles.group} key={group.title}>
                <h3>{group.title}</h3>
                <ul>
                  {group.links.map(([label, href]) => (
                    <li key={label}>
                      {href.startsWith("http") ? (
                        <a href={href} target="_blank" rel="noopener noreferrer">{label}</a>
                      ) : (
                        <Link href={href} prefetch={false}>{label}</Link>
                      )}
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
