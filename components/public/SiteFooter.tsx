"use client";

import Image from "next/image";
import Link from "next/link";
import type { FormEvent } from "react";
import styles from "./SiteFooter.module.css";

const enquiry = (subject: string) =>
  `mailto:sales@capcocapacitor.com?subject=${encodeURIComponent(subject)}`;

// Use the contact desk until CAPCO's official profile URLs are configured.
const socialLinks = [
  ["Instagram", process.env.NEXT_PUBLIC_INSTAGRAM_URL || enquiry("Instagram contact")],
  ["LinkedIn", process.env.NEXT_PUBLIC_LINKEDIN_URL || enquiry("LinkedIn contact")],
  ["Facebook", process.env.NEXT_PUBLIC_FACEBOOK_URL || enquiry("Facebook contact")],
  ["YouTube", process.env.NEXT_PUBLIC_YOUTUBE_URL || enquiry("YouTube contact")],
];

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
  { title: "Contact", links: socialLinks },
];

export function SiteFooter() {
  function handleNewsletter(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const email = new FormData(event.currentTarget).get("email");
    window.location.href = `${enquiry("Newsletter Signup")}&body=${encodeURIComponent(
      `Please subscribe ${email} to CAPCO updates.`
    )}`;
  }

  return (
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
  );
}
